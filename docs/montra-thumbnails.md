# Miniaturas da montra

O build descobre os mesmos diretórios com `index.html` que o catálogo e captura a página inicial em Chromium, a 1440×900. Gera AVIF, WebP e JPEG de 480×300 e 960×600 em `src/_thumbnails/<slug>-<largura>.<formato>`, usados pelo `<picture>` da montra. Os ficheiros gerados devem acompanhar o código para que o servidor Railway os sirva sem executar um browser.

Depois de `npm ci`, instale o browser com `npx playwright install --with-deps chromium` (ou defina `CHROMIUM` para um executável Chromium compatível). Comandos:

- `npm run build`: gera as miniaturas novas ou alteradas e atualiza `index.html`.
- `npm run thumbnails -- --all`: regenera todos os templates.
- `npm run thumbnails -- nome-do-template`: regenera apenas esse template; aceitam-se vários slugs.
- `npm run thumbnails -- --changed`: gera apenas os alterados; pode combinar-se com slugs.

O cache local ignorado em `src/_thumbnails/.capture-cache.json` contém hashes dos ficheiros de cada template, das definições de captura e do lockfile; ficheiros em falta são sempre gerados. Em CI, pode guardar essa pasta e os assets gerados entre builds. Recursos remotos podem mudar sem alterar o hash local: use `--all` para os atualizar. A captura espera o carregamento, fontes e imagens visíveis, limita as tentativas e assinala falhas ou capturas vazias. Apenas pedidos GET de imagens, fontes e folhas de estilo externas são permitidos; pedidos a APIs e submissões são bloqueados. Recursos remotos indisponíveis podem fazer a captura falhar; não se substitui silenciosamente uma miniatura anterior.

O catálogo preserva o placeholder quando uma imagem não existe ou falha, e o preview interativo continua a carregar o template a pedido.
