// Build-time only. See docs/montra-thumbnails.md.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { listTemplateDirectories, rootDir, srcDir } from './showcase-lib.mjs';
import { THUMBNAIL_DIR, THUMBNAIL_WIDTHS } from './thumbnail-lib.mjs';

const outDir = path.join(rootDir, THUMBNAIL_DIR);
const cachePath = path.join(outDir, '.capture-cache.json');
const formats = ['avif', 'webp', 'jpg'];
const args = process.argv.slice(2);
const force = args.includes('--all');
const slugs = args.filter(arg => !arg.startsWith('--'));
if (args.some(arg => arg.startsWith('--') && !['--all', '--changed'].includes(arg)) || (force && args.includes('--changed'))) {
  throw new Error('Usage: npm run thumbnails -- [--all|--changed] [slug ...]');
}

async function fingerprint(slug) {
  const hash = createHash('sha256');
  // Include capture settings and encoder versions in cache invalidation.
  for (const file of ['scripts/capture-thumbnails.mjs', 'scripts/thumbnail-lib.mjs', 'package-lock.json']) {
    hash.update(await fs.readFile(path.join(rootDir, file)));
  }
  async function visit(dir) {
    for (const entry of (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile()) { hash.update(path.relative(srcDir, file)); hash.update(await fs.readFile(file)); }
    }
  }
  await visit(path.join(srcDir, slug));
  return hash.digest('hex');
}
async function outputsExist(slug) {
  return (await Promise.all(THUMBNAIL_WIDTHS.flatMap(width => formats.map(ext => fs.access(path.join(outDir, `${slug}-${width}.${ext}`)).then(() => true, () => false))))).every(Boolean);
}

async function main() {
  const templates = await listTemplateDirectories();
  for (const slug of slugs) if (!templates.some(t => t.slug === slug)) throw new Error(`Unknown template: ${slug}`);
  await fs.mkdir(outDir, { recursive: true });
  let cache = {};
  try { cache = JSON.parse(await fs.readFile(cachePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error; }
  const selected = templates.filter(t => !slugs.length || slugs.includes(t.slug));
  const pending = [];
  for (const template of selected) {
    const hash = await fingerprint(template.slug);
    if (force || (slugs.length && !args.includes('--changed')) || cache[template.slug] !== hash || !await outputsExist(template.slug)) pending.push({ ...template, hash });
  }
  if (!pending.length) { console.log('[thumbnails] all selected templates are up to date'); return; }
  // Only serve local static files. Browser requests to integrations are blocked below.
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(rootDir, `.${pathname}`);
      if (!file.startsWith(srcDir + path.sep)) { res.writeHead(403).end(); return; }
      const data = await fs.readFile(file);
      const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2' }[path.extname(file).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type }); res.end(data);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const template of pending) {
      let error;
      for (let attempt = 1; attempt <= 2; attempt++) {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
        try {
          await context.route('**/*', route => {
            const request = route.request();
            const url = new URL(request.url());
            // Passive assets may be needed for the design; never call external APIs or submit forms.
            if (request.method() === 'GET' && (url.origin === origin || (['image', 'font', 'stylesheet'].includes(request.resourceType()) && ['https:', 'http:'].includes(url.protocol)))) return route.continue();
            return route.abort();
          });
          const page = await context.newPage();
          const failedAssets = [];
          page.on('requestfailed', request => { if (['image', 'font', 'stylesheet'].includes(request.resourceType())) failedAssets.push(request.url()); });
          page.on('response', response => { if (response.status() >= 400 && ['image', 'font', 'stylesheet'].includes(response.request().resourceType())) failedAssets.push(response.url()); });
          const response = await page.goto(origin + template.href, { waitUntil: 'load', timeout: 20000 });
          if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
          await page.evaluate(async () => { await Promise.race([document.fonts.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('Font loading timeout')), 10000))]); await Promise.all([...document.images].filter(img => { const r = img.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0; }).map(async img => { if (!img.complete) await Promise.race([new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); }), new Promise((_, reject) => setTimeout(() => reject(new Error('Image loading timeout')), 10000))]); if (!img.naturalWidth) throw new Error(`Visible image failed: ${img.currentSrc || img.src}`); })); });
          if (failedAssets.length) throw new Error(`Asset failed: ${failedAssets[0]}`);
          const png = await page.screenshot({ animations: 'disabled', timeout: 10000 });
          const stats = await sharp(png).stats();
          if (stats.channels.slice(0, 3).every(channel => channel.stdev < 2)) throw new Error('Screenshot appears blank');
          for (const width of THUMBNAIL_WIDTHS) {
            for (const ext of formats) {
              let image = sharp(png).resize(width, Math.round(width * 900 / 1440));
              image = ext === 'jpg' ? image.jpeg({ quality: 78, progressive: true }) : ext === 'webp' ? image.webp({ quality: 78 }) : image.avif({ quality: 50 });
              await image.toFile(path.join(outDir, `${template.slug}-${width}.${ext}.tmp`));
            }
          }
          for (const width of THUMBNAIL_WIDTHS) for (const ext of formats) await fs.rename(path.join(outDir, `${template.slug}-${width}.${ext}.tmp`), path.join(outDir, `${template.slug}-${width}.${ext}`));
          cache[template.slug] = template.hash;
          await fs.writeFile(cachePath, JSON.stringify(cache, null, 2) + '\n');
          console.log(`[thumbnails] ${template.slug}`);
          error = null; break;
        } catch (caught) { error = caught; console.error(`[thumbnails] ${template.slug} attempt ${attempt}/2: ${caught.message}`); }
        finally { await context.close(); }
      }
      if (error) throw new Error(`Failed to capture ${template.slug}: ${error.message}`);
    }
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
