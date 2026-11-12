import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories } from '../scripts/showcase-lib.mjs';

test('a landing page do SaaS aparece na montra e as ligações locais existem', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'saas-fluxo');
  assert.equal(template?.name, 'Fluxo');
  assert.ok(template.description);
  const directory = path.join(process.cwd(), 'src/saas-fluxo');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else if (!/^(https?:|mailto:|tel:)/.test(target)) await access(path.join(directory, target));
  }
});

test('a landing page tem os planos e o alternador de faturação', async () => {
  const html = await readFile(path.join(process.cwd(), 'src/saas-fluxo/index.html'), 'utf8');
  assert.equal([...html.matchAll(/class="glass plan/g)].length, 3);
  assert.match(html, /data-billing="yearly"/);
});
