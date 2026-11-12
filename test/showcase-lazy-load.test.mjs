import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { renderShowcasePage } from '../scripts/showcase-lib.mjs';

const script = readFileSync(new URL('../scripts/showcase/ui.js', import.meta.url), 'utf8');

function setup({ observer = true } = {}) {
  const cards = [0, 800, 1800].map((top, index) => {
    const thumbnail = { dataset: { src: `/src/template-${index}/index.html` }, style: {} };
    return {
      hidden: false, dataset: { area: index === 2 ? 'Saúde' : 'Tecnologia' },
      textContent: `Template ${index}`, thumbnail,
      getBoundingClientRect: () => ({ top, bottom: top + 500 }),
      querySelector: selector => selector === '.thumbnail' ? thumbnail : { clientWidth: 400 },
    };
  });
  const search = { value: '', addEventListener(type, callback) { this[type] = callback; } };
  const elements = { '#search': search, '#result-count': {}, '#no-results': {} };
  const listeners = {};
  const observed = new Set();
  let intersect;
  runInNewContext(script, {
    document: {
      documentElement: { dataset: {} },
      querySelector: selector => elements[selector] || null,
      querySelectorAll: selector => selector === '.template-card' ? cards : [],
    },
    window: { innerHeight: 600, addEventListener(type, callback) { listeners[type] = callback; } },
    localStorage: { getItem: () => null },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    requestAnimationFrame: callback => callback(),
    ...(observer ? { IntersectionObserver: class {
      constructor(callback, options) { intersect = callback; assert.equal(options.rootMargin, '200px 0px'); }
      observe(card) { observed.add(card); }
      unobserve(card) { observed.delete(card); }
    } } : {}),
  });
  return { cards, search, observed, listeners, intersect };
}

test('catalogue HTML does not assign template URLs to iframe src', () => {
  const html = renderShowcasePage([{ slug: 'demo', name: 'Demo', href: '/src/demo/index.html', description: '' }]);
  const iframe = html.match(/<iframe class="thumbnail"[^>]*>/)[0];
  assert.match(iframe, /data-src="\/src\/demo\/index.html"/);
  assert.doesNotMatch(iframe, /\ssrc=/);
  assert.match(html, /<a href="\/src\/demo\/index.html"/);
});

test('only intersecting visible cards load and each loads once', () => {
  const { cards, intersect, observed } = setup();
  assert.equal(observed.size, 3);
  assert.ok(cards.every(card => !card.thumbnail.src));
  intersect([{ target: cards[0], isIntersecting: false }]);
  assert.equal(cards[0].thumbnail.src, undefined);
  intersect([{ target: cards[0], isIntersecting: true }]);
  assert.equal(cards[0].thumbnail.src, '/src/template-0/index.html');
  assert.ok(!observed.has(cards[0]));
  intersect([{ target: cards[0], isIntersecting: true }]);
  assert.equal(cards[0].thumbnail.src, '/src/template-0/index.html');
  assert.equal(cards[1].thumbnail.src, undefined);
});

test('filtering ignores stale intersection entries and observes revealed matches', () => {
  const { cards, search, observed, intersect } = setup();
  search.value = 'Template 2';
  search.input();
  assert.equal(observed.size, 1);
  assert.ok(observed.has(cards[2]));
  intersect([{ target: cards[0], isIntersecting: true }]);
  assert.equal(cards[0].thumbnail.src, undefined);
  intersect([{ target: cards[2], isIntersecting: true }]);
  assert.equal(cards[2].thumbnail.src, '/src/template-2/index.html');
  search.value = '';
  search.input();
  assert.equal(observed.size, 2);
  assert.ok(observed.has(cards[0]));
});

test('fallback without IntersectionObserver loads nearby cards on scroll and resize', () => {
  const { cards, listeners } = setup({ observer: false });
  assert.equal(cards[0].thumbnail.src, '/src/template-0/index.html');
  assert.equal(cards[2].thumbnail.src, undefined);
  cards[2].getBoundingClientRect = () => ({ top: 400, bottom: 900 });
  listeners.scroll();
  assert.equal(cards[2].thumbnail.src, '/src/template-2/index.html');
  listeners.resize();
  assert.equal(cards[2].thumbnail.src, '/src/template-2/index.html');
});
