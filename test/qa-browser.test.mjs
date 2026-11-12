import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { templateRoutes } from './qa/routes.mjs';

const requiredRules = new Set(['region', 'landmark-one-main', 'page-has-heading-one', 'heading-order', 'label', 'image-alt', 'button-name', 'link-name', 'color-contrast']);
// Explicitly include this experimental rule in axe 4.11 (compatible with Node 20).
const axeOptions = { rules: { 'label-content-name-mismatch': { enabled: true } } };
const failures = result => result.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.map(n => n.target.join(' ')).join(', ')}`);

test('QA: accessibility, keyboard and local link integrity', { timeout: 180000 }, async t => {
  const server = spawn(process.execPath, ['scripts/showcase-server.mjs'], { env: { ...process.env, HOST: '127.0.0.1', PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    const base = await new Promise((resolve, reject) => {
      server.stdout.on('data', data => { const match = String(data).match(/http:\/\/\S+/); if (match) resolve(match[0]); });
      server.once('exit', code => reject(new Error(`QA server exited: ${code}`)));
      server.once('error', reject);
    });
    browser = await chromium.launch();
    const context = await browser.newContext();
    // External demo services are outside the deterministic local QA contract.
    await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await context.newPage();
    const axe = async (route, shell = false) => {
      const builder = new AxeBuilder({ page }).options(axeOptions);
      if (shell) builder.exclude('iframe'); // Templates are audited separately from the viewer shell.
      const result = await builder.analyze();
      assert.deepEqual(failures({ violations: result.violations.filter(v => ['critical', 'serious'].includes(v.impact) || requiredRules.has(v.id)) }), [], route);
    };
    await t.test('catalogue and viewer axe: light, dark, system and mobile', async () => {
      await page.goto(base);
      for (const theme of ['light', 'dark', 'system']) {
        await page.locator('#theme').selectOption(theme);
        await axe(`catalogue ${theme}`);
      }
      for (const colorScheme of ['dark', 'light']) {
        await page.emulateMedia({ colorScheme });
        await page.waitForFunction(value => document.documentElement.dataset.theme === value, colorScheme);
        await axe(`catalogue system ${colorScheme}`);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await axe('mobile catalogue');
      await page.goto(`${base}/templates/cafe-aurora`);
      await axe('viewer', true);
    });
    await t.test('keyboard search, filters, preview, devices and focus restoration', async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(base);
      const search = page.locator('#search');
      await search.focus();
      await page.keyboard.type('no-such-template-qa');
      await page.locator('#no-results').waitFor({ state: 'visible' });
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('#sort').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await search.evaluate(el => el === document.activeElement), true);
      const filter = page.locator('[data-filter]:not([data-filter="all"])').first();
      await filter.focus();
      await page.keyboard.press('Enter');
      assert.equal(await filter.getAttribute('aria-pressed'), 'true');
      const area = await filter.getAttribute('data-filter');
      assert.ok((await page.locator('.template-card:visible').evaluateAll(cards => cards.map(c => c.dataset.area))).every(value => value === area));
      const trigger = page.locator('[data-preview]:visible').first();
      await trigger.focus();
      await page.keyboard.press('Enter');
      await page.locator('dialog').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
      for (const device of ['mobile', 'tablet', 'desktop']) {
        const button = page.locator(`[data-device="${device}"]`);
        await button.focus();
        await page.keyboard.press('Space');
        assert.equal(await button.getAttribute('aria-pressed'), 'true');
      }
      await axe('preview shell', true);
      await page.keyboard.press('Escape');
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      await page.locator('#close-preview').focus();
      await page.keyboard.press('Enter');
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#area-select').focus();
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      assert.notEqual(await page.locator('#area-select').inputValue(), 'all');
    });
    await t.test('representative template axe: no new serious/critical findings', async t => {
      const baseline = JSON.parse(await readFile(new URL('./qa/template-baseline.json', import.meta.url), 'utf8'));
      for (const route of templateRoutes) {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(base + route);
        const result = await new AxeBuilder({ page }).options(axeOptions).analyze();
        const findings = result.violations.filter(v => ['serious', 'critical'].includes(v.impact))
          .flatMap(v => v.nodes.map(n => ({ rule: v.id, impact: v.impact, target: n.target })));
        const known = baseline[route] || [];
        const unexpected = findings.filter(f => !known.some(k => JSON.stringify(k) === JSON.stringify(f)));
        t.diagnostic(`${route}: ${findings.length} known findings (see docs/qa.md)`);
        assert.deepEqual(unexpected, [], route);
      }
    });
    await t.test('link checker rejects broken paths, fragments and nested CSS assets', async () => {
      const fixture = createServer((req, res) => {
        if (req.url === '/') { res.setHeader('content-type', 'text/html'); res.end('<a href="/target#missing-anchor">Link</a><img srcset="/missing.webp 2x"><link rel="stylesheet" href="/style.css">'); }
        else if (req.url === '/target') { res.setHeader('content-type', 'text/html'); res.end('<h1 id="exists">Target</h1>'); }
        else if (req.url === '/style.css') { res.setHeader('content-type', 'text/css'); res.end('@import "/nested.css";'); }
        else if (req.url === '/nested.css') { res.setHeader('content-type', 'text/css'); res.end('body { background: url(/missing.svg) }'); }
        else { res.statusCode = 404; res.end('missing'); }
      });
      await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
      const fixtureContext = await browser.newContext();
      try {
        const { checkLinks } = await import('./qa/links.mjs');
        const fixturePage = await fixtureContext.newPage();
        await assert.rejects(checkLinks(fixturePage, fixtureContext.request, `http://127.0.0.1:${fixture.address().port}`, ['/']), error => {
          for (const expected of ['missing-anchor', 'missing.webp', 'missing.svg']) assert.ok(error.message.includes(expected), error.message);
          return true;
        });
      } finally {
        await fixtureContext.close();
        await new Promise(resolve => fixture.close(resolve));
      }
    });
    await t.test('local href, anchors, src, srcset and CSS assets', async () => {
      const { checkLinks } = await import('./qa/links.mjs');
      await checkLinks(page, context.request, base, ['/', ...templateRoutes, ...templateRoutes.map(r => `/templates/${r.split('/')[2]}`)]);
    });
  } finally {
    await browser?.close();
    server.kill();
  }
});
