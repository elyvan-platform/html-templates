import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';
const require = createRequire(import.meta.url);
const { periods, exercises, totalMinutes, historyFor } = require('../src/fitness-dashboard/assets/main.js');

test('fitness template is discoverable in sport with a local preview and assets', async () => {
  const entry = (await listTemplateDirectories()).find(item => item.slug === 'fitness-dashboard');
  assert.equal(entry.name, 'Ritmo');
  assert.equal(templateArea(entry), 'Desporto');
  assert.equal(entry.previewHref, '/src/fitness-dashboard/preview.svg');
  const html = await readFile('src/fitness-dashboard/index.html', 'utf8');
  assert.match(html, /lang="pt-PT"/);
  for (const asset of ['assets/style.css', 'assets/main.js']) {
    assert.ok(html.includes(asset));
    assert.ok((await readFile(`src/fitness-dashboard/${asset}`, 'utf8')).length);
  }
});

test('period summaries reconcile with the activities shown in history', () => {
  for (const key of Object.keys(periods)) {
    const rows = historyFor(key);
    assert.equal(rows.length, periods[key].workouts);
    assert.equal(rows.reduce((sum, row) => sum + row.minutes, 0), totalMinutes(key));
    assert.equal(periods[key].labels.length, periods[key].minutes.length);
    assert.ok(periods[key].minutes.every(value => Number.isFinite(value) && value >= 0));
  }
  assert.equal(totalMinutes('month'), totalMinutes('week') + totalMinutes('previous'));
  assert.equal(periods.month.calories, periods.week.calories + periods.previous.calories);
  assert.equal(periods.month.distance, periods.week.distance + periods.previous.distance);
});

test('history combines activity and date filters including an empty state', () => {
  assert.equal(historyFor('previous', 'Mobilidade').length, 0);
  assert.equal(historyFor('week', 'Mobilidade').length, 1);
  assert.ok(historyFor('previous', 'Força').every(row => row.type === 'Força' && row.date < '2026-11-09'));
  assert.equal(historyFor('month', 'Corrida').length, 4);
  assert.equal(exercises.length, 4);
  assert.equal(new Set(exercises.map(exercise => exercise.name)).size, 4);
});
