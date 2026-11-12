# Vértice Crypto

Template independente em PT-PT, sem dependências nem pedidos externos. Abrir `index.html` diretamente ou usar a entrada Crypto Dashboard no catálogo (`npm run dev`).

Cotações, variações e séries são exemplos determinísticos, sem integração financeira. A carteira usa quantidades fictícias: os totais, variação diária e percentagens são calculados com base nos preços locais. O resultado fictício apresentado no primeiro cartão é um exemplo face a um custo de aquisição ilustrativo.

Inclui seleção de ativo, quatro intervalos, descrição e valores alternativos ao gráfico SVG, alocação, pesquisa por nome/símbolo, filtros de variação, ordenação e watchlist. Favoritos mantêm-se apenas durante a visita; recarregar repõe os três exemplos iniciais. Uma pesquisa sem resultados ou watchlist vazia apresenta uma ação para repor a lista. Não existem carregamentos remotos ou erros de rede a simular.

Os dados estão em `assets/main.js`; a identidade visual e os breakpoints em `assets/style.css`. Respeita reduced-motion, navegação por teclado e tem tabelas com scroll horizontal em ecrãs pequenos.
