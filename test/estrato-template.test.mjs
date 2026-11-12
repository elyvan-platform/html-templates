import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const root = new URL('../src/estrato-startup/', import.meta.url);

test('Estrato is discoverable, categorised, and has valid local assets and anchors', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'estrato-startup');
  assert.equal(template.name, 'Estrato');
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', root), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), target);
    else await access(new URL(target, root));
  }
  assert.match(html, /type="submit" disabled/);
});

function element(dataset = {}) {
  return { dataset, hidden: false, attributes: {}, listeners: {}, value: '', textContent: '',
    addEventListener(type, callback) { this.listeners[type] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name]; },
    focus() { this.focused = true; },
    setCustomValidity(message) { this.validityMessage = message; },
  };
}
async function setup() {
  const menu = element(), nav = element(), form = element(), status = element(), submit = element();
  const fields = { name: element(), message: element() };
  fields.name.value = 'Inês'; fields.message.value = 'Uma parceria industrial';
  form.querySelector = () => submit;
  form.elements = { namedItem: name => fields[name] };
  form.reportValidity = () => !Object.values(fields).some(field => field.validityMessage);
  form.reset = () => { form.resetCalled = true; };
  const buttons = ['madeira', 'textil', 'embalagens'].map(material => element({ material }));
  const outputs = Object.fromEntries(['region', 'title', 'quantity', 'matches', 'distance', 'source', 'type', 'destination', 'use', 'note'].map(key => [`material-${key}`, element()]));
  const selectors = { '.menu-toggle': menu, '#navigation': nav, '#contact-form': form, '#form-status': status };
  const media = { matches: true, addEventListener(type, callback) { this.change = callback; } };
  const document = { querySelector: key => selectors[key], querySelectorAll: () => buttons, getElementById: key => outputs[key] };
  vm.runInNewContext(await readFile(new URL('assets/main.js', root), 'utf8'), { document, window: { matchMedia: () => media } });
  return { menu, nav, form, status, buttons, outputs, fields, media };
}

test('material selector supports matches, empty state, and returning to the initial scenario', async () => {
  const { buttons, outputs } = await setup();
  buttons[1].listeners.click();
  assert.equal(outputs['material-matches'].textContent, '02');
  assert.equal(outputs['material-source'].textContent, 'Trama do Norte');
  assert.equal(buttons[1].attributes['aria-pressed'], 'true');
  buttons[2].listeners.click();
  assert.equal(outputs['material-matches'].textContent, '00');
  assert.match(outputs['material-note'].textContent, /Ainda não existem destinos/);
  buttons[0].listeners.click();
  assert.equal(outputs['material-matches'].textContent, '03');
  assert.equal(buttons[2].attributes['aria-pressed'], 'false');
});

test('mobile menu supports toggle, Escape, link selection, and resizing', async () => {
  const { menu, nav, media } = await setup();
  assert.equal(nav.hidden, true);
  menu.listeners.click();
  assert.equal(nav.hidden, false);
  assert.equal(menu.attributes['aria-expanded'], 'true');
  nav.listeners.keydown({ key: 'Escape' });
  assert.equal(nav.hidden, true);
  assert.equal(menu.focused, true);
  menu.listeners.click();
  nav.listeners.click({ target: { closest: () => ({}) } });
  assert.equal(nav.hidden, true);
  media.matches = false;
  media.change();
  assert.equal(nav.hidden, false);
  assert.equal(menu.hidden, true);
});

test('contact simulation rejects whitespace, clears errors and confirms without sending', async () => {
  const { form, fields, status } = await setup();
  let prevented = 0;
  const event = { preventDefault() { prevented++; } };
  fields.name.value = '   ';
  form.listeners.submit(event);
  assert.match(fields.name.validityMessage, /espaços/);
  assert.equal(form.resetCalled, undefined);
  fields.name.value = 'Inês';
  form.listeners.input({ target: fields.name });
  assert.equal(fields.name.validityMessage, '');
  form.listeners.submit(event);
  assert.equal(form.resetCalled, true);
  assert.match(status.textContent, /não foi enviado nem guardado/);
  assert.equal(status.focused, true);
  assert.equal(prevented, 2);
});
