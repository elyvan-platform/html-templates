import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

test('o showcase automóvel aparece na montra e as ligações locais existem', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'automotive-showcase');
  assert.equal(template?.name, 'Velocitá Garage');
  assert.equal(templateArea(template), 'Automóvel');
  const directory = path.join(process.cwd(), 'src/automotive-showcase');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else if (!/^(https?:|mailto:|tel:)/.test(target)) await access(path.join(directory, target));
  }
  for (const [, target] of html.matchAll(/for="([^"]+)"/g)) assert.ok(ids.has(target), `Label sem campo: ${target}`);
  const index = await readFile(path.join(process.cwd(), 'index.html'), 'utf8');
  assert.ok(index.includes('./src/automotive-showcase/index.html'));
});
