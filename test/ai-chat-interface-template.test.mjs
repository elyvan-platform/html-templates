import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = new URL('../src/ai-chat-interface/', import.meta.url);

test('ai chat interface is discoverable and local destinations exist', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'ai-chat-interface');
  assert.equal(template.name, 'Lume Chat');
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) { if (target.length > 1) assert.ok(ids.has(target.slice(1)), target); }
    else if (!/^(https?:|data:)/.test(target)) await access(new URL(target, directory));
  }
  assert.match(html, /DEMO/);
});

test('every script selector id exists in the markup and the script parses', async () => {
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const js = await readFile(new URL('assets/main.js', directory), 'utf8');
  new vm.Script(js);
  for (const [, id] of js.matchAll(/\$\('#([\w-]+)'\)/g)) if (id !== 'live-body') assert.ok(html.includes(`id="${id}"`), id);
});
