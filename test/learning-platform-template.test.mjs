import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

test('Trilho aparece na montra em Educação e as ligações locais existem', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'learning-platform');
  assert.equal(template?.name, 'Trilho');
  assert.ok(template.description);
  assert.equal(templateArea(template), 'Educação');
  const directory = path.join(process.cwd(), 'src/learning-platform');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#/')) continue;
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else if (!/^(https?:|mailto:|tel:)/.test(target)) await access(path.join(directory, target));
  }
});
