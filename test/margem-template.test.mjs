import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const base = new URL('../src/margem-revista/', import.meta.url);
const source = readFileSync(new URL('assets/data.js', base), 'utf8') + readFileSync(new URL('assets/main.js', base), 'utf8');
function element(value = '') {
  return { value, innerHTML: '', textContent: '', hidden: false, attrs: {}, handlers: {}, dataset: {}, addEventListener(k, fn) { this.handlers[k] = fn; }, setAttribute(k,v) { this.attrs[k] = v; }, focus() { this.focused = true; }, reset() { this.didReset = true; } };
}
function run(elements, search = '', buttons = []) {
  const classes = new Set();
  const document = { title: '', querySelector: s => elements[s] || null, querySelectorAll: () => buttons, body: { classList: { toggle(c) { if (classes.has(c)) { classes.delete(c); return false; } classes.add(c); return true; } } } };
  vm.runInNewContext(source, { document, location: { search }, URLSearchParams });
  return document;
}
test('magazine combines accent-insensitive search, categories, ordering and reset', () => {
  const ids = ['stories','pesquisa','sort','results','empty','search-form','reset','newsletter-form','newsletter-status'];
  const els = Object.fromEntries(ids.map(id => ['#'+id, element()]));
  els['#sort'].value = 'edition';
  const buttons = ['Todas','Cultura','Design','Tecnologia'].map(category => Object.assign(element(), { dataset: { category } }));
  run(els, '', buttons);
  assert.match(els['#results'].textContent, /6 histórias/);
  buttons[3].handlers.click();
  assert.match(els['#results'].textContent, /2 histórias/);
  els['#pesquisa'].value = 'memoria'; els['#pesquisa'].handlers.input();
  assert.match(els['#stories'].innerHTML, /memória digital/);
  els['#pesquisa'].value = 'inexistente'; els['#pesquisa'].handlers.input();
  assert.equal(els['#empty'].hidden, false);
  els['#reset'].handlers.click();
  assert.match(els['#results'].textContent, /6 histórias/);
  els['#sort'].value = 'short'; els['#sort'].handlers.change();
  assert.ok(els['#stories'].innerHTML.indexOf('id=oficinas') < els['#stories'].innerHTML.indexOf('id=cidade'));
  els['#newsletter-form'].handlers.submit({ preventDefault() {} });
  assert.match(els['#newsletter-status'].textContent, /Não foi feita qualquer subscrição/);
});
test('every local article renders its own content, TOC, assets and reversible reading mode', () => {
  for (const id of ['cidade','objetos','digital','oficinas','letras','arquivo']) {
    assert.ok(existsSync(new URL(`assets/${id}.svg`, base)));
    const els = { '#article': element(), '#reading-mode': element() };
    run(els, `?id=${id}`);
    assert.match(els['#article'].innerHTML, /id="parte-2"/);
    assert.match(els['#article'].innerHTML, /href="#parte-2"/);
    assert.equal((els['#article'].innerHTML.match(/class="story"/g) || []).length, 3);
    els['#reading-mode'].handlers.click();
    assert.equal(els['#reading-mode'].attrs['aria-pressed'], 'true');
    els['#reading-mode'].handlers.click();
    assert.equal(els['#reading-mode'].attrs['aria-pressed'], 'false');
  }
});
test('unknown article identifiers have a safe recovery state', () => {
  const els = { '#article': element() };
  run(els, '?id=%3Cscript%3E');
  assert.match(els['#article'].innerHTML, /não existe/);
  assert.doesNotMatch(els['#article'].innerHTML, /<script>/);
});
