import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

test('Linha Zero integra a montra e os seus recursos e âncoras existem', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'linha-zero');
  assert.equal(template?.name, 'Linha Zero');
  assert.equal(templateArea(template), 'Mobilidade');
  const directory = path.join(process.cwd(), 'src/linha-zero');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else await access(path.join(directory, target));
  }
  for (const image of ['coupe.jpg', 'moto.jpg']) await access(path.join(directory, 'assets', image));
  assert.match(html, /fictícios/);
});
