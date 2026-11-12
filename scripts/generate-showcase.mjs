import { promises as fs } from "node:fs";
import path from "node:path";
import { listTemplateDirectories, renderShowcasePage, rootDir, srcDir } from "./showcase-lib.mjs";

const outputPath = path.join(rootDir, "index.html");
const isWatchMode = process.argv.includes("--watch");

async function generateShowcase() {
  const templates = await listTemplateDirectories();
  const html = renderShowcasePage(templates).replaceAll('href="/', 'href="./').replaceAll('src="/', 'src="./').replace(/srcset="([^"]*)"/g, (_, list) => `srcset="${list.replace(/(^|, )\//g, '$1./')}"`);
  await fs.writeFile(outputPath, html, "utf8");
  console.log(`[showcase] generated ${path.relative(rootDir, outputPath)} with ${templates.length} template(s)`);
}

async function main() {
  await generateShowcase();

  if (!isWatchMode) {
    return;
  }

  const { watch } = await import("node:fs");
  let timeoutId;

  console.log("[showcase] watching src for changes...");

  watch(srcDir, { recursive: true }, (_eventType, filename) => {
    if (!filename) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      generateShowcase().catch((error) => {
        console.error("[showcase] failed to regenerate", error);
      });
    }, 120);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
