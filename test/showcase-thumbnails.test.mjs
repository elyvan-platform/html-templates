import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { listTemplateDirectories, renderShowcasePage } from '../scripts/showcase-lib.mjs';
import { THUMBNAIL_WIDTHS } from '../scripts/thumbnail-lib.mjs';

const script = readFileSync(new URL('../scripts/showcase/ui.js', import.meta.url), 'utf8');
const cardsOf = html => html.split('<article class="template-card"').slice(1).map(card => card.split('</article>')[0]);

test('catalogue cards contain no iframes and every template has responsive, accessible thumbnails', async () => {
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  const cards = cardsOf(html);
  assert.equal(cards.length, templates.length);
  for (const [index, card] of cards.entries()) {
    const { slug, name, thumbnail } = templates[index];
    assert.doesNotMatch(card, /<iframe/i, slug);
    assert.ok(thumbnail, `missing thumbnail for ${slug}; run scripts/capture-thumbnails.mjs`);
    for (const width of THUMBNAIL_WIDTHS) {
      for (const ext of ['avif', 'webp', 'jpg']) {
        assert.ok(existsSync(new URL(`..${thumbnail}-${width}.${ext}`, import.meta.url)), `${slug} ${width}.${ext}`);
      }
    }
    assert.match(card, /<source type="image\/avif"/);
    assert.match(card, /<source type="image\/webp"/);
    const img = card.match(/<img [^>]*>/)[0];
    assert.match(img, /width="960" height="600"/);
    assert.match(img, /alt="[^"]*\S[^"]*"/);
    assert.ok(img.includes('alt="Pré-visualização da página inicial de ' + name.replace(/&/g, '&amp;')), slug);
    assert.match(img, /decoding="async"/);
    assert.match(img, index < 3 ? /loading="eager"/ : /loading="lazy"/);
  }
  // Only the preview dialog owns an iframe.
  assert.equal(html.match(/<iframe/g).length, 1);
});

test('templates without a screenshot render a text placeholder instead of a broken image', () => {
  const html = renderShowcasePage([{ slug: 'x', name: 'Sem imagem', href: '/src/x/index.html', description: '' }]);
  const [card] = cardsOf(html);
  assert.match(card, /thumb-frame is-missing/);
  assert.match(card, /thumb-fallback[^>]*>Sem imagem/);
  assert.doesNotMatch(card, /<img/);
});

test('a failing thumbnail reveals the placeholder and filters keep working', () => {
  const frame = { classList: { add(name) { this.added = name; } } };
  const listeners = {};
  const image = { complete: false, naturalWidth: 0, closest: () => frame, addEventListener: (event, callback) => { listeners[event] = callback; } };
  const card = { hidden: false, dataset: { area: 'Saúde' }, textContent: 'Clínica' };
  const search = { value: '', addEventListener() {} };
  const elements = { '#search': search, '#result-count': {}, '#no-results': {} };
  vm.runInNewContext(script, {
    document: {
      documentElement: { dataset: {} },
      querySelector: selector => elements[selector] || null,
      querySelectorAll: selector => selector === '.template-card' ? [card] : selector === '.thumbnail' ? [image] : [],
    },
    localStorage: { getItem: () => null },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    window: { addEventListener() {} },
  });
  assert.equal(frame.classList.added, undefined);
  listeners.error();
  assert.equal(frame.classList.added, 'is-missing');
});
