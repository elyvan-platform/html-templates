import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

test('favorites and comparison persist, survive filters, support keyboard navigation and clear safely', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const url = pathToFileURL(path.resolve('index.html')).href;
    await page.goto(url);
    const cards = page.locator('.template-card');
    const slug = await cards.first().getAttribute('data-slug');
    await cards.first().locator('[data-favorite]').focus();
    await page.keyboard.press('Enter');
    for (let i = 0; i < 4; i++) await cards.nth(i).locator('[data-compare]').click();
    assert.match(await page.locator('#selection-status').textContent(), /Limite de 3/);
    assert.equal(await page.locator('[data-compare][aria-pressed=true]').count(), 3);
    await page.locator('#search').fill('nothing-matches-this');
    assert.equal(await page.locator('.template-card:visible').count(), 0);
    assert.equal(await page.locator('#comparison-selection button').count(), 3);
    await page.locator('#open-comparison').click();
    assert.equal(await page.locator('#comparison-columns article').count(), 3);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#open-comparison').evaluate(el => el === document.activeElement), true);
    await page.reload();
    assert.equal(await page.locator(`[data-slug="${slug}"] [data-favorite]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-compare][aria-pressed=true]').count(), 3);
    await page.locator('#favorites-view').click();
    assert.equal(await page.locator('.template-card:visible').count(), 1);
    await page.locator('#sort').selectOption('za');
    await page.locator('[data-filter=all]').click();
    assert.equal(await page.locator('.template-card:visible').count(), 1);
    await page.locator('#open-comparison').click();
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator('#comparison-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    }
    await page.locator('#comparison-columns button').first().click();
    assert.equal(await page.locator('#comparison-columns article').count(), 2);
    await page.locator('#close-comparison').click();
    await page.locator('#open-comparison').click();
    assert.equal(await page.locator('#comparison-columns article').count(), 2);
    await page.locator('#clear-comparison-dialog').click();
    assert.equal(await page.locator('#comparison-dialog').evaluate(el => el.open), false);
    assert.equal(await page.locator('#open-comparison').isDisabled(), true);
    await page.reload();
    assert.equal(await page.locator('#comparison-selection button').count(), 0);
    await cards.first().locator('[data-compare]').click();
    await page.locator('#clear-comparison').click();
    assert.equal(await page.locator('[data-compare][aria-pressed=true]').count(), 0);
    await page.evaluate(() => {
      const slugs = [...document.querySelectorAll('.template-card')].slice(0, 4).map(card => card.dataset.slug);
      localStorage.setItem('showcase-comparison', JSON.stringify(['removed-template', ...slugs, slugs[0]]));
    });
    await page.reload();
    assert.equal(await page.locator('[data-compare][aria-pressed=true]').count(), 3);
    await page.locator(`[data-slug="${slug}"] [data-favorite]`).click();
    assert.equal(await page.locator(`[data-slug="${slug}"] [data-favorite]`).getAttribute('aria-pressed'), 'false');
    await page.evaluate(() => {
      localStorage.setItem('showcase-favorites', '{broken');
      localStorage.setItem('showcase-comparison', JSON.stringify(['removed-template', null]));
    });
    await page.reload();
    await page.locator('#favorites-view').click();
    assert.equal(await page.locator('#favorites-empty').isVisible(), true);
    assert.equal(await page.locator('#open-comparison').isDisabled(), true);
    await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
    await page.reload();
    await cards.first().locator('[data-favorite]').click();
    assert.equal(await cards.first().locator('[data-favorite]').getAttribute('aria-pressed'), 'true');
  } finally { await browser.close(); }
});
