import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';
const root = path.resolve('src/architecture-studio');
const script = await readFile(path.join(root, 'studio.js'), 'utf8');

test('architecture studio is discoverable with a preview and valid local navigation', async () => {
  const template = (await listTemplateDirectories()).find(t => t.slug === 'architecture-studio');
  assert.equal(template.name, 'Architecture Studio');
  assert.equal(templateArea(template), 'Arquitetura');
  assert.ok(template.previewHref);
  for (const file of ['index.html', 'casa.html', 'interior.html', 'volume.html']) {
    const html = await readFile(path.join(root, file), 'utf8');
    for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const [filePart, anchor] = target.split('#');
      const destination = filePart || file;
      await access(path.join(root, destination));
      if (anchor) {
        const linked = await readFile(path.join(root, destination), 'utf8');
        assert.ok(linked.includes(`id="${anchor}"`), `${file}: ${target}`);
      }
    }
  }
});

function element(dataset = {}) {
  return {dataset, hidden: false, textContent: '', attributes: {}, handlers: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    addEventListener(k, fn) { this.handlers[k] = fn; }};
}
test('filters select a typology, restore all projects and report an empty result', () => {
  const buttons = ['Todos', 'Habitação', 'Interiores', 'Equipamentos', 'Outra'].map(filter => element({filter}));
  const projects = ['Habitação', 'Interiores', 'Equipamentos'].map(category => element({category}));
  const result = element(), empty = element();
  vm.runInNewContext(script, {document: {
    querySelectorAll: selector => selector === '[data-filter]' ? buttons : projects,
    querySelector: selector => ({'#result': result, '#empty': empty}[selector] || null)
  }});
  buttons[2].handlers.click();
  assert.deepEqual(projects.map(p => p.hidden), [true, false, true]);
  assert.equal(buttons[2].attributes['aria-pressed'], 'true');
  assert.equal(result.textContent, '1 projeto apresentado');
  buttons[4].handlers.click();
  assert.equal(empty.hidden, false);
  buttons[0].handlers.click();
  assert.ok(projects.every(p => !p.hidden));
  assert.equal(result.textContent, '3 projetos apresentados');
  assert.equal(empty.hidden, true);
});

test('contact rejects whitespace and confirms valid demo without sending data', () => {
  const field = value => ({value, error: '', setCustomValidity(error) { this.error = error; }});
  const name = field('   '), message = field('                         ');
  const form = element();
  form.elements = {name, message};
  form.reportValidity = () => !name.error && !message.error;
  let resets = 0;
  form.reset = () => resets++;
  const status = element();
  vm.runInNewContext(script, {document: {
    querySelectorAll: () => [],
    querySelector: selector => selector === '#contact-form' ? form : status
  }});
  let prevented = false;
  form.handlers.submit({preventDefault() { prevented = true; }});
  assert.ok(prevented);
  assert.ok(name.error && message.error);
  assert.equal(resets, 0);
  name.value = 'Inês'; message.value = 'Gostaria de reabilitar uma casa no Porto.';
  form.handlers.submit({preventDefault() {}});
  assert.equal(resets, 1);
  assert.match(status.textContent, /não foram enviados nem guardados/);
});
