# Pixel Porto

Template independente em PT-PT (HTML, CSS e JS simples), sem dependências, sem contas e sem pedidos externos. Abrir `index.html` diretamente ou usar a entrada Pixel Porto no catálogo (`npm run dev`).

Secções: destaques em carrossel (botões, pontos e setas do teclado), catálogo com pesquisa sem acentos, género, plataforma, ordenação e "só favoritos", notícias com categorias e leitura em diálogo nativo, rankings em separadores (com navegação por setas) com perfis fictícios, perfil com badges calculadas e favoritos.

Todos os dados são fictícios e estão em `assets/data.js`. Favoritos, notícias lidas e nome de jogador são guardados em `localStorage` apenas neste navegador; se o armazenamento estiver bloqueado, a interface avisa e funciona só durante a visita.

A lógica (filtros, rankings, badges, validação e estado) está em `assets/main.js`, com exports opcionais para testes. O visual e os breakpoints estão em `assets/style.css`; respeita `prefers-reduced-motion` e mantém foco visível. A arte dos jogos e notícias é gerada com gradientes CSS, por isso não há imagens externas a falhar.
