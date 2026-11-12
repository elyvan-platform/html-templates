import test from 'node:test';
import assert from 'node:assert/strict';
import { listTemplateDirectories, renderShowcasePage, renderTemplateViewerPage, templateArea } from '../scripts/showcase-lib.mjs';

test('every discovered template has an area, a preview and an accessible filter', async () => {
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  for (const template of templates) {
    assert.notEqual(templateArea(template), 'Outras áreas', template.slug);
    assert.ok(html.includes(`data-filter="${templateArea(template)}"`));
    assert.ok(html.includes(`data-href="${template.href}"`));
  }
  assert.match(html, /value="system" selected/);
  assert.match(html, /<dialog[^>]+aria-labelledby="preview-title"/);
  for (const device of ['mobile', 'tablet', 'desktop']) assert.ok(html.includes(`data-device="${device}"`));
});

test('viewer wraps navigation and shares device and appearance controls', async () => {
  const templates = await listTemplateDirectories();
  const html = renderTemplateViewerPage(templates, templates[0]);
  assert.ok(html.includes(`href="${templates.at(-1).viewerHref}"`));
  assert.ok(html.includes(`href="${templates[1].viewerHref}"`));
  assert.ok(html.includes(`src="${templates[0].href}"`));
  assert.match(html, /id="theme"/);
  assert.match(html, /data-device="mobile"/);
});

test('new areas fall back gracefully and template metadata is escaped', () => {
  const template = {slug:'new-sector', name:'<script>alert("x")</script>', description:'<img src=x>', href:'/src/new/index.html',viewerHref:'/templates/new'};
  assert.equal(templateArea(template), 'Outras áreas');
  const html = renderShowcasePage([template]);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<img src=x>'));
  assert.match(renderShowcasePage([]), /id="no-results" >/);
});

test('all catalog thumbnails are local images with responsive assets and reserved space', async () => {
  const { stat } = await import('node:fs/promises');
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  assert.equal((html.match(/<img class="thumbnail"/g) || []).length, templates.length);
  assert.equal((html.match(/<iframe /g) || []).length, 1, 'only the blank preview frame remains');
  for (const template of templates) {
    assert.ok(template.previewHref, template.slug);
    const asset = await stat(new URL(`..${template.previewHref}`, import.meta.url));
    assert.ok(asset.size > 0 && asset.size < 150_000, template.slug);
    if (template.previewHref.endsWith('.webp')) {
      const small = await stat(new URL(`..${template.previewHref.replace('/preview.webp', '/preview-480.webp')}`, import.meta.url));
      assert.ok(small.size > 0 && small.size < asset.size, template.slug);
    }
  }
  assert.equal((html.match(/width="960" height="600"/g) || []).length, templates.length);
});

test('missing thumbnail metadata uses the local placeholder without a card iframe', () => {
  const html = renderShowcasePage([{slug:'missing', name:'Missing', href:'/src/missing/index.html'}]);
  assert.match(html, /data-src="\/src\/showcase-assets\/placeholder.svg"/);
  assert.match(html, /alt="Captura do template Missing — Outras áreas"/);
});
