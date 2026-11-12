import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { renderShowcasePage } from '../scripts/showcase-lib.mjs';

const script = readFileSync(new URL('../scripts/showcase/ui.js', import.meta.url), 'utf8');

function setup({ observer = true } = {}) {
  const cards = [0, 1, 2].map(index => {
    const thumbnailEvents = {};
    const thumbnail = { dataset: { src: `/template-${index}.webp` }, style: {}, events: thumbnailEvents,
      addEventListener: (event, callback) => { thumbnailEvents[event] = callback; },
      removeAttribute(name) { delete this[name]; },
      getAttribute(name) { return this[name]; } };
    return {
      hidden: false, dataset: { area: index === 2 ? 'Saúde' : 'Comércio' },
      textContent: `Template ${index}`, thumbnail,
      querySelector: selector => selector === '.thumbnail' ? thumbnail : { clientWidth: 360 },
      getBoundingClientRect: () => ({ top: index * 1000, bottom: index * 1000 + 300 }),
    };
  });
  const events = {}, searchEvents = {}, observed = new Set();
  const search = { value: '', addEventListener: (event, callback) => { searchEvents[event] = callback; } };
  const elements = { '#search': search, '#result-count': {}, '#no-results': {} };
  let intersect;
  const context = {
    document: {
      documentElement: { dataset: {} },
      querySelector: selector => elements[selector] || null,
      querySelectorAll: selector => selector === '.template-card' ? cards : [],
    },
    localStorage: { getItem: () => null },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    window: { innerHeight: 800, addEventListener: (event, callback) => { events[event] = callback; } },
    requestAnimationFrame: callback => callback(),
  };
  if (observer) context.IntersectionObserver = class {
    constructor(callback, options) { intersect = callback; assert.equal(options.rootMargin, '200px 0px'); }
    observe(card) { observed.add(card); }
    unobserve(card) { observed.delete(card); }
  };
  vm.runInNewContext(script, context);
  return { cards, observed, events, search, searchEvents, elements,
    intersect: (card, isIntersecting = true) => intersect([{ target: card, isIntersecting }]) };
}

test('showcase image thumbnails have deferred URLs and no initial template requests', () => {
  const html = renderShowcasePage([{ slug: 'example', name: 'Example', href: '/src/example/index.html', previewHref: '/src/example/preview.webp', description: '' }]);
  const thumbnails = html.match(/<img class="thumbnail"[^>]*>/g);
  assert.equal(thumbnails.length, 1);
  assert.match(thumbnails[0], /data-src="\/src\/example\/preview.webp"/);
  assert.match(thumbnails[0], /src="\/src\/showcase-assets\/placeholder.svg"/);
  assert.match(thumbnails[0], /data-srcset="[^" ]+ 480w, [^"]+ 960w"/);
  assert.match(thumbnails[0], /width="960" height="600"/);
  assert.match(thumbnails[0], /alt="Captura do template Example/);
  assert.doesNotMatch(html, /<iframe class="thumbnail"/);
});

test('only intersecting visible cards load, once, including after search changes', () => {
  const app = setup();
  assert.equal(app.observed.size, 3);
  assert.ok(app.cards.every(card => !card.thumbnail.src));
  app.intersect(app.cards[0], false);
  assert.equal(app.cards[0].thumbnail.src, undefined);
  app.intersect(app.cards[0]);
  assert.equal(app.cards[0].thumbnail.src, '/template-0.webp');
  assert.equal(app.observed.has(app.cards[0]), false);
  app.search.value = 'Template 1';
  app.searchEvents.input();
  assert.equal(app.observed.size, 1);
  app.intersect(app.cards[2]); // A queued entry for a newly hidden card must not load it.
  assert.equal(app.cards[2].thumbnail.src, undefined);
  app.intersect(app.cards[1]);
  assert.equal(app.cards[1].thumbnail.src, '/template-1.webp');
  app.search.value = '';
  app.searchEvents.input();
  assert.equal(app.observed.size, 1);
  assert.ok(app.observed.has(app.cards[2]));
  app.intersect(app.cards[2]);
  assert.equal(app.cards[2].thumbnail.src, '/template-2.webp');
  assert.equal(app.observed.size, 0);
  assert.equal(app.elements['#result-count'].textContent, '3 de 3 templates');
});

test('fallback loads only nearby cards on initial render, scroll and resize', () => {
  const app = setup({ observer: false });
  assert.equal(app.cards[0].thumbnail.src, '/template-0.webp');
  assert.equal(app.cards[1].thumbnail.src, undefined);
  app.cards[1].getBoundingClientRect = () => ({ top: 400, bottom: 700 });
  app.events.scroll();
  assert.equal(app.cards[1].thumbnail.src, '/template-1.webp');
  assert.equal(app.cards[2].thumbnail.src, undefined);
  app.cards[2].getBoundingClientRect = () => ({ top: 500, bottom: 800 });
  app.events.resize();
  assert.equal(app.cards[2].thumbnail.src, '/template-2.webp');
});

test('activated thumbnails load immediately and are never measured again by the fallback', () => {
  const app = setup({ observer: false });
  const loaded = app.cards[0];
  assert.equal(loaded.thumbnail.loading, 'eager');
  assert.equal(loaded.thumbnail.dataset.src, undefined);
  loaded.getBoundingClientRect = () => { throw new Error('Loaded thumbnails must leave the pending queue'); };
  app.events.scroll();
  app.events.resize();
  assert.equal(loaded.thumbnail.src, '/template-0.webp');
});

test('fallback defers hidden search results until they are visible and near the viewport', () => {
  const app = setup({ observer: false });
  app.search.value = 'Template 0';
  app.searchEvents.input();
  app.cards[1].getBoundingClientRect = () => ({ top: 100, bottom: 400 });
  app.events.scroll();
  assert.equal(app.cards[1].thumbnail.src, undefined);
  app.search.value = '';
  app.searchEvents.input();
  assert.equal(app.cards[1].thumbnail.src, '/template-1.webp');
  assert.equal(app.cards[2].thumbnail.src, undefined);
});


test('image activation installs responsive candidates and an image error falls back once', () => {
  const app = setup();
  const image = app.cards[0].thumbnail;
  image.dataset.srcset = '/small.webp 480w, /large.webp 960w';
  image.dataset.fallback = '/placeholder.svg';
  app.intersect(app.cards[0]);
  assert.equal(image.srcset, '/small.webp 480w, /large.webp 960w');
  assert.equal(image.dataset.srcset, undefined);
  image.events.error();
  assert.equal(image.src, '/placeholder.svg');
  assert.equal(image.srcset, undefined);
  image.events.error();
  assert.equal(image.src, '/placeholder.svg');
  assert.equal(app.observed.has(app.cards[0]), false);
});
