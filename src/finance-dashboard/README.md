# Balanço — Finance Dashboard

Dashboard de finanças pessoais fictício em PT-PT. Abrir `index.html` diretamente ou escolher Balanço no catálogo (`npm run dev`). Sem dependências, fontes externas, autenticação ou backend.

Os movimentos de junho a novembro de 2026 estão em `assets/main.js`, com receitas e despesas em cêntimos. O mês por defeito é novembro de 2026. Os seletores de mês atualizam o saldo, as variações face ao mês anterior, o gráfico, a tabela de valores, o orçamento e a lista de movimentos.

A pesquisa ignora maiúsculas e acentos e combina-se com tipo, categoria e ordenação. Um filtro sem resultados ou um mês sem movimentos mostram um estado vazio com ação. "Adicionar movimento" abre um diálogo nativo com validação por campo; o movimento entra apenas nesta visita. "Exportar CSV" gera um ficheiro local com os movimentos filtrados (separador `;`, decimais com vírgula, BOM UTF-8 para o Excel).

O gráfico é SVG com valores em tooltip e numa tabela expansível. Respeita `prefers-reduced-motion`, tem foco visível, labels associadas e tabelas e cartões que se adaptam a ecrãs pequenos.
