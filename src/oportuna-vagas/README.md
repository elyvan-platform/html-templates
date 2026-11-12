# Oportuna — Portal de vagas

Template de portal de emprego independente em PT-PT, sem dependências nem imagens externas. Abra `index.html` diretamente ou pela montra (`npm run dev`, entrada Emprego e carreiras).

Pesquisa por função, empresa ou competência (sem distinguir acentos), filtros por área, local e trabalho (todos, só remoto, presencial ou híbrido), ordenação por data ou salário, vagas guardadas persistidas em `oportuna-saved` e detalhe da vaga. O detalhe pode ser aberto diretamente com `?vaga=frontend-senior-porto`; identificadores desconhecidos mostram um estado de erro.

A candidatura é uma simulação: a validação (nome, email, telemóvel opcional, CV em PDF até 5 MB, motivação entre 80 e 800 caracteres e confirmação de simulação) funciona localmente, mas nada é enviado nem guardado. As candidaturas simuladas ficam apenas na sessão.

Edite `assets/data.js` para alterar as vagas; `assets/logic.js` contém a pesquisa, a validação e a formatação; `assets/style.css` contém as cores e os pontos de adaptação. Em ecrãs abaixo de 1100 px, a lista e o detalhe alternam; acima, aparecem lado a lado.

Verificação: `npm ci`, `npm test`, `npm run build`. A categoria Emprego e carreiras está em `scripts/showcase-lib.mjs`.
