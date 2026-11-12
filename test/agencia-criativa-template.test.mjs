import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

test('a agência criativa aparece na montra e as ligações locais existem', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'agencia-criativa');
  assert.equal(template?.name, 'Agência Criativa');
  assert.ok(template.description);
  assert.equal(templateArea(template), 'Branding e design');
  const directory = path.join(process.cwd(), 'src/agencia-criativa');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `Âncora em falta: ${target}`);
    else if (!/^(https?:|mailto:|data:)/.test(target)) await access(path.join(directory, target));
  }
  for (const id of ['casos', 'servicos', 'processo', 'equipa', 'manifesto', 'briefing', 'form-briefing']) assert.ok(ids.has(id), id);
});
