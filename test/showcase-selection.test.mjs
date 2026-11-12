import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

test('favorites and comparison persist and follow catalogue filters', { timeout: 60000 }, async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
    await page.goto(pathToFileURL(path.resolve('index.html')).href);
    const cards = page.locator('.template-card');
    const ids = await cards.evaluateAll(nodes => nodes.slice(0, 4).map(node => node.dataset.slug));
    const card = id => page.locator(`.template-card[data-slug="${id}"]`);
    await card(ids[0]).locator('[data-favorite]').click();
    for (const id of ids) await card(id).locator('[data-compare]').click();
    assert.match(await page.locator('#selection-status').textContent(), /Limite de 3/);
    await page.reload();
    assert.equal(await card(ids[0]).locator('[data-favorite]').getAttribute('aria-pressed'), 'true');
    assert.equal(await card(ids[3]).locator('[data-compare]').getAttribute('aria-pressed'), 'false');
    await page.locator('#favorites-view').click();
    assert.equal(await cards.locator('visible=true').count(), 1);
    await page.locator('#search').fill('sem resultado xyz');
    assert.equal(await page.locator('#no-results').isVisible(), true);
    await page.locator('#search').fill('');
    await page.locator('#open-comparison').click();
    assert.equal(await page.locator('.comparison-item').count(), 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
    await page.locator('.comparison-item button[aria-label^="Remover"]').first().click();
    assert.equal(await page.locator('.comparison-item').count(), 2);
    await page.locator('#back-catalogue').click();
    await page.locator('#favorites-view').click();
    await card(ids[3]).locator('[data-compare]').click();
    await page.locator('#clear-comparison').click();
    assert.match(await page.locator('#open-comparison').textContent(), /0\/3/);
    await page.reload();
    assert.match(await page.locator('#open-comparison').textContent(), /0\/3/);
  } finally { await browser.close(); }
});
