import assert from 'node:assert/strict';

export async function checkLinks(page, request, base, routes) {
  const errors = [];
  const cache = new Map();
  async function get(url) {
    const key = new URL(url); key.hash = '';
    if (!cache.has(key.href)) cache.set(key.href, (async () => {
      const response = await request.get(key.href);
      if (!response.ok()) errors.push(`${key.href}: HTTP ${response.status()}`);
      const type = response.headers()['content-type'] || '';
      return { type, text: /text|javascript|json|svg/.test(type) ? await response.text() : '' };
    })());
    return cache.get(key.href);
  }
  async function check(value, source) {
    const url = new URL(value, source);
    if (url.origin !== base || !['http:', 'https:'].includes(url.protocol)) return;
    const { type, text } = await get(url);
    if (url.hash && type.includes('text/html')) {
      const fragment = decodeURIComponent(url.hash.slice(1));
      // Empty fragments are intentionally used as demo/no-op links.
      if (fragment && !fragment.startsWith(':~:text=')) {
        const found = await page.evaluate(({ text, fragment }) => {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          return !!doc.getElementById(fragment) || [...doc.querySelectorAll('a[name]')].some(a => a.name === fragment);
        }, { text, fragment });
        if (!found) errors.push(`${source} → ${url.href}: missing anchor`);
      }
    }
    if (type.includes('text/css')) {
      // Mark before recursion: CSS imports can form cycles.
      if (cssSeen.has(url.href)) return;
      cssSeen.add(url.href);
      for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)) await check(match[1] || match[2], url.href);
    }
  }
  const cssSeen = new Set();
  for (const route of routes) {
    const source = base + route;
    await page.goto(source);
    const refs = await page.evaluate(() => {
      const refs = [];
      for (const el of document.querySelectorAll('[href], [src], [srcset], [poster], [data-href]')) {
        for (const attr of ['href', 'src', 'poster', 'data-href']) if (el.hasAttribute(attr)) refs.push(new URL(el.getAttribute(attr), document.baseURI).href);
        if (el.hasAttribute('srcset')) for (const candidate of el.getAttribute('srcset').split(',')) refs.push(new URL(candidate.trim().split(/\s+/)[0], document.baseURI).href);
      }
      for (const el of document.querySelectorAll('[style], style')) {
        const css = el.tagName === 'STYLE' ? el.textContent : el.getAttribute('style');
        for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) refs.push(new URL(match[1], document.baseURI).href);
      }
      return [...new Set(refs)];
    });
    await get(source);
    for (const ref of refs) await check(ref, source);
  }
  assert.deepEqual(errors, [], 'Broken local links/assets');
}
