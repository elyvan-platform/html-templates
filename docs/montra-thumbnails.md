# Montra: miniaturas estáticas

- Os cartões do catálogo usam `<picture>` (AVIF → WebP → JPEG, 480w/960w) em vez de iframes. O único `<iframe>` da página inicial é o do diálogo de preview, que continua a carregar o template a pedido (mobile/tablet/desktop) e mantém "Abrir site".
- Ficheiros em `src/_thumbnails/<slug>-<largura>.<avif|webp|jpg>` (pasta ignorada pelo listador de templates por não ter `index.html`; servida por `/src/`).
- Geração manual: `node scripts/capture-thumbnails.mjs [slug…]` (requer `chromium` e ImageMagick `convert`; captura 1440×900). Automatizar no build é uma tarefa separada. Quando um template novo não tem imagem, o cartão mostra um placeholder com o nome e o teste `showcase-thumbnails` falha para lembrar de gerar a imagem.
- Layout shift: `width/height` (960×600) no `<img>` + `aspect-ratio: 16/10` no contentor.
- Lazy loading (relação com a PR #49 / task #54): a lógica com `IntersectionObserver` servia para adiar iframes; com imagens estáticas é substituída por `loading="lazy"` nativo. Os 3 primeiros cartões usam `loading="eager"` (o primeiro com `fetchpriority="high"`). Pesquisa e filtros não precisam de lógica de carregamento: cartões ocultos (`hidden`) não são descarregados.
- Se uma imagem falhar a carregar, `ui.js` marca o `.thumb-frame` como `is-missing` e mostra o placeholder.
