import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories } from '../scripts/showcase-lib.mjs';

test('o posto aparece na montra e as ligações locais existem', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'rota-norte');
  assert.equal(template?.name, 'Rota Norte');
  assert.ok(template.description);
  const directory = path.join(process.cwd(), 'src/rota-norte');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else if (!/^(https?:|mailto:|tel:)/.test(target)) await access(path.join(directory, target));
  }
});
