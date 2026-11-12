# Miniaturas da montra

O catálogo usa `preview.webp` (960 × 600) e `preview-480.webp` (480 × 300), capturas do viewport desktop 1440 × 900, comprimidas em WebP com qualidade 78. Os SVG existentes de Fitness, Lume Configurator e Compasso são reutilizados. Os 46 templates descobertos por `listTemplateDirectories` têm preview local; não existe um manifesto separado. Os novos assets totalizam aproximadamente 1,4 MB. A captura foi pontual com Chromium; o build apenas gera HTML, sem browser, dependências novas ou automatização de screenshots.

Mantém-se a implementação de Montra Lazy Load presente na base: observer dos cartões com margem de 200 px, fila pendente, integração com pesquisa/filtros e fallback de scroll/resize. Só ao ativar uma imagem são atribuídos `srcset` e `src`, com `loading=eager`, evitando uma segunda espera do browser. Antes disso mantém-se `loading=lazy` e um placeholder SVG local. O checkout não disponibiliza remoto nem histórico da PR #49; a lógica e os testes existentes foram a referência para compatibilidade com esse trabalho.

`width`/`height` e a altura reservada do cartão evitam deslocamentos de layout. CSS adapta a imagem à largura e recorta a partir do topo; `sizes` acompanha as três colunas, duas colunas e uma coluna. O texto alternativo identifica o template e a área. Ausência de metadados ou erro de imagem usa o placeholder local, sem novas tentativas em ciclo. WebP é suportado pelos browsers atuais; o placeholder SVG também cobre falhas de descodificação.

O único iframe do catálogo é o do diálogo, inicialmente `about:blank`: abre o template a pedido e volta a `about:blank` quando fecha. A página dedicada `/templates/:slug` mantém o seu iframe, necessário ao preview. Os controlos desktop/tablet/mobile e os links “Abrir site” são preservados.

Para atualizar uma captura, substituir os dois WebP do template mantendo os tamanhos acima e executar `npm run build`. Não editar manualmente o `index.html` gerado. `npm test` verifica cobertura dos assets, dimensões, ausência de iframes nos cartões, lazy loading e fallback.

Validação em Chromium a 1440 e 390 px: inspeção visual das cards, apenas um pedido de documento inicial (a montra), zero iframes nas cards, preview nos três dispositivos, fecho, pesquisa, filtro Saúde, tema escuro e fallback após imagem inexistente. As capturas de validação são temporárias e não fazem parte do site.
