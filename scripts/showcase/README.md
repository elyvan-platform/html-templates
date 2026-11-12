# Miniaturas da montra

As cards usam screenshots estáticos em `src/showcase-assets/<slug>-480.webp`
e `<slug>-960.webp`. Os 46 templates foram capturados em Chromium, viewport
1440 × 900, e reduzidos para 480 × 300 e 960 × 600 (WebP, qualidade 78).
São assets versionados; a captura não corre no build e não exige dependências
adicionais. Para atualizar uma miniatura, capturar a página inicial do template
no mesmo viewport e substituir os dois ficheiros. Confirmar o enquadramento
antes de versionar; a automatização da captura fica para outra tarefa.

`listTemplateDirectories()` é o manifesto da coleção. `thumbnailHref` procura
ambas as versões otimizadas e recorre a `previewHref` (assets existentes do
template) se não estiverem disponíveis. `previewHref` mantém o contrato anterior.
Sem imagem, ou em caso de erro de rede/descodificação, aparece um SVG inline
com texto de indisponibilidade. Cada imagem tem alt com nome e área do template.

A estratégia de #54 / PR #49 disponível neste checkout foi mantida: uma única
fila de cards, IntersectionObserver com margem de 200 px, atualização após
pesquisa/filtros e fallback de scroll/resize. Apenas a ativação de `srcset` foi
acrescentada. As imagens começam com placeholder e `loading="lazy"`; a fila
ativa `srcset`/`src` com `loading="eager"` quando a card está próxima do viewport,
sem uma segunda espera nativa. `sizes` acompanha as três grelhas responsivas.
Dimensões 960 × 600 e altura reservada da card evitam alterações de layout.
O código de escala de iframes das cards deixou de ser necessário.

O único iframe da montra fica no diálogo, inicialmente em `about:blank`.
Abrir o preview carrega o template; fechar descarrega-o. O viewer dedicado
continua a usar um iframe para a demonstração interativa.

Validação: `npm ci`, `npm run build`, `npm test` (inclui cobertura de todos os
assets, formatos, alt, fallback, fila e srcset). Chromium em 1440 × 1000 e
390 × 1000: inspeção visual, pesquisa, filtros, tema, preview nos três dispositivos,
link direto e erro de imagem. DOM: zero iframes nas cards. Rede antes do preview:
um único pedido de documento, sem documentos de templates. O iframe vazio do
diálogo não faz pedidos de templates. Não havia remote nem histórico separado
da PR #49 neste checkout; a análise incidiu na implementação e testes de lazy
loading já presentes, preservados nesta alteração.
