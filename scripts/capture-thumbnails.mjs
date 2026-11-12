// Manual tooling: renders each template with headless Chromium and writes optimised
// thumbnails (AVIF/WebP/JPEG at 480 and 960 px) to src/_thumbnails. Needs `chromium` and ImageMagick `convert`.
// Usage: node scripts/capture-thumbnails.mjs [slug ...]   (CHROMIUM=/path/to/chromium to override)
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { listTemplateDirectories, rootDir } from "./showcase-lib.mjs";
import { THUMBNAIL_FORMATS, THUMBNAIL_WIDTHS, THUMBNAIL_DIR } from "./thumbnail-lib.mjs";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";

const port = 4399;
const only = process.argv.slice(2);
const chromium = process.env.CHROMIUM || "chromium";
const outDir = path.join(rootDir, THUMBNAIL_DIR);
const tmp = mkdtempSync(path.join(tmpdir(), "thumbs-"));
mkdirSync(outDir, { recursive: true });

const server = spawn(process.execPath, ["scripts/showcase-server.mjs"], {
  cwd: rootDir, env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) }, stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 800));

try {
  const templates = (await listTemplateDirectories()).filter((t) => !only.length || only.includes(t.slug));
  for (const { slug, href } of templates) {
    const png = path.join(tmp, `${slug}.png`);
    execFileSync(chromium, [
      "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      "--window-size=1440,900", "--timeout=9000", `--screenshot=${png}`,
      `http://127.0.0.1:${port}${href}`,
    ], { stdio: "ignore" });
    for (const width of THUMBNAIL_WIDTHS) {
      for (const [ext, args] of Object.entries(THUMBNAIL_FORMATS)) {
        execFileSync("convert", [png, "-resize", `${width}x`, "-strip", ...args, path.join(outDir, `${slug}-${width}.${ext}`)]);
      }
    }
    console.log(`[thumbnails] ${slug}`);
  }
} finally {
  server.kill();
  rmSync(tmp, { recursive: true, force: true });
}
