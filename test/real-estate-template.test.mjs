import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import vm from 'node:vm';
import {listTemplateDirectories, templateArea, renderShowcasePage} from '../scripts/showcase-lib.mjs';
const base = new URL('../src/limiar-imobiliaria/', import.meta.url);
const context = vm.createContext({});
vm.runInContext(await readFile(new URL('assets/data.js', base), 'utf8'), context);
const {properties, filterProperties} = context.Limiar;

test('Limiar is discoverable in its own catalogue category and all local links resolve', async () => {
  const templates = await listTemplateDirectories();
  const template = templates.find(t => t.slug === 'limiar-imobiliaria');
  assert.equal(template.name, 'Limiar');
  assert.equal(templateArea(template), 'Imobiliário');
  assert.ok(renderShowcasePage(templates).includes('data-filter="Imobiliário"'));
  const html = await readFile(new URL('index.html', base), 'utf8');
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const [, link] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (link.startsWith('#')) assert.ok(ids.has(link.slice(1)), link);
    else if (!link.startsWith('https:')) await access(new URL(link, base));
  }
  await access(new URL('assets/architecture.svg', base));
});

test('filters combine location, typology and inclusive maximum price without changing source order', () => {
  assert.equal(filterProperties().length, 4);
  assert.equal(filterProperties({location:'Porto'}).length, 2);
  assert.equal(filterProperties({location:'Porto', type:'T1', price:295000})[0].id, 'cedofeita');
  assert.equal(filterProperties({location:'Porto', type:'T1', price:294999}).length, 0);
  assert.equal(filterProperties({location:'Lisboa', type:'T4'}).length, 0);
  const original = properties.map(p => p.id).join();
  assert.equal(filterProperties({sort:'asc'})[0].id, 'cedofeita');
  assert.equal(filterProperties({sort:'desc'})[0].id, 'casa-cascais');
  assert.equal(properties.map(p => p.id).join(), original);
});

test('favorite view supports empty selections and combines with the search filters', () => {
  assert.equal(filterProperties({favorites:[]}).length, 0);
  assert.equal(filterProperties({favorites:['unknown']}).length, 0);
  const favorites = ['cedofeita','luz-na-estrela'];
  assert.equal(filterProperties({favorites}).length, 2);
  assert.equal(filterProperties({favorites,location:'Porto'})[0].id, 'cedofeita');
  assert.equal(filterProperties({favorites,location:'Cascais'}).length, 0);
});

test('each listing has unique deep-link data and complete factual fields', () => {
  assert.equal(new Set(properties.map(p => p.id)).size, properties.length);
  for (const p of properties) {
    assert.match(p.id, /^[a-z-]+$/);
    assert.ok(p.price > 0 && p.area > 0 && p.baths > 0);
    assert.ok(p.title && p.description && p.energy && p.photo && p.neighborhood);
  }
});
