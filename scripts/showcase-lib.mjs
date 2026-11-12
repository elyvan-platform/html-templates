import { readFileSync } from "node:fs";
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
    thumbnailHref: await findThumbnailAsset(slug) || previewHref,
    href: `/src/${slug}/index.html`,
    viewerHref: `/templates/${slug}`,
  };
}

async function findThumbnailAsset(slug) {
  try {
    await fs.access(path.join(srcDir, "showcase-assets", `${slug}-480.webp`));
    await fs.access(path.join(srcDir, "showcase-assets", `${slug}-960.webp`));
    return `/src/showcase-assets/${slug}-480.webp`;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return null;
}

async function findPreviewAsset(slug) {
  const previewNames = [
    "preview.avif",
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

const styles = readFileSync(new URL('./showcase/ui.css', import.meta.url), 'utf8');
const clientScript = readFileSync(new URL('./showcase/ui.js', import.meta.url), 'utf8');

export function templateArea(template) {
  const value = `${template.slug} ${template.name}`.toLowerCase();
  const groups = [
    ['Cultura e revistas', /margem-revista|music-player/],
    ['Saúde', /saude|saúde|clinica|clínica|farmacia|farmácia/],
    ['Restauração', /cafe|café|pastelaria|casa-da-mesa/],
    ['Beleza', /hair|tesoura/],
    ['Comércio', /mercado|mercearia|atelie-digital/],
    ['Desporto', /training|fitness-dashboard|atlantico|atlântico/],
    ['Educação', /agrupamento|learning-platform/],
    ['Serviços públicos', /junta/],
    ['Hotelaria', /stay|solar-do-sossego/],
    ['Viagens', /travel-explorer/],
    ['Arquitetura', /forma-norte|architecture-studio/],
    ['Branding e design', /agencia-criativa/],
    ['Imobiliário', /limiar-imobiliaria/],
    ['Design e decoração', /maison|albor|lume-configurator/],
    ['Mobilidade', /rota-norte/],
    ['Automóvel', /automotive/],
    ['Finanças', /finance-dashboard|balanço|balanco/],
    ['Emprego e carreiras', /oportuna/],
    ['Meteorologia', /weather-app/],
    ['Gestão de projetos', /project-management|compasso/],
    ['Jogos e entretenimento', /gaming-community/],
    ['Tecnologia', /pulso-conference|saas|orbit|admin-dashboard|crypto-dashboard|nexo-ai|ai-chat-interface|portfolio-developer|cyber|entrelinhas|estrato-startup/],
  ];
  return groups.find(([, pattern]) => pattern.test(value))?.[0] || 'Outras áreas';
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title><meta name="description" content="Descubra templates para a sua área e explore cada detalhe em mobile, tablet e desktop.">
<style>${styles}</style>
<script>try{const t=localStorage.getItem('showcase-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}</script>
</head><body><a class="skip-link" href="#main">Saltar para o conteúdo</a><div class="shell">
<header class="topbar"><a class="brand" href="/" aria-label="Montra de templates — início"><span class="brand-mark" aria-hidden="true">✦</span>template.space</a>
<label class="theme-control" for="theme">Aparência <select id="theme"><option value="system" selected>Sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label></header>
${body}
<footer class="footer"><span>template.space / Uma ideia. Infinitas possibilidades.</span><span>Explore. Experimente. Imagine.</span></footer></div><script>${clientScript}</script></body></html>`;
}

function previewStage() {
  return `<div class="devices" role="group" aria-label="Dispositivo de preview">
${[['mobile','Mobile'],['tablet','Tablet'],['desktop','Desktop']].map(([key,label]) => `<button type="button" data-device="${key}" aria-pressed="${key === 'desktop'}">${label}</button>`).join('')}
</div>`;
}
function stage(href = 'about:blank', name = '') {
  return `<section class="preview-stage" aria-label="Simulação do template"><p class="viewport-label" id="viewport-label" aria-live="polite"></p><div class="frame-wrap"><iframe class="device-frame" id="device-frame" src="${escapeHtml(href)}" title="Preview de ${escapeHtml(name)}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe></div></section>`;
}

const thumbnailPlaceholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="#e5e8f0"/><text x="480" y="300" text-anchor="middle" fill="#59627a" font-family="sans-serif" font-size="28">Pré-visualização indisponível</text></svg>');

export function renderShowcasePage(templates) {
  const areas = [...new Set(templates.map(templateArea))].sort((a,b) => a.localeCompare(b,'pt'));
  const cards = templates.map(template => {
    const name = escapeHtml(template.name), href = escapeHtml(template.href), area = escapeHtml(templateArea(template));
    const image = template.thumbnailHref || template.previewHref;
    const responsive = image?.endsWith('-480.webp') ? ` data-srcset="${escapeHtml(image.slice(1))} 480w, ${escapeHtml(image.slice(1).replace('-480.webp', '-960.webp'))} 960w"` : '';
    const preview = `data-preview data-href="${href}" data-name="${name}"`;
    return `<article class="template-card" data-area="${area}">
<button type="button" class="template-preview" ${preview} aria-label="Pré-visualizar ${name}"><img class="thumbnail" src="${thumbnailPlaceholder}"${image ? ` data-src="${escapeHtml(image)}"` : ''}${responsive} sizes="(max-width: 650px) calc(100vw - 32px), (max-width: 1100px) calc((100vw - 88px) / 2), (max-width: 1464px) calc((100vw - 112px) / 3), 450px" width="960" height="600" alt="Página inicial de ${name} — ${area}" loading="lazy" decoding="async"><span class="preview-tag">Explorar template ↗</span></button>
<div class="template-body"><p class="template-kicker">${area}</p><h2>${name}</h2><p class="template-copy">${escapeHtml(template.description || 'Explore este template e descubra uma nova possibilidade para o seu projeto.')}</p>
<div class="card-actions"><a href="${href}" target="_blank" rel="noopener">Abrir site ↗</a><button type="button" class="preview-action" ${preview} aria-label="Pré-visualizar ${name}">Preview →</button></div></div></article>`;
  }).join('');
  return page('Montra de Templates', `<main id="main"><section class="hero"><p class="eyebrow">Uma nova perspetiva digital</p><h1>O próximo passo da sua marca começa <span>aqui.</span></h1><p class="hero-copy">Design com personalidade, para cada ideia. Descubra o seu template e experimente-o em qualquer ecrã.</p><div class="hero-bottom"><span class="collection-label">Coleção / ${String(templates.length).padStart(2,'0')} templates</span><span class="results"><span class="status-dot"></span>Prontos para explorar</span></div></section>
<section class="catalogue" aria-label="Coleção de templates"><div class="toolbar"><label class="search" for="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Pesquisar templates…" aria-label="Pesquisar templates"></label><span class="results" id="result-count" role="status">${templates.length} de ${templates.length} templates</span></div>
<div class="filters" role="group" aria-label="Filtrar por área"><button type="button" data-filter="all" aria-pressed="true">Todas as áreas</button>${areas.map(area => `<button type="button" data-filter="${escapeHtml(area)}" aria-pressed="false">${escapeHtml(area)}</button>`).join('')}</div>
<div class="templates-grid">${cards}</div><div class="empty-state" id="no-results" ${templates.length ? 'hidden' : ''}><h2>Nenhum template encontrado</h2><p>Experimente outra pesquisa ou explore todas as áreas.</p><button type="button" id="reset-filters">Limpar filtros</button></div></section></main>
<dialog class="preview-dialog" id="preview-dialog" aria-labelledby="preview-title"><div class="preview-toolbar"><h2 class="preview-title" id="preview-title">Preview</h2>${previewStage()}<div class="preview-links"><a id="preview-direct" href="#" target="_blank" rel="noopener">Abrir site ↗</a><button type="button" id="close-preview" aria-label="Fechar preview">Fechar ×</button></div></div>${stage()}</dialog>`);
}

export function renderTemplateViewerPage(templates, currentTemplate) {
  const index = templates.findIndex(template => template.slug === currentTemplate.slug);
  const previous = templates[(index - 1 + templates.length) % templates.length];
  const next = templates[(index + 1) % templates.length];
  return page(`${currentTemplate.name} | Preview`, `<main id="main" class="viewer-shell"><a href="/">← Voltar à montra</a><p class="eyebrow">${escapeHtml(templateArea(currentTemplate))}</p><h1>${escapeHtml(currentTemplate.name)}</h1><nav class="viewer-nav" aria-label="Navegação entre templates"><a class="button" href="${escapeHtml(previous.viewerHref)}">← Anterior</a><a class="button" href="${escapeHtml(next.viewerHref)}">Seguinte →</a><a class="button" href="${escapeHtml(currentTemplate.href)}" target="_blank" rel="noopener">Abrir site ↗</a></nav><div class="preview-toolbar"><span>Explore em diferentes ecrãs</span>${previewStage()}</div>${stage(currentTemplate.href,currentTemplate.name)}</main>`);
}
