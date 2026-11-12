# Margem — revista independente

Template editorial em PT-PT sobre cultura, design e tecnologia. Abra `index.html` diretamente ou na montra (`npm run dev`). Não requer dependências, fontes remotas, serviços nem build próprio.

- Homepage com capa, seis histórias, categorias, pesquisa sem distinção de acentos e ordenação por tempo de leitura. Os filtros combinam-se e podem ser limpos no estado vazio.
- `article.html?id=cidade` apresenta o artigo de capa. Cada história tem conteúdo próprio, índice com âncoras, leituras relacionadas e modo de leitura reversível. Identificadores desconhecidos apresentam recuperação para a homepage.
- Newsletter com validação nativa de email e confirmação explícita da demonstração; não guarda nem transmite dados.
- Ilustrações SVG locais, teclado, foco visível, link de salto, estados anunciados e respeito por movimento reduzido.

Personalização: conteúdos em `assets/data.js` e `assets/main.js`; cores, tipografia e grelhas em `assets/style.css`. As ilustrações são SVG editáveis. Todos os autores e textos são demonstrativos. Com JavaScript desativado, a capa e uma versão breve do artigo continuam acessíveis; a edição interativa exige JavaScript.
