import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { listTemplateDirectories, renderShowcasePage } from '../scripts/showcase-lib.mjs';

function setup() {
  const listeners = {};
  const control = (value = '') => ({ value, addEventListener: (event, fn) => { listeners[value + event] = fn; } });
  const search = control('');
  const sort = control('az');
  const areaSelect = control('all');
  const cards = [
    ['Árvore', 'b', 'Design', true], ['Árvore', 'a', 'Design', false],
    ['Zebra', 'z', 'Comércio', true], ['Casa', 'c', 'Design', false],
  ].map(([name, slug, area, featured]) => ({ dataset: { name, slug, area, search: `${name} ${area}` }, featured, hidden: false }));
  const grid = featured => ({ children: cards.filter(card => card.featured === featured), appendChild(card) { this.children.splice(this.children.indexOf(card), 1); this.children.push(card); } });
  const featuredGrid = grid(true), catalogueGrid = grid(false);
  const elements = { '#search': search, '#sort': sort, '#area-select': areaSelect, '#result-count': {}, '#no-results': {}, '#featured-section': {}, '#catalogue-section': {}, '#featured-grid': featuredGrid, '#catalogue-grid': catalogueGrid };
  const document = { querySelector: selector => elements[selector] || null, querySelectorAll: () => [] };
  const source = readFileSync(new URL('../scripts/showcase/ui.js', import.meta.url), 'utf8');
  const start = source.indexOf("let area = 'all';");
  const end = source.indexOf('const dialog =');
  const context = vm.createContext({ document, cards });
  vm.runInContext(source.slice(start, end), context);
  return { context, elements, cards, featuredGrid, catalogueGrid };
}

test('search, area and sorting combine across sections and reset correctly', () => {
  const { context, elements, featuredGrid, catalogueGrid } = setup();
  elements['#search'].value = 'arvore';
  vm.runInContext("setArea('Design')", context);
  assert.equal(elements['#result-count'].textContent, '2 de 4 templates');
  assert.equal(elements['#no-results'].hidden, true);
  elements['#sort'].value = 'za';
  vm.runInContext('filterCards()', context);
  assert.deepEqual(catalogueGrid.children.map(c => c.dataset.slug), ['c', 'a']);
  assert.deepEqual(featuredGrid.children.map(c => c.dataset.slug), ['z', 'b']);
  vm.runInContext("setArea('Comércio')", context);
  assert.equal(elements['#result-count'].textContent, '0 de 4 templates');
  assert.equal(elements['#no-results'].hidden, false);
  assert.equal(elements['#featured-section'].hidden, true);
  assert.equal(elements['#catalogue-section'].hidden, true);
  elements['#search'].value = '';
  vm.runInContext("setArea('all')", context);
  assert.equal(elements['#result-count'].textContent, '4 de 4 templates');
  assert.equal(elements['#featured-section'].hidden, false);
  assert.equal(elements['#catalogue-section'].hidden, false);
});

test('editorial metadata has safe defaults and renders each card once', async () => {
  const templates = await listTemplateDirectories();
  assert.equal(templates.filter(t => t.featured).length, 3);
  assert.ok(templates.every(t => typeof t.featured === 'boolean'));
  const html = renderShowcasePage(templates);
  for (const template of templates) assert.equal(html.split(`data-slug="${template.slug}"`).length - 1, 1);
  assert.match(html, /<label class="sort-control" for="sort">/);
  assert.match(html, /id="featured-title"/);
});
