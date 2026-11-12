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
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".wav", "audio/wav"],
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
      return serveStaticFile(pathname, response, request);
    }

    sendHtml(response, 404, renderNotFoundPage("Página não encontrada."));
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Internal server error\n${error?.message || error}`);
  }
});

server.listen(port, host, () => {
  console.log(`[showcase] server running at http://${host}:${server.address().port}`);
});

function sendHtml(response, statusCode, html) {
  response.writeHead(statusCode, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

async function serveStaticFile(pathname, response, request) {
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

  // Audio seeking needs byte-range responses in the local catalogue preview.
  if (extension === ".wav") {
    response.setHeader("accept-ranges", "bytes");
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = NaN;
      let end = NaN;
      if (match && (match[1] || match[2])) {
        start = match[1] ? Number(match[1]) : Math.max(0, fileStat.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), fileStat.size - 1) : fileStat.size - 1;
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= fileStat.size) {
        response.writeHead(416, { "content-range": `bytes */${fileStat.size}` });
        response.end();
        return;
      }
      response.writeHead(206, {
        "content-type": contentType,
        "content-range": `bytes ${start}-${end}/${fileStat.size}`,
        "content-length": end - start + 1,
      });
      if (request.method === "HEAD") response.end();
      else createReadStream(absolutePath, { start, end }).pipe(response);
      return;
    }
  }

  response.writeHead(200, {
    "content-type": contentType,
    "content-length": fileStat.size,
  });

  if (request.method === "HEAD") response.end();
  else createReadStream(absolutePath).pipe(response);
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
