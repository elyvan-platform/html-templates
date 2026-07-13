# Vértice Training Club

Template HTML multipágina para um ginásio contemporâneo com musculação, treino funcional, aulas de grupo, personal training, mobilidade, recuperação e comunidade.

## Páginas

- `index.html`
- `memberships.html`
- `classes.html`
- `class-detail.html`
- `schedule.html`
- `trainers.html`
- `trainer-detail.html`
- `personal-training.html`
- `facilities.html`
- `trial.html`
- `journal.html`
- `journal-detail.html`
- `about.html`
- `contact.html`

## Estrutura

```text
src/vertice-training-club/
├── index.html
├── memberships.html
├── classes.html
├── class-detail.html
├── schedule.html
├── trainers.html
├── trainer-detail.html
├── personal-training.html
├── facilities.html
├── trial.html
├── journal.html
├── journal-detail.html
├── about.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── responsive.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── README.md
```

## Como executar

Abra qualquer ficheiro HTML diretamente no browser. Não existe build, bundler nem dependências obrigatórias.

## Como alterar as cores

Edite `assets/css/tokens.css`.

Tokens principais:

- `--color-black`
- `--color-charcoal`
- `--color-navy`
- `--color-soft`
- `--color-accent`
- `--color-accent-dark`
- `--color-text`
- `--color-muted`

## Como alterar o logótipo

O símbolo SVG inline e a versão textual estão repetidos nos headers e footers.

Para adaptar:

1. Substitua o texto `VÉRTICE TRAINING CLUB`
2. Ajuste a tagline `Treina com direção`
3. Troque o SVG inline pelo novo símbolo

## Como alterar a tipografia

As fontes são carregadas no `<head>` de cada página.

Para mudar:

1. Troque os links do Google Fonts
2. Atualize `--font-display` e `--font-body` em `assets/css/tokens.css`

## Como substituir imagens

As imagens são remotas e estão distribuídas pelo HTML e pelos dados do JavaScript.

Procure por:

- `images.unsplash.com`

Ao trocar:

1. Mantenha `width`, `height` e `alt`
2. Preserve coerência visual entre páginas
3. Use `loading="lazy"` para imagens não críticas

## Como editar aulas

As aulas estão no array `siteData.classes` em `assets/js/main.js`.

Cada item inclui:

- `id`
- `name`
- `category`
- `level`
- `intensity`
- `duration`
- `period`
- `capacity`
- `spots`
- `trainer`
- `recommended`
- `format`
- `equipment`
- `description`
- `image`
- `nextTimes`

## Como editar horários

Os horários estão no array `siteData.schedule`.

Campos:

- `day`
- `short`
- `date`
- `time`
- `classId`
- `trainer`
- `room`
- `spots`

O render do horário e a reserva simulada dependem desses dados.

## Como editar treinadores

Os treinadores estão em `siteData.trainers`.

Campos principais:

- `id`
- `name`
- `specialty`
- `tags`
- `education`
- `experience`
- `philosophy`
- `image`
- `bio`
- `availability`

## Como editar planos

Os planos e periodicidades estão em `siteData.memberships`.

Estrutura:

- `monthly`
- `quarterly`
- `yearly`

Cada periodicidade contém:

- `label`
- `plans.base`
- `plans.performance`
- `plans.total`

## Como alterar preços

Edite os campos:

- `price`
- `total`
- `savings`
- `terms`

em cada plano dentro de `siteData.memberships`.

## Como configurar periodicidades

Os botões usam `data-price-toggle` em `memberships.html`.
O JavaScript lê esses valores em `initMembershipPricing()`.

## Como editar instalações

As áreas do mapa estão em `siteData.facilities`.

Campos:

- `id`
- `name`
- `description`
- `equipment`
- `capacity`
- `image`

O SVG do mapa em `facilities.html` usa `data-area` com o mesmo `id`.

## Como configurar sessões experimentais

As experiências do fluxo estão em `siteData.trialExperiences`.

Campos:

- `id`
- `name`
- `duration`
- `price`
- `requirements`

## Como funciona o sessionStorage

O fluxo experimental guarda dados temporários na chave:

- `verticeTrialFlow`

São preservados:

- passo atual
- objetivo
- experiência
- data
- hora
- nome
- email
- telefone

## Como reutilizar blocos

Classes principais:

- `.site-header`
- `.mobile-nav`
- `.athletic-hero`
- `.section-heading`
- `.class-card`
- `.trainer-card`
- `.membership-plan`
- `.pricing-toggle`
- `.schedule-panel`
- `.session-selector`
- `.facility-map`
- `.trial-flow`
- `.trial-summary`
- `.journal-card`
- `.faq-item`
- `.form-panel`
- `.cta-panel`
- `.site-footer`

## Funcionalidades JavaScript

Em `assets/js/main.js`:

- menu mobile
- header com estado de scroll
- marcação da página ativa
- toggle de preços e periodicidades
- render e filtros de aulas
- render e filtros do horário
- reserva simulada de aulas
- render e filtros de treinadores
- mapa interativo das instalações
- seletor de sessões
- fluxo experimental multi-etapa
- resumo dinâmico da marcação
- pesquisa e filtros do Journal
- accordions de FAQ
- validação de formulários
- feedback de submissão
- newsletter
- reveal animations com respeito por `prefers-reduced-motion`

## Limitações das reservas frontend

- não existe backend real
- não existe autenticação
- não existe persistência remota
- a confirmação é apenas simulada

## Notas de acessibilidade

- `skip-link`
- headings semânticos
- `aria-current` na navegação
- `aria-expanded` em menu e accordions
- `aria-live` em feedbacks
- labels nos formulários
- mapa interativo focável por teclado
- fluxo experimental com botões reais

## Notas de performance

- sem frameworks nem bibliotecas externas de UI
- JavaScript carregado com `defer`
- imagens remotas com dimensões declaradas
- lazy loading fora do hero
- animações curtas e opcionais
