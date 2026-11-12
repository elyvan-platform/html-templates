import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';
const { seed, validTask, filterTasks, moveTask } = createRequire(import.meta.url)('../src/project-management/assets/main.js');
test('Compasso is discovered with a preview and project management category', async () => {
  const entry = (await listTemplateDirectories()).find(t => t.slug === 'project-management');
  assert.equal(entry.name, 'Compasso');
  assert.equal(entry.previewHref, '/src/project-management/preview.svg');
  assert.equal(templateArea(entry), 'Gestão de projetos');
});
test('demo tasks validate and combined filters work including empty results', () => {
  assert.ok(seed.every(validTask));
  assert.equal(filterTasks(seed, { search: '  PÁGINA  ', person: 'Mariana Silva', priority: 'Alta', tag: 'Design' }).length, 1);
  assert.equal(filterTasks(seed, { person: 'Tiago Costa', tag: 'Conteúdo' }).length, 0);
  assert.equal(validTask({ ...seed[0], title: '  ' }), false);
  assert.equal(validTask({ ...seed[0], status: 'unknown' }), false);
  assert.equal(validTask({ ...seed[0], date: 'invalid' }), false);
  assert.equal(validTask({ ...seed[0], person: 'unknown' }), false);
});
test('moving a task preserves its content and other tasks without mutating input', () => {
  const moved = moveTask(seed, seed[0].id, 'done');
  assert.equal(moved[0].status, 'done');
  assert.equal(seed[0].status, 'todo');
  assert.deepEqual(moved[0], { ...seed[0], status: 'done' });
  assert.deepEqual(moved.slice(1), seed.slice(1));
  assert.equal(moveTask(seed, seed[0].id, 'invalid'), seed);
});
