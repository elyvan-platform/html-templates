# Miniaturas da montra

As capturas estáticas em `src/showcase-thumbnails/<slug>.webp` representam o viewport desktop (1440 × 900), reduzido para 720 × 450 em WebP. Ao adicionar ou alterar um template, atualize a captura correspondente e execute `npm run build` para regenerar `index.html`. A geração automática das capturas não faz parte do build.

A montra reutiliza o observador de cartões da PR #49: só atribui o URL da imagem perto do viewport, incluindo após filtros, com fallback de scroll em browsers sem IntersectionObserver. O espaço é reservado no cartão; se a captura não existir ou falhar, aparece o nome do template. O iframe continua reservado ao preview interativo.
