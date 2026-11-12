import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const dir = path.join(process.cwd(), 'src/solar-do-sossego');

test('o Solar do Sossego é descoberto na área de hotelaria', async () => {
  const t = (await listTemplateDirectories()).find((i) => i.slug === 'solar-do-sossego');
  assert.equal(t?.name, 'Solar do Sossego');
  assert.equal(templateArea(t), 'Hotelaria');
  assert.ok(t.description);
});

test('âncoras e ids usados pelo script existem', async () => {
  const html = await readFile(path.join(dir, 'index.html'), 'utf8');
  const js = await readFile(path.join(dir, 'assets/main.js'), 'utf8');
  assert.match(html, /<html lang="pt-PT">/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, a] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(a), `âncora ${a}`);
  for (const [, id] of js.matchAll(/\$\("#([\w-]+)"\)/g)) assert.ok(ids.has(id), `#${id}`);
});

test('o pedido nunca apresenta confirmação de reserva', async () => {
  const html = await readFile(path.join(dir, 'index.html'), 'utf8');
  assert.match(html, /ainda não enviado/);
  assert.doesNotMatch(html, /reserva confirmada!|obrigado pela reserva/i);
});
