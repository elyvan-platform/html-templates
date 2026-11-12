# Descoberta na montra

A seleção editorial é a lista `featuredSlugs` em `scripts/showcase-lib.mjs`. Contém três identificadores de diretórios; os restantes templates têm `featured: false` por defeito. Para alterar os destaques, editar essa lista e gerar a montra com `npm run build`. Cada template aparece uma única vez: os destacados na primeira secção e os restantes na secção seguinte; em conjunto constituem o catálogo completo.

A pesquisa e o filtro por área aplicam-se às duas secções, e o contador inclui ambas. A ordenação por nome A–Z ou Z–A aplica-se dentro de cada secção, com identificador como desempate crescente. Não existem datas de publicação fiáveis no catálogo, pelo que Z–A é a alternativa determinística a «mais recentes»; datas do filesystem não representam publicação.
