import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea, renderTemplateViewerPage } from '../scripts/showcase-lib.mjs';

test('PULSO is discoverable with a viewer and valid standalone local links', async () => {
  const templates = await listTemplateDirectories();
  const template = templates.find(item => item.slug === 'pulso-conference');
  assert.equal(template?.name, 'PULSO 2027');
  assert.equal(templateArea(template), 'Tecnologia');
  assert.ok(template.description);
  assert.ok(renderTemplateViewerPage(templates, template).includes(`src="${template.href}"`));
  const directory = path.join(process.cwd(), 'src/pulso-conference');
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'unique IDs');
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), `Missing anchor ${target}`);
    else await access(path.join(directory, target));
  }
  for (const [, target] of html.matchAll(/(?:for|aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    for (const id of target.split(' ')) assert.ok(ids.includes(id), `Missing accessible reference ${id}`);
  }
});
