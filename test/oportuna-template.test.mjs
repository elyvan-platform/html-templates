import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { listTemplateDirectories, renderShowcasePage, templateArea } from '../scripts/showcase-lib.mjs';

const directory = path.join(process.cwd(), 'src/oportuna-vagas');
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const file of ['assets/data.js', 'assets/logic.js']) {
  vm.runInContext(await readFile(path.join(directory, file), 'utf8'), sandbox);
}
const { jobs, filterJobs, validateApplication, formatSalary } = sandbox.Oportuna;

const validApplication = {
  name: 'Ana Sousa',
  email: 'ana.sousa@exemplo.pt',
  phone: '912 345 678',
  cv: { name: 'cv-ana.pdf', size: 240_000 },
  motivation: 'Gosto de trabalhar em equipas pequenas e de construir interfaces claras e acessíveis para as pessoas que as usam todos os dias.',
  consent: true,
};

test('Oportuna is discoverable in its own catalogue category and all local links resolve', async () => {
  const templates = await listTemplateDirectories();
  const template = templates.find((item) => item.slug === 'oportuna-vagas');
  assert.equal(template.name, 'Oportuna');
  assert.equal(templateArea(template), 'Emprego e carreiras');
  assert.ok(renderShowcasePage(templates).includes('data-filter="Emprego e carreiras"'));
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, link] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (link.startsWith('#')) assert.ok(ids.has(link.slice(1)), link);
    else if (!/^(https?:|mailto:|tel:|\?)/.test(link)) await access(path.join(directory, link));
  }
});

test('the demo runs fully offline: no remote scripts, styles or images', async () => {
  for (const file of ['index.html', 'assets/style.css', 'assets/main.js', 'assets/logic.js', 'assets/data.js']) {
    assert.doesNotMatch(await readFile(path.join(directory, file), 'utf8'), /https?:\/\//, file);
  }
});

test('each job has unique deep-link data and complete fields', () => {
  assert.equal(new Set(jobs.map((job) => job.id)).size, jobs.length);
  for (const job of jobs) {
    assert.match(job.id, /^[a-z0-9-]+$/);
    assert.ok(job.title && job.company && job.area && job.location && job.summary);
    assert.ok(job.responsibilities.length && job.requirements.length && job.benefits.length && job.skills.length);
    assert.match(job.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('search ignores accents and case and combines with area, location and work mode', () => {
  assert.equal(filterJobs().length, jobs.length);
  assert.ok(filterJobs({ query: 'SENIOR' }).some((job) => job.id === 'frontend-senior-porto'));
  assert.equal(filterJobs({ query: 'sénior' })[0].id, 'frontend-senior-porto');
  assert.equal(filterJobs({ query: 'python remoto' }).length, 0);
  assert.equal(filterJobs({ query: 'python' })[0].id, 'backend-python-remoto');
  assert.equal(filterJobs({ query: 'nada disto existe' }).length, 0);
  assert.ok(filterJobs({ area: 'Tecnologia' }).every((job) => job.area === 'Tecnologia'));
  assert.ok(filterJobs({ location: 'Porto' }).every((job) => job.location === 'Porto'));
  assert.ok(filterJobs({ remote: 'remote' }).every((job) => job.modality === 'Remoto'));
  assert.ok(filterJobs({ remote: 'onsite' }).every((job) => job.modality !== 'Remoto'));
  assert.equal(filterJobs({ area: 'Saúde', remote: 'remote' }).length, 0);
});

test('saved view, sorting and source order behave predictably', () => {
  assert.equal(filterJobs({ saved: [] }).length, 0);
  assert.equal(filterJobs({ saved: ['unknown'] }).length, 0);
  const saved = filterJobs({ saved: ['gestor-contas-aveiro', 'designer-ux-lisboa'] });
  assert.equal(saved.length, 2);
  const byDate = filterJobs();
  assert.equal(byDate[0].publishedAt >= byDate.at(-1).publishedAt, true);
  const bySalary = filterJobs({ sort: 'salary' });
  assert.equal(bySalary[0].id, 'backend-python-remoto');
  assert.equal(bySalary.at(-1).salary, null);
  assert.equal(jobs[0].id, 'frontend-senior-porto');
});

test('salary and empty salary are formatted for pt-PT', () => {
  assert.equal(formatSalary(null), 'Salário não indicado');
  assert.match(formatSalary({ min: 740, max: 740 }), /740\s?€ \/ mês/);
  assert.match(formatSalary({ min: 1400, max: 2100 }), /1\s?400\s?€\s–\s2\s?100\s?€ \/ mês/);
});

test('simulated application validation accepts a complete form and explains each failure', () => {
  assert.deepEqual(Object.keys(validateApplication(validApplication)), []);
  assert.deepEqual(Object.keys(validateApplication({ ...validApplication, phone: '' })), []);
  assert.equal(validateApplication({ ...validApplication, name: ' Ana ' }).name, undefined);
  assert.ok(validateApplication({ ...validApplication, name: 'Al' }).name);
  assert.ok(validateApplication({ ...validApplication, email: 'ana@' }).email);
  assert.ok(validateApplication({ ...validApplication, phone: '211 234 567' }).phone);
  assert.ok(validateApplication({ ...validApplication, cv: null }).cv);
  assert.ok(validateApplication({ ...validApplication, cv: { name: 'cv.docx', size: 1000 } }).cv);
  assert.ok(validateApplication({ ...validApplication, cv: { name: 'cv.pdf', size: 6 * 1024 * 1024 } }).cv);
  assert.ok(validateApplication({ ...validApplication, motivation: 'Curto demais.' }).motivation);
  assert.ok(validateApplication({ ...validApplication, motivation: 'x'.repeat(801) }).motivation);
  assert.ok(validateApplication({ ...validApplication, consent: false }).consent);
});
