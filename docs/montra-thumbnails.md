# Miniaturas da montra

`npm run build` gera as miniaturas em falta ou alteradas e depois atualiza `index.html`. `npm run thumbnails` regenera todas; `npm run thumbnails -- slug` regenera um template (aceita vários slugs); `npm run thumbnails -- --changed` utiliza a cache. A descoberta é a mesma do catálogo: pastas em `src` com `index.html`.

A captura é feita apenas no build, com Playwright/Chromium, em 1440×900. ImageMagick produz AVIF, WebP e JPEG em 480×300 e 960×600 em `src/_thumbnails/<slug>-<largura>.<formato>`, consumidos pelo `<picture>` da montra. O manifesto nessa pasta guarda hashes dos ficheiros de cada template, do script e das dependências; uma alteração ou ficheiro em falta invalida a cache. Os assets gerados devem ser incluídos no deploy. O servidor Railway não inicia o browser.

Para preparar uma máquina de build: `npm ci`, `npx playwright install --with-deps chromium` e instalar ImageMagick com suporte AVIF/WebP (por exemplo `apt-get install imagemagick`). `CHROMIUM=/caminho` permite usar outro executável compatível. Em CI, preservar `src/_thumbnails` entre builds permite reutilizar a cache. Capturas dependem da disponibilidade das imagens e fontes remotas usadas pelos templates; alterações em recursos remotos não invalidam o hash, pelo que se deve forçar a regeneração quando necessário.

O processo espera o carregamento, fontes e imagens visíveis, com timeout e duas tentativas; indica o slug e falha se não conseguir. Pedidos externos limitam-se a imagens, fontes e folhas de estilo GET; scripts externos, formulários e pedidos de integração são bloqueados. Os templates e o preview interativo não são alterados. Um cartão sem miniatura apresenta o nome como alternativa.
