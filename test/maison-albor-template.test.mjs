import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const directory = path.join(process.cwd(), 'src/maison-albor');
const pages = ['index.html', 'catalogo.html', 'produto.html', 'favoritos.html', 'carrinho.html'];

test('a Maison Albor é descoberta pela montra na área de decoração', async () => {
  const template = (await listTemplateDirectories()).find((item) => item.slug === 'maison-albor');
  assert.equal(template?.name, 'Maison Albor');
  assert.equal(templateArea(template), 'Design e decoração');
  assert.ok(template.description);
});

test('todas as páginas existem e as ligações locais resolvem', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(directory, page), 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), `${page}: âncora em falta ${target}`);
      else if (/^(https?:|mailto:|tel:|data:)/.test(target)) continue;
      else {
        const [file, fragment] = target.split('#');
        await access(path.join(directory, file.split('?')[0])).catch(() => assert.fail(`${page}: ligação partida ${target}`));
        if (fragment) {
          const targetHtml = await readFile(path.join(directory, file.split('?')[0]), 'utf8');
          assert.ok(targetHtml.includes(`id="${fragment}"`), `${page}: âncora em falta ${target}`);
        }
      }
    }
  }
});

test('o script só procura elementos que existem nas páginas', async () => {
  const script = await readFile(path.join(directory, 'assets/main.js'), 'utf8');
  const html = (await Promise.all(pages.map((page) => readFile(path.join(directory, page), 'utf8')))).join('\n');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, id] of script.matchAll(/\$\("#([\w-]+)"/g)) assert.ok(ids.has(id), `#${id} não existe no HTML`);
  for (const [, selector] of script.matchAll(/\$\("\[([\w-]+)[\]=]/g)) assert.ok(html.includes(selector) || script.includes(selector), `[${selector}] não existe no HTML nem no script`);
});

test('o HTML das páginas declara idioma e o script de dados usa preços em euros', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(directory, page), 'utf8');
    assert.match(html, /<html lang="pt-PT">/, page);
    assert.match(html, /<main id="main"/, page);
  }
  const script = await readFile(path.join(directory, 'assets/main.js'), 'utf8');
  assert.match(script, /currency: "EUR"/);
});
