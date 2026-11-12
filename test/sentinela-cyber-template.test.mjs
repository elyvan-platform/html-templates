import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = new URL('../src/sentinela-cyber/', import.meta.url);

test('Sentinela is discoverable and local destinations exist', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'sentinela-cyber');
  assert.equal(template.name, 'Sentinela Cyber');
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), target);
    else if (!/^(https?:|data:)/.test(target)) await access(new URL(target, directory));
  }
  for (const [, id] of html.matchAll(/aria-(?:controls|describedby)="([^"]+)"/g)) assert.ok(ids.has(id), id);
});

test('contact validation reports errors and accepts valid input', () => {
  const { validate } = createRequire(import.meta.url)('../src/sentinela-cyber/assets/main.js');
  assert.deepEqual(Object.keys(validate({})).sort(), ['email', 'mensagem', 'nome', 'servico']);
  assert.ok(validate({ nome: 'Ana', email: 'ana@', servico: 'SOC gerido', mensagem: 'x'.repeat(25) }).email);
  assert.deepEqual(validate({ nome: 'Ana Silva', email: 'ana@empresa.pt', servico: 'SOC gerido', mensagem: 'Gostaria de uma avaliação do SOC.' }), {});
});
