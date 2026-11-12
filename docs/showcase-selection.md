# Favoritos e comparação na montra

A montra guarda apenas slugs nas chaves `showcase-favorites` e `showcase-comparison` do localStorage. Os dados são validados contra os cartões atuais ao carregar, e a comparação conserva no máximo três entradas. Se o armazenamento estiver indisponível ou inválido, as ações continuam disponíveis na sessão. Pesquisa, área e ordenação não alteram as seleções. A comparação usa os dados apresentados nos cartões, incluindo o label editorial quando existe.
