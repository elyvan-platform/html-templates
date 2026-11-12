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

test('catalogue uses a local screenshot for each template and provides a fallback', async () => {
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  for (const template of templates) {
    assert.equal(template.screenshotHref, `/src/${template.slug}/screenshot.webp`);
    assert.ok(html.includes(`data-src="${template.screenshotHref}"`));
  }
  assert.equal((html.match(/<img class="thumbnail"/g) || []).length, templates.length);
  assert.doesNotMatch(html, /<iframe class="thumbnail"/);
  assert.match(html, /width="720" height="450" loading="lazy"/);
  assert.match(html, /onerror="this.hidden=true"/);
  const missing = renderShowcasePage([{slug:'missing', name:'Missing', href:'/missing', description:''}]);
  assert.match(missing, /Miniatura indisponível/);
  assert.doesNotMatch(missing, /<img class="thumbnail"/);
});
