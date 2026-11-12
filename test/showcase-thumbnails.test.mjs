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
    const slug = card.match(/data-slug="([^"]+)"/)[1];
    const { name, thumbnail } = templates.find(template => template.slug === slug);
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

test('three different template thumbnails are 16:10 JPEGs and embedded in their cards', async () => {
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  for (const slug of ['architecture-studio', 'cafe-aurora', 'admin-dashboard']) {
    const card = cardsOf(html).find(value => value.includes(`data-slug="${slug}"`));
    assert.ok(card.includes(`/src/_thumbnails/${slug}-960.jpg`), slug);
    for (const width of THUMBNAIL_WIDTHS) {
      const bytes = readFileSync(new URL(`../src/_thumbnails/${slug}-${width}.jpg`, import.meta.url));
      let offset = 2, dimensions;
      while (offset < bytes.length) {
        assert.equal(bytes[offset], 0xff);
        const marker = bytes[offset + 1];
        const length = bytes.readUInt16BE(offset + 2);
        if ([0xc0, 0xc1, 0xc2].includes(marker)) {
          dimensions = [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
          break;
        }
        offset += length + 2;
      }
      assert.deepEqual(dimensions, [width, width * 5 / 8], slug);
    }
  }
});
