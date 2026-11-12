import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = ['chromium', 'chromium-browser', 'google-chrome'].find(name => spawnSync('which', [name]).status === 0);

test('showcase fits critical viewports, including long names and the preview', { skip: !browser, timeout: 60000 }, async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'showcase-browser-'));
  const chrome = spawn(browser, ['--headless', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${dir}`, 'about:blank'], { stdio: 'ignore' });
  let socket;
  try {
    let port;
    for (let i = 0; i < 100 && !port; i++) {
      try { port = (await readFile(path.join(dir, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; }
      catch { await new Promise(resolve => setTimeout(resolve, 100)); }
    }
    assert.ok(port, 'Chromium did not start');
    const [tab] = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    socket = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let id = 0;
    const pending = new Map();
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        message.error ? reject(new Error(message.error.message)) : resolve(message.result);
      }
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const current = ++id;
      pending.set(current, { resolve, reject });
      socket.send(JSON.stringify({ id: current, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    await send('Page.enable');
    await send('Page.navigate', { url: pathToFileURL(path.resolve('index.html')).href });
    await evaluate('new Promise(resolve => document.readyState === "complete" ? resolve() : addEventListener("load", resolve, {once:true}))');
    for (const width of [320, 360, 390, 430, 768]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: true });
      await evaluate(`document.querySelector('.template-body h2').textContent = 'NomeDeTemplateMuitoLongo'.repeat(8)`);
      const check = async label => {
        const sizes = await evaluate(`({viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, dialog: document.querySelector('dialog').open ? document.querySelector('dialog').scrollWidth : 0, dialogWidth: document.querySelector('dialog').clientWidth})`);
        assert.ok(sizes.document <= sizes.viewport, `${width}px ${label}: ${JSON.stringify(sizes)}`);
        assert.ok(sizes.dialog <= sizes.dialogWidth, `${width}px ${label}: ${JSON.stringify(sizes)}`);
      };
      await check('catalogue');
      await evaluate(`document.querySelector('[data-preview]').click(); document.querySelector('#preview-title').textContent = 'NomeDeTemplateMuitoLongo'.repeat(8)`);
      await check('preview');
      for (const device of ['mobile', 'tablet', 'desktop']) {
        await evaluate(`document.querySelector('[data-device="${device}"]').click()`);
        await check(device);
      }
      await evaluate(`document.querySelector('#close-preview').click()`);
    }
    assert.equal(await evaluate(`document.querySelector('#search').value = 'xyznotfound'; document.querySelector('#search').dispatchEvent(new Event('input')); document.querySelector('#no-results').hidden`), false);
    assert.equal(await evaluate(`document.querySelector('#reset-filters').click(); document.querySelector('#no-results').hidden`), true);
  } finally {
    socket?.close();
    chrome.kill();
    await new Promise(resolve => chrome.once('exit', resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
