import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = new URL('../src/portfolio-developer/', import.meta.url);
test('developer portfolio is catalogued and its local destinations resolve', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'portfolio-developer');
  assert.ok(template);
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), target);
    else if (!/^(?:https?:|mailto:)/.test(target)) await access(new URL(target, directory));
  }
  for (const [, id] of html.matchAll(/aria-describedby="([^"]+)"/g)) assert.ok(ids.has(id));
});
