import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = new URL('../src/portfolio-developer/', import.meta.url);

test('Portfolio Developer is discoverable and local destinations exist', async () => {
  const template = (await listTemplateDirectories()).find(item => item.slug === 'portfolio-developer');
  assert.equal(template.name, 'Portfolio Developer');
  assert.equal(templateArea(template), 'Tecnologia');
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), target);
    else if (!/^https?:/.test(target)) await access(new URL(target, directory));
  }
  assert.ok((await readFile(new URL('../index.html', import.meta.url), 'utf8')).includes('src/portfolio-developer/index.html'));
});

test('every project has a filter category and detail content', async () => {
  const html = await readFile(new URL('index.html', directory), 'utf8');
  const cats = [...html.matchAll(/data-cat="([^"]+)"/g)].map(m => m[1]);
  assert.ok(cats.length >= 4);
  for (const filter of ['backend', 'web', 'ferramentas']) assert.ok(cats.some(c => c.split(' ').includes(filter)), filter);
  assert.equal([...html.matchAll(/class="detail"/g)].length, cats.length);
});
