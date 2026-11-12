# Favoritos e comparação na montra

A montra mantém dois conjuntos de slugs no localStorage (`showcase-favorites` e
`showcase-comparison`). A leitura valida o formato, elimina duplicados e ignora
slugs ausentes do catálogo atual; a comparação fica limitada a três opções.
Falhas de armazenamento permitem continuar com estado em memória nesta página.
Não existe autenticação nem transmissão destas escolhas para um backend.

Favoritos é uma vista do catálogo que combina pesquisa, área e ordenação. A
seleção para comparação é independente desses filtros e permanece visível acima
do catálogo. Para substituir uma opção, remove-se uma seleção e adiciona-se outra.
A vista ativa e os filtros não são persistidos; as duas seleções são.

O diálogo nativo fornece navegação de teclado e Escape. A comparação usa colunas
em tablet/desktop e cartões empilhados em mobile, com retorno de foco explícito
quando se removem controlos. Os atributos vêm exclusivamente do catálogo: nome,
área, descrição, label editorial existente e link direto. Não se inferem
funcionalidades nem dados comerciais a partir do conteúdo dos templates.

Alterações em `scripts/showcase/` ou no gerador exigem regenerar `index.html` com
`node scripts/generate-showcase.mjs`. `npm test` inclui testes de browser para
persistência, filtros, limite, remoção, limpeza, teclado e larguras responsivas.
