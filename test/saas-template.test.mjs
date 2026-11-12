import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = new URL('../src/orbit-saas/', import.meta.url);
test('Orbit is discoverable and all local destinations exist', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'orbit-saas');
  assert.equal(template.name, 'Orbit');
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), target);
    else if (!/^https?:/.test(target)) await access(new URL(target, directory));
  }
});

test('billing switches prices and descriptions in both directions', async () => {
  const element = (dataset = {}) => ({
    dataset, attributes: {}, listeners: {}, textContent: '',
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelectorAll() { return []; },
  });
  const monthly = element({ billing: 'monthly' });
  const yearly = element({ billing: 'yearly' });
  const prices = [element({ price: '12', annual: '9,60' }), element({ price: '24', annual: '19,20' })];
  const notes = [element(), element()];
  const document = {
    querySelector() { return element(); },
    querySelectorAll(selector) {
      return ({ '[data-billing]': [monthly, yearly], '[data-price]': prices, '[data-note]': notes })[selector] || [];
    },
    addEventListener() {},
  };
  vm.runInNewContext(await readFile(new URL('assets/main.js', directory), 'utf8'), { document });
  yearly.listeners.click();
  assert.deepEqual(prices.map(price => price.textContent), ['9,60', '19,20']);
  assert.equal(yearly.attributes['aria-pressed'], 'true');
  assert.equal(monthly.attributes['aria-pressed'], 'false');
  assert.match(notes[0].textContent, /anualmente/);
  monthly.listeners.click();
  assert.deepEqual(prices.map(price => price.textContent), ['12', '24']);
  assert.equal(monthly.attributes['aria-pressed'], 'true');
  assert.match(notes[0].textContent, /mensalmente/);
});
