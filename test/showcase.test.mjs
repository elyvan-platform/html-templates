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

test('all catalog entries have two optimized screenshots and cards contain only images', async () => {
  const { readFile } = await import('node:fs/promises');
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates);
  assert.equal((html.match(/<img class="thumbnail"/g) || []).length, templates.length);
  for (const card of html.matchAll(/<article class="template-card"[\s\S]*?<\/article>/g)) {
    assert.doesNotMatch(card[0], /<iframe/);
    assert.match(card[0], /alt="Página inicial de .+ — .+"/);
    assert.match(card[0], /width="960" height="600"/);
  }
  for (const template of templates) {
    assert.equal(template.thumbnailHref, `/src/showcase-assets/${template.slug}-480.webp`);
    for (const width of [480, 960]) {
      const bytes = await readFile(new URL(`..${template.thumbnailHref.replace('-480.webp', `-${width}.webp`)}`, import.meta.url));
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.ok(bytes.length < 150_000, `${template.slug}: thumbnail too large`);
    }
  }
});

test('a missing screenshot renders an accessible static placeholder', () => {
  const html = renderShowcasePage([{slug:'missing', name:'Sem imagem', href:'/src/missing/index.html'}]);
  const image = html.match(/<img class="thumbnail"[^>]*>/)[0];
  assert.match(image, /src="data:image\/svg\+xml,/);
  assert.doesNotMatch(image, /data-src=/);
  assert.match(image, /alt="Página inicial de Sem imagem/);
});
