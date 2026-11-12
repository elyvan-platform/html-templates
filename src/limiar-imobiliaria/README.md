# Limiar — Casas com lugar

Template imobiliário independente em PT-PT, sem dependências. Abra `index.html` diretamente ou pela montra (`npm run dev`, entrada Imobiliário).

Pesquisa por localização, preço máximo e tipologia, ordenação, favoritos persistidos em `limiar-favorites` e detalhe acessível num diálogo (Escape para fechar). Os detalhes podem ser abertos diretamente com `?imovel=luz-na-estrela`. Referências desconhecidas apresentam um estado de erro. Favoritos sem armazenamento disponível mantêm-se durante a sessão.

O detalhe inclui galeria, classificação energética, mapa meramente ilustrativo e formulário de visita com validação. Não existe envio, integração, localização real ou marcação. Os dados do formulário são apagados ao concluir ou fechar o detalhe. Os imóveis são fictícios; as duas imagens adicionais da galeria são explicitamente identificadas como ambientes ilustrativos.

Edite `assets/data.js` para alterar os imóveis; `assets/style.css` contém as cores e os pontos de adaptação. As fotografias são servidas pelo Unsplash e têm uma ilustração SVG local como alternativa se a rede falhar. Não há fontes, bibliotecas ou APIs externas obrigatórias. O catálogo é utilizável sem rede. A renderização e as interações requerem JavaScript.

Verificação: `npm ci`, `npm test`, `npm run build`. A montra descobre a página pelo título e descrição; a categoria está em `scripts/showcase-lib.mjs`.
