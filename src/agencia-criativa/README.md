# Agência Criativa

Template de página única para um estúdio de branding e design (fictício: "Fio Vivo"), em português de Portugal, com direção editorial experimental: tipografia oversized, contraste forte e movimento contido.

Abra `index.html` no browser ou use a montra do projeto. Sem dependências nem build.

## Estrutura

- `index.html` — hero, casos, serviços, processo, equipa, manifesto, briefing
- `assets/style.css` — variáveis em `:root`, layout responsivo
- `assets/main.js` — dados dos casos (`CASES`), filtro, detalhe em `<dialog>`, menu móvel e formulário

## Interações

- Filtro de casos por disciplina com estado vazio; detalhe com navegação anterior/seguinte (View Transitions quando suportado).
- Formulário de briefing com validação inline. Os briefings ficam em `localStorage` (chave `agencia-criativa:briefings`); **nada é enviado**. Para integrar um serviço real, substitua o bloco `localStorage.setItem` no `submit`.

## Acessibilidade

Skip link, `aria-pressed` nos filtros, diálogo nativo com devolução de foco, erros associados via `aria-describedby`, foco visível e `prefers-reduced-motion` desativa animações. Sem imagens externas: as capas são geradas em CSS.
