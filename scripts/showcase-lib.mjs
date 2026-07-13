import { promises as fs } from "node:fs";
import path from "node:path";

export const rootDir = process.cwd();
export const srcDir = path.join(rootDir, "src");

export async function listTemplateDirectories() {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const templates = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const indexPath = path.join(srcDir, slug, "index.html");

    try {
      const html = await fs.readFile(indexPath, "utf8");
      templates.push(await extractTemplateMeta(slug, html));
    } catch (error) {
      if (error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return templates.sort((left, right) => left.name.localeCompare(right.name, "pt"));
}

export async function extractTemplateMeta(slug, html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i,
  );

  const rawTitle = decodeHtml(titleMatch?.[1] || "");
  const name = cleanTemplateName(rawTitle) || slugToTitle(slug);
  const description = decodeHtml(descriptionMatch?.[1] || "").trim();
  const previewHref = await findPreviewAsset(slug);

  return {
    slug,
    name,
    description,
    previewHref,
    href: `/src/${slug}/index.html`,
    viewerHref: `/templates/${slug}`,
  };
}

async function findPreviewAsset(slug) {
  const previewNames = [
    "preview.webp",
    "preview.png",
    "preview.jpg",
    "preview.jpeg",
    "preview.svg",
  ];

  for (const fileName of previewNames) {
    const candidate = path.join(srcDir, slug, fileName);

    try {
      const stats = await fs.stat(candidate);

      if (stats.isFile()) {
        return `/src/${slug}/${fileName}`;
      }
    } catch (error) {
      if (error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return null;
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function cleanTemplateName(title) {
  if (!title) {
    return "";
  }

  const separators = [" | ", " — ", " - ", " – "];

  for (const separator of separators) {
    if (title.includes(separator)) {
      return title.split(separator)[0].trim();
    }
  }

  return title.trim();
}

function slugToTitle(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderShowcasePage(templates) {
  const cards = templates
    .map((template) => {
      const description = template.description
        ? `<p class="template-copy">${escapeHtml(template.description)}</p>`
        : "";
      const previewContent = template.previewHref
        ? `<img src="${escapeHtml(template.previewHref)}" alt="Preview de ${escapeHtml(template.name)}" loading="lazy">`
        : `<div class="template-fallback-art" aria-hidden="true">
            <span class="template-fallback-pill">${escapeHtml(template.slug)}</span>
            <strong>${escapeHtml(template.name)}</strong>
            <small>${escapeHtml(template.description || "Template pronto para navegar na montra.")}</small>
          </div>`;

      return `      <article class="template-card">
        <a class="template-preview" href="${escapeHtml(template.viewerHref)}">
          ${previewContent}
          <span class="template-preview-overlay">Entrar no template</span>
        </a>
        <div class="template-body">
          <div>
            <p class="template-kicker">${escapeHtml(template.slug)}</p>
            <h2>${escapeHtml(template.name)}</h2>
            ${description}
          </div>
          <a class="template-link" href="${escapeHtml(template.viewerHref)}">Ver layout</a>
        </div>
      </article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Montra de Templates</title>
  <meta name="description" content="Galeria automática dos templates HTML existentes em src.">
  <style>
    :root {
      --bg: #f4efe7;
      --surface: rgba(255, 255, 255, 0.78);
      --surface-strong: #ffffff;
      --text: #1f1a17;
      --muted: #6e6258;
      --line: rgba(31, 26, 23, 0.12);
      --accent: #9f5c36;
      --shadow: 0 28px 60px rgba(55, 37, 23, 0.14);
      --radius-lg: 28px;
      --radius-md: 20px;
      --font-display: "Georgia", "Times New Roman", serif;
      --font-body: "Segoe UI", Tahoma, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: var(--font-body);
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(159, 92, 54, 0.12), transparent 28rem),
        linear-gradient(180deg, #fbf8f3 0%, var(--bg) 45%, #efe5d7 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(31, 26, 23, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(31, 26, 23, 0.035) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent 80%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    code {
      font-family: "SFMono-Regular", Consolas, monospace;
    }

    .page-shell {
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 56px 0 72px;
    }

    .hero {
      display: grid;
      gap: 20px;
      padding: 32px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: rgba(255, 251, 247, 0.72);
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow);
    }

    .hero-label {
      margin: 0;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
    }

    .hero h1 {
      margin: 0;
      max-width: 10ch;
      font-family: var(--font-display);
      font-size: clamp(2.8rem, 7vw, 5.5rem);
      line-height: 0.92;
      font-weight: 600;
    }

    .hero p {
      margin: 0;
      max-width: 60ch;
      font-size: 1rem;
      line-height: 1.75;
      color: var(--muted);
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .hero-meta strong {
      color: var(--text);
    }

    .templates-grid {
      display: grid;
      gap: 24px;
      margin-top: 32px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .template-card {
      display: grid;
      grid-template-rows: 320px auto;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: 0 16px 38px rgba(55, 37, 23, 0.12);
    }

    .template-preview {
      position: relative;
      overflow: hidden;
      display: grid;
      align-items: end;
      background:
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.38), transparent 30%),
        linear-gradient(135deg, #d8cec2 0%, #c3b2a2 45%, #a98a72 100%);
    }

    .template-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .template-preview::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 50%, rgba(25, 21, 18, 0.62) 100%);
    }

    .template-fallback-art {
      position: absolute;
      inset: 0;
      display: grid;
      align-content: end;
      gap: 10px;
      padding: 24px;
      color: #fffaf3;
      z-index: 0;
      background:
        radial-gradient(circle at 85% 18%, rgba(255, 245, 232, 0.18), transparent 20%),
        linear-gradient(160deg, rgba(59, 38, 24, 0.18), rgba(28, 20, 15, 0.42));
    }

    .template-fallback-art strong {
      max-width: 12ch;
      font-family: var(--font-display);
      font-size: 2rem;
      line-height: 0.95;
      font-weight: 600;
    }

    .template-fallback-art small {
      max-width: 34ch;
      font-size: 0.92rem;
      line-height: 1.5;
      color: rgba(255, 250, 243, 0.84);
    }

    .template-fallback-pill {
      width: fit-content;
      padding: 7px 12px;
      border: 1px solid rgba(255, 250, 243, 0.28);
      border-radius: 999px;
      background: rgba(255, 250, 243, 0.12);
      backdrop-filter: blur(10px);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .template-preview-overlay {
      position: absolute;
      left: 20px;
      bottom: 18px;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      font-size: 0.88rem;
      font-weight: 600;
    }

    .template-body {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 22px;
    }

    .template-kicker {
      margin: 0 0 8px;
      font-size: 0.74rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
    }

    .template-body h2 {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.1;
      font-family: var(--font-display);
      font-weight: 600;
    }

    .template-copy {
      margin: 12px 0 0;
      color: var(--muted);
      line-height: 1.6;
      font-size: 0.98rem;
    }

    .template-link {
      flex-shrink: 0;
      align-self: end;
      padding: 12px 14px;
      border-radius: 999px;
      background: var(--surface-strong);
      border: 1px solid var(--line);
      font-size: 0.92rem;
      font-weight: 600;
    }

    .empty-state {
      margin-top: 32px;
      padding: 32px;
      border-radius: var(--radius-md);
      border: 1px dashed var(--line);
      background: rgba(255, 255, 255, 0.6);
      color: var(--muted);
    }

    @media (max-width: 720px) {
      .page-shell {
        width: min(100% - 20px, 1200px);
        padding: 20px 0 48px;
      }

      .hero {
        padding: 24px;
      }

      .templates-grid {
        grid-template-columns: 1fr;
      }

      .template-card {
        grid-template-rows: 250px auto;
      }

      .template-body {
        flex-direction: column;
      }

      .template-link {
        align-self: start;
      }
    }
  </style>
</head>
<body>
  <main class="page-shell">
    <section class="hero">
      <p class="hero-label">Template Showcase</p>
      <h1>Montra automática de templates</h1>
      <p>Esta página é servida diretamente a partir das subpastas de <code>src</code>. Cada novo template com <code>index.html</code> passa a aparecer automaticamente na montra e tem uma área própria de visualização.</p>
      <div class="hero-meta">
        <span><strong>${templates.length}</strong> templates detetados</span>
        <span>Origem: <code>/src</code></span>
      </div>
    </section>
    ${
      templates.length
        ? `<section class="templates-grid">
${cards}
    </section>`
        : `<section class="empty-state">Nenhum template foi encontrado em <code>src</code>.</section>`
    }
  </main>
</body>
</html>`;
}

export function renderTemplateViewerPage(templates, currentTemplate) {
  const currentIndex = templates.findIndex((template) => template.slug === currentTemplate.slug);
  const previous = currentIndex > 0 ? templates[currentIndex - 1] : templates.at(-1);
  const next = currentIndex < templates.length - 1 ? templates[currentIndex + 1] : templates[0];

  const templateLinks = templates
    .map((template) => {
      const currentClass = template.slug === currentTemplate.slug ? " template-item-current" : "";

      return `        <a class="template-item${currentClass}" href="${escapeHtml(template.viewerHref)}">
          <span>${escapeHtml(template.name)}</span>
          <small>${escapeHtml(template.slug)}</small>
        </a>`;
    })
    .join("\n");

  const description = currentTemplate.description
    ? `<p class="viewer-copy">${escapeHtml(currentTemplate.description)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(currentTemplate.name)} | Viewer</title>
  <meta name="description" content="Visualização do template ${escapeHtml(currentTemplate.name)}.">
  <style>
    :root {
      --bg: #131313;
      --panel: #1d1d1d;
      --panel-soft: #262626;
      --text: #f3efe8;
      --muted: #b6aa9f;
      --line: rgba(255, 255, 255, 0.08);
      --accent: #d4a373;
      --radius: 22px;
      --font-display: "Georgia", "Times New Roman", serif;
      --font-body: "Segoe UI", Tahoma, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: var(--font-body);
      color: var(--text);
      background:
        radial-gradient(circle at top right, rgba(212, 163, 115, 0.18), transparent 28rem),
        linear-gradient(180deg, #181818 0%, #101010 100%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .viewer-layout {
      display: grid;
      grid-template-columns: 320px minmax(0, 1fr);
      min-height: 100vh;
    }

    .viewer-sidebar {
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 24px;
      padding: 28px;
      background: rgba(14, 14, 14, 0.9);
      border-right: 1px solid var(--line);
      backdrop-filter: blur(16px);
    }

    .viewer-back {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .viewer-heading h1 {
      margin: 8px 0 0;
      font-size: 2.4rem;
      line-height: 0.95;
      font-family: var(--font-display);
      font-weight: 600;
    }

    .viewer-label {
      margin: 0;
      font-size: 0.75rem;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
    }

    .viewer-copy {
      margin: 14px 0 0;
      line-height: 1.7;
      color: var(--muted);
      font-size: 0.98rem;
    }

    .viewer-nav {
      display: grid;
      gap: 12px;
    }

    .viewer-nav-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .viewer-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 12px 14px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--panel-soft);
      color: var(--text);
      font-weight: 600;
    }

    .viewer-list {
      display: grid;
      gap: 10px;
      align-content: start;
      overflow: auto;
    }

    .template-item {
      display: grid;
      gap: 4px;
      padding: 14px 16px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.02);
    }

    .template-item small {
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .template-item-current {
      background: rgba(212, 163, 115, 0.16);
      border-color: rgba(212, 163, 115, 0.42);
    }

    .viewer-raw-link {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 14px;
      border-radius: 999px;
      background: var(--accent);
      color: #1a130d;
      font-weight: 700;
    }

    .viewer-stage {
      display: grid;
      grid-template-rows: auto 1fr;
      min-width: 0;
      padding: 18px;
      gap: 18px;
    }

    .viewer-stage-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--line);
      color: var(--muted);
    }

    .viewer-stage-frame {
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid var(--line);
      background: #ffffff;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
    }

    .viewer-stage-frame iframe {
      width: 100%;
      height: calc(100vh - 92px);
      border: 0;
      background: #ffffff;
    }

    @media (max-width: 980px) {
      .viewer-layout {
        grid-template-columns: 1fr;
      }

      .viewer-sidebar {
        grid-template-rows: auto auto auto auto;
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }

      .viewer-stage-frame iframe {
        height: 78vh;
      }
    }
  </style>
</head>
<body>
  <div class="viewer-layout">
    <aside class="viewer-sidebar">
      <a class="viewer-back" href="/">← Voltar à montra</a>
      <section class="viewer-heading">
        <p class="viewer-label">Template Viewer</p>
        <h1>${escapeHtml(currentTemplate.name)}</h1>
        ${description}
      </section>
      <nav class="viewer-nav" aria-label="Navegação entre templates">
        <div class="viewer-nav-row">
          <a class="viewer-button" href="${escapeHtml(previous.viewerHref)}">Anterior</a>
          <a class="viewer-button" href="${escapeHtml(next.viewerHref)}">Seguinte</a>
        </div>
        <div class="viewer-list">
${templateLinks}
        </div>
      </nav>
      <a class="viewer-raw-link" href="${escapeHtml(currentTemplate.href)}" target="_blank" rel="noreferrer">Abrir template direto</a>
    </aside>
    <main class="viewer-stage">
      <div class="viewer-stage-bar">
        <span>A navegar em <strong>${escapeHtml(currentTemplate.slug)}</strong></span>
        <span>O layout corre no mesmo servidor, com os assets reais do template.</span>
      </div>
      <section class="viewer-stage-frame">
        <iframe src="${escapeHtml(currentTemplate.href)}" title="Template ${escapeHtml(currentTemplate.name)}"></iframe>
      </section>
    </main>
  </div>
</body>
</html>`;
}
