# PULSO 2027

Landing page independente em PT-PT de uma conferência tecnológica fictícia. Abrir `index.html` diretamente ou executar `npm run dev` na raiz e visitar `/src/pulso-conference/index.html`. A montra inclui o template na área Tecnologia e disponibiliza preview e navegação.

HTML, CSS e JavaScript nativos, sem dependências, fontes remotas, pedidos de rede ou imagens externas. As composições geométricas e retratos tipográficos são CSS. Adaptável a telemóvel, tablet e desktop, com foco visível, menu acessível, labels e suporte a movimento reduzido.

A data de abertura é **14 de outubro de 2027 às 09:00 no Porto (UTC+1)**. Alterar a constante `opening` em `assets/main.js` e os textos/data no HTML para outra edição. Quando termina, a contagem apresenta uma mensagem de abertura, sem valores negativos.

A agenda usa o array `sessions` em `assets/main.js`. Os filtros de dia e palco combinam-se; o Laboratório do dia 15 demonstra o estado vazio. Os links dos passes preenchem o formulário. A validação mostra erros por campo e a confirmação é apenas local; não há armazenamento, inscrição, pagamento ou envio de dados. Usar dados fictícios. Os acordeões das perguntas frequentes funcionam sem JavaScript; a agenda inclui um resumo alternativo.

Verificação na raiz: `npm ci`, `npm run build`, `npm test`.
