import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const base = new URL('../src/gaming-community/', import.meta.url);
const plain = (valor) => JSON.parse(JSON.stringify(valor));
const read = (file) => readFileSync(new URL(file, base), 'utf8');
const html = read('index.html');
const main = read('assets/main.js');
const context = vm.createContext({ module: { exports: {} } });
vm.runInContext(read('assets/data.js') + main, context);
const lib = context.module.exports;
const { JOGOS, NOTICIAS, JOGADORES, BADGES } = vm.runInContext('({ JOGOS, NOTICIAS, JOGADORES, BADGES })', context);

function storage(entries = {}) {
  const map = new Map(Object.entries(entries));
  return { getItem: (key) => (map.has(key) ? map.get(key) : null), setItem: (key, value) => map.set(key, value), removeItem: (key) => map.delete(key) };
}
const brokenStorage = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('cheio'); }, removeItem() { throw new Error('bloqueado'); } };

test('gaming community is listed in the showcase under its own area', async () => {
  const entry = (await listTemplateDirectories()).find((template) => template.slug === 'gaming-community');
  assert.ok(entry);
  assert.equal(entry.name, 'Pixel Porto');
  assert.equal(templateArea(entry), 'Jogos e entretenimento');
  assert.match(entry.description, /gaming/i);
});

test('page is pt-PT, semantic and wired to local assets only', () => {
  assert.match(html, /<html lang="pt-PT">/);
  assert.match(html, /<main id="conteudo">/);
  assert.match(html, /class="skip-link" href="#conteudo"/);
  for (const file of ['assets/style.css', 'assets/data.js', 'assets/main.js']) {
    assert.ok(html.includes(file), file);
    assert.ok(existsSync(new URL(file, base)), file);
  }
  assert.doesNotMatch(html, /(?:src|href)="https?:\/\//);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
  for (const section of ['destaques', 'catalogo', 'noticias', 'rankings', 'perfil']) {
    assert.ok(html.includes(`<section id="${section}"`), section);
  }
});

test('every element the script looks up exists in the markup', () => {
  const ids = [...main.matchAll(/\$\("([^"]+)"\)|getElementById\("([^"]+)"\)|querySelector\(`#([\w-]+)`\)|href="#([\w-]+)"/g)].map((m) => m[1] || m[2] || m[3] || m[4]);
  for (const id of new Set(ids)) {
    assert.ok(html.includes(`id="${id}"`), `#${id} em falta no HTML`);
  }
});

test('stylesheet respects reduced motion and keeps visible focus', () => {
  const css = read('assets/style.css');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
});

test('demo data is consistent and unique', () => {
  for (const list of [JOGOS, NOTICIAS, JOGADORES, BADGES]) {
    assert.equal(new Set(list.map((item) => item.id)).size, list.length);
  }
  assert.equal(JOGOS.filter((jogo) => jogo.destaque).length, 3);
  for (const jogo of JOGOS) {
    assert.ok(jogo.plataformas.length > 0, jogo.id);
    assert.ok(jogo.avaliacao >= 0 && jogo.avaliacao <= 5, jogo.id);
    assert.match(jogo.cores.join(' '), /#[0-9a-f]{6}/i);
  }
  for (const noticia of NOTICIAS) assert.match(noticia.data, /^\d{4}-\d{2}-\d{2}$/);
});

test('catalogue filters combine search without accents, genre, platform, favourites and sorting', () => {
  const ids = (lista) => plain(lista.map((jogo) => jogo.id));
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { texto: 'TORRE' })), ['torre-dos-ecos']);
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { texto: 'corrida' })), ['corrida-de-mare']);
  assert.equal(lib.filtrarJogos(JOGOS, { texto: 'inexistente' }).length, 0);
  assert.equal(lib.filtrarJogos(JOGOS, {}).length, JOGOS.length);
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { genero: 'RPG' })), ['torre-dos-ecos']);
  assert.ok(lib.filtrarJogos(JOGOS, { plataforma: 'Switch' }).every((jogo) => jogo.plataformas.includes('Switch')));
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { soFavoritos: true, favoritos: [] })), []);
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { soFavoritos: true, favoritos: ['pixel-pirata'] })), ['pixel-pirata']);
  assert.equal(lib.filtrarJogos(JOGOS, { ordem: 'avaliacao' })[0].id, 'torre-dos-ecos');
  assert.equal(lib.filtrarJogos(JOGOS, { ordem: 'nome' })[0].titulo, 'Arena Vértice');
  assert.equal(lib.filtrarJogos(JOGOS, { ordem: 'lancamento' })[0].lancamento, 2026);
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { ordem: 'destaque' })), ids(JOGOS));
  assert.deepEqual(ids(lib.filtrarJogos(JOGOS, { genero: 'Ação', plataforma: 'Xbox' })), ['neon-ribeira']);
});

test('news are newest first and can be filtered by category', () => {
  assert.equal(lib.filtrarNoticias(NOTICIAS)[0].id, 'torneio-inverno');
  const torneios = lib.filtrarNoticias(NOTICIAS, 'Torneios');
  assert.ok(torneios.length > 0 && torneios.every((noticia) => noticia.categoria === 'Torneios'));
  assert.equal(lib.filtrarNoticias(NOTICIAS, 'Categoria que não existe').length, 0);
});

test('rankings are ordered per tab with sequential positions', () => {
  for (const chave of ['global', 'semanal', 'competitivo']) {
    const ranking = lib.rankingDe(JOGADORES, chave);
    assert.deepEqual(ranking.map((j) => j.posicao), ranking.map((_, i) => i + 1));
    assert.ok(ranking.every((j, i) => i === 0 || ranking[i - 1].pontuacao >= j.pontuacao));
  }
  assert.equal(lib.rankingDe(JOGADORES, 'global')[0].id, 'ana-ferreira');
  assert.equal(lib.rankingDe(JOGADORES, 'semanal')[0].id, 'tiago-rocha');
  assert.equal(lib.rankingDe(JOGADORES, 'competitivo')[0].id, 'rui-carvalho');
});

test('badges unlock from favourites, reads and player statistics', () => {
  const guest = lib.badgesDe(lib.estatisticasDe(null, ['a', 'b', 'c'], []));
  const estado = Object.fromEntries(guest.map((badge) => [badge.id, badge.conquistado]));
  assert.equal(estado.colecionador, true);
  assert.equal(estado['leitor-atento'], false);
  assert.equal(estado['primeira-vitoria'], false);
  assert.equal(estado.campeao, false);
  const ana = lib.badgesDe(lib.estatisticasDe(JOGADORES.find((j) => j.id === 'ana-ferreira'), [], []));
  assert.ok(ana.filter((badge) => badge.conquistado).length >= 3);
  assert.equal(ana.find((badge) => badge.id === 'campeao').conquistado, true);
});

test('nickname validation rejects bad input and normalises spacing', () => {
  assert.equal(lib.validarNick('').ok, false);
  assert.equal(lib.validarNick('a').ok, false);
  assert.equal(lib.validarNick('x'.repeat(17)).ok, false);
  assert.equal(lib.validarNick('<script>').ok, false);
  assert.deepEqual(plain(lib.validarNick('  Ana   Lia ')), { ok: true, valor: 'Ana Lia' });
  assert.equal(lib.validarNick('Ana_Sombra-2.0').ok, true);
  assert.equal(lib.validarNick('João').ok, true);
});

test('saved preferences fall back safely when storage is corrupt, missing or blocked', () => {
  assert.deepEqual(plain(lib.carregarEstado(storage())), { favoritos: [], lidas: [], nick: 'Convidado' });
  const corrupt = plain(lib.carregarEstado(storage({ 'pixel-porto:favoritos': '{not json', 'pixel-porto:nick': '<b>x</b>' })));
  assert.deepEqual(corrupt, { favoritos: [], lidas: [], nick: 'Convidado' });
  const mixed = plain(lib.carregarEstado(storage({ 'pixel-porto:favoritos': JSON.stringify(['torre-dos-ecos', 3]), 'pixel-porto:noticias-lidas': JSON.stringify({}), 'pixel-porto:nick': JSON.stringify('Ana') })));
  assert.deepEqual(mixed, { favoritos: ['torre-dos-ecos'], lidas: [], nick: 'Ana' });
  assert.equal(lib.testarArmazenamento(brokenStorage), false);
  assert.equal(lib.testarArmazenamento(storage()), true);
  assert.equal(lib.guardarChave(brokenStorage, 'k', []), false);
  assert.equal(lib.guardarChave(storage(), 'k', ['x']), true);
});

test('initials and formatting helpers', () => {
  assert.equal(lib.iniciais('Ana_Sombra'), 'AS');
  assert.equal(lib.iniciais('Mari.Pixel'), 'MP');
  assert.equal(lib.normalizar('Ação Ótima'), 'acao otima');
});
