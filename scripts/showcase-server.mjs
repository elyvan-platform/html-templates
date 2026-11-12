import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import {
  listTemplateDirectories,
  renderShowcasePage,
  renderTemplateViewerPage,
  rootDir,
  srcDir,
} from "./showcase-lib.mjs";

const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === "/") {
      const templates = await listTemplateDirectories();
      return sendHtml(response, 200, renderShowcasePage(templates));
    }

    if (pathname.startsWith("/templates/")) {
      const slug = pathname.replace(/^\/templates\//, "").replace(/\/+$/, "");
      const templates = await listTemplateDirectories();
      const currentTemplate = templates.find((template) => template.slug === slug);

      if (!currentTemplate) {
        return sendHtml(response, 404, renderNotFoundPage("Template não encontrado."));
      }

      return sendHtml(response, 200, renderTemplateViewerPage(templates, currentTemplate));
    }

    if (pathname === "/health") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    if (pathname.startsWith("/src/")) {
      return serveStaticFile(pathname, response);
    }

    sendHtml(response, 404, renderNotFoundPage("Página não encontrada."));
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Internal server error\n${error?.message || error}`);
  }
});

server.listen(port, host, () => {
  console.log(`[showcase] server running at http://${host}:${port}`);
});

function sendHtml(response, statusCode, html) {
  response.writeHead(statusCode, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

async function serveStaticFile(pathname, response) {
  const absolutePath = path.resolve(rootDir, `.${pathname}`);
  const relativeToSrc = path.relative(srcDir, absolutePath);

  if (relativeToSrc.startsWith("..") || path.isAbsolute(relativeToSrc)) {
    sendHtml(response, 403, renderNotFoundPage("Acesso negado."));
    return;
  }

  let fileStat;

  try {
    fileStat = await fs.stat(absolutePath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      sendHtml(response, 404, renderNotFoundPage("Ficheiro não encontrado."));
      return;
    }

    throw error;
  }

  if (fileStat.isDirectory()) {
    sendHtml(response, 403, renderNotFoundPage("Diretório não pode ser servido diretamente."));
    return;
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = mimeTypes.get(extension) || "application/octet-stream";

  response.writeHead(200, {
    "content-type": contentType,
    "content-length": fileStat.size,
  });

  createReadStream(absolutePath).pipe(response);
}

function renderNotFoundPage(message) {
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Not Found</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #111;
      color: #f2ece4;
      font-family: "Segoe UI", sans-serif;
    }

    main {
      padding: 32px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }

    a {
      color: #d4a373;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <main>
    <h1>${message}</h1>
    <p><a href="/">Voltar à montra</a></p>
  </main>
</body>
</html>`;
}
