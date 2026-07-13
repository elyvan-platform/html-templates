# Lume Hair Studio — Template HTML

Template multipágina para salão de cabeleireiro contemporâneo. Desenvolvido com HTML5 semântico, CSS moderno e JavaScript vanilla. Nenhuma dependência de build ou framework necessária.

---

## Páginas incluídas

| Ficheiro | Descrição |
|---|---|
| `index.html` | Homepage com hero editorial, serviços, antes/depois, equipa, galeria, testemunhos, produtos e marcação rápida |
| `services.html` | Lista completa de serviços com preços e filtros por categoria |
| `service-detail.html` | Detalhe de serviço (exemplo: Balayage personalizada) com FAQ, processo e preços |
| `team.html` | Equipa com filtros por especialidade e perfis detalhados |
| `stylist-detail.html` | Perfil individual de profissional (exemplo: Leonor Silva) |
| `gallery.html` | Galeria de trabalhos com filtros e lightbox |
| `booking.html` | Fluxo de marcação em 5 etapas com resumo dinâmico |
| `bridal.html` | Serviços para noivas com pacotes e formulário de proposta |
| `journal.html` | Área editorial com 10 artigos, pesquisa e filtros |
| `journal-detail.html` | Artigo individual com corpo editorial e artigos relacionados |
| `about.html` | História, valores, equipa, sustentabilidade e espaço |
| `contact.html` | Morada, horários, mapa, formulário e políticas |

---

## Estrutura de pastas

```
src/lume-hair-studio/
├── index.html
├── services.html
├── service-detail.html
├── team.html
├── stylist-detail.html
├── gallery.html
├── booking.html
├── bridal.html
├── journal.html
├── journal-detail.html
├── about.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── reset.css         ← reset moderno
│   │   ├── tokens.css        ← design tokens (cores, espaços, tipografia)
│   │   ├── base.css          ← tipografia global, containers, utilitários
│   │   ├── components.css    ← todos os componentes reutilizáveis
│   │   ├── pages.css         ← estilos específicos de cada página
│   │   └── responsive.css    ← breakpoints (1024px, 768px, 480px)
│   ├── js/
│   │   └── main.js           ← toda a lógica JavaScript
│   └── images/               ← pasta para imagens locais (opcional)
└── README.md
```

---

## Como executar

Abra qualquer ficheiro `.html` diretamente no browser. Não é necessário servidor, build ou instalação.

Para uma experiência melhor durante o desenvolvimento:

```bash
# Com Python (versão 3)
cd src/lume-hair-studio
python -m http.server 8080

# Com Node.js
npx serve src/lume-hair-studio
```

---

## Como alterar as cores

Abra `assets/css/tokens.css` e modifique as variáveis na secção `/* ─── Cores ─────── */`:

```css
:root {
  --color-bg:      #FAF8F4;   /* fundo principal */
  --color-surface: #F3EDE5;   /* fundos de secção */
  --color-accent:  #8C3727;   /* cor de destaque (terracota) */
  --color-text:    #1A1410;   /* texto principal */
  /* ... */
}
```

Para mudar o tema para barbearia, por exemplo, experimente:
- `--color-accent: #1A3A5C` (azul escuro) ou `#2D4A1E` (verde)
- `--color-surface: #F0EDE8` (mais quente) ou `#F4F4F4` (mais neutro)

---

## Como alterar o logótipo

O logótipo é um SVG inline no header. Substitua o `<svg class="header-logo-symbol">` em cada página HTML pelo seu logótipo SVG, ou adicione uma `<img>` com o ficheiro de logo:

```html
<!-- Substituir SVG inline por imagem -->
<a href="index.html" class="header-logo">
  <img src="assets/images/logo.svg" alt="Nome do Salão" width="120" height="40">
</a>
```

O texto "Lume" e "Hair Studio" estão na `<div class="header-logo-text">`.

---

## Como alterar a tipografia

Em `assets/css/base.css`, modifique o `@import` do Google Fonts e as variáveis em `tokens.css`:

```css
/* base.css — alterar o @import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');

/* tokens.css — alterar as variáveis */
:root {
  --font-display: 'Playfair Display', serif;
  --font-body:    'Inter', sans-serif;
}
```

---

## Como substituir imagens

Todas as imagens são Unsplash URLs públicas. Para substituir:

1. Coloque os seus ficheiros em `assets/images/`
2. Substitua os atributos `src` nos ficheiros HTML
3. Mantenha sempre `alt`, `width` e `height` corretos
4. Use `loading="lazy"` em imagens não críticas; a imagem do hero principal **não deve** ter lazy loading

```html
<!-- Antes -->
<img src="https://images.unsplash.com/photo-...?w=1200" alt="...">

<!-- Depois -->
<img src="assets/images/hero-salon.jpg" alt="Interior do salão" width="1600" height="900">
```

---

## Como editar serviços

Os serviços estão definidos em `services.html` como `.service-row` dentro de `.service-section-block`. Cada serviço tem:

```html
<article class="service-row" data-service-category="corte">
  <div class="service-row__left">
    <h3 class="service-row__name">Corte e finalização</h3>
    <p class="service-row__desc">Descrição do serviço</p>
  </div>
  <div class="service-row__meta">
    <span class="service-row__price">35 €</span>
    <span class="service-row__duration">45 min</span>
  </div>
</article>
```

O atributo `data-service-category` deve corresponder ao `data-filter` nos botões de filtro.

---

## Como editar preços

Os preços aparecem em três locais:
1. `services.html` — lista completa de preços
2. `service-detail.html` — tabela de preços por complexidade
3. `index.html` — preços indicativos nas cards de serviço

Mantenha os valores consistentes entre páginas. Use "desde X €" quando o preço varia com comprimento ou densidade.

---

## Como editar profissionais

Os dados dos profissionais estão em:
- `team.html` — perfis completos com bio
- `stylist-detail.html` — página individual de profissional
- `index.html` — cards na secção de equipa
- `booking.html` — opções de seleção de profissional

Para adicionar um profissional:
1. Adicione um `team-feature` em `team.html`
2. Crie uma cópia de `stylist-detail.html` com os seus dados
3. Adicione-o às opções de marcação em `booking.html` como `<div class="booking-option" data-type="stylist" data-value="nome">`
4. Atualize as ligações "profissional anterior / seguinte" em `stylist-detail.html`

---

## Como editar horários

Os horários aparecem em:
- `index.html` — na secção de informação prática e no footer
- `contact.html` — na tabela `.schedule-table`
- Todos os footers — versão resumida

Procure "Seg–Sex: 9h–20h" para encontrar todas as ocorrências.

---

## Como editar transformações (antes/depois)

Em `index.html`, a secção `.before-after-section` contém quatro `.before-after` widgets. Cada um usa:

```html
<div class="before-after">
  <div class="before-after__images">
    <div class="before-after__before">
      <img src="URL_ANTES" alt="Antes — descrição">
    </div>
    <div class="before-after__after">
      <img src="URL_DEPOIS" alt="Depois — descrição">
    </div>
    <!-- divider e handle são posicionados por JS -->
  </div>
</div>
<div class="before-after__info">
  <p class="before-after__service">Nome do serviço</p>
  <p class="before-after__stylist">por Profissional · duração</p>
</div>
```

---

## Como editar pacotes de noiva

Em `bridal.html`, os pacotes estão em `.bridal-package` dentro de `.bridal-packages-grid`. Para o pacote em destaque, adicione a classe `bridal-package--featured` e inclua `<div class="bridal-package__tag">Mais escolhido</div>`.

---

## Como editar artigos do Journal

Os artigos estão em `journal.html` como `.journal-card`. Cada card tem atributos de dados usados pela pesquisa e filtros JavaScript:

```html
<article class="journal-card"
  data-category="coloracao"
  data-title="Título do artigo"
  data-excerpt="Resumo do artigo para pesquisa">
```

Para criar uma nova página de artigo, duplique `journal-detail.html` e edite o conteúdo.

---

## Como funciona a marcação

O fluxo de marcação em `booking.html` funciona inteiramente no frontend:

1. O utilizador seleciona serviço, profissional, data, hora e preenche dados pessoais
2. As seleções são guardadas em `sessionStorage` com a chave `lume_booking_draft`
3. O resumo lateral atualiza-se em tempo real
4. A submissão simula um pedido (timeout de 900ms) e mostra mensagem de confirmação
5. O sessionStorage é limpo após submissão bem-sucedida

**Não existe backend.** Para integrar com um sistema real, substitua a função `simulateSubmit` em `main.js` por uma chamada `fetch` à sua API.

---

## Como funciona o sessionStorage

O estado da marcação é preservado entre recargas da página com a chave `lume_booking_draft`. Estrutura:

```json
{
  "step": 3,
  "service": "balayage",
  "serviceLabel": "Balayage",
  "price": "desde 95 €",
  "duration": "3–4 h",
  "stylist": "leonor",
  "stylistLabel": "Leonor Silva",
  "selectedDate": "15 de Janeiro de 2025",
  "time": "10:30"
}
```

---

## Como reutilizar blocos

Os componentes CSS estão definidos em `components.css` com classes semânticas. Para reutilizar num novo projeto:

```html
<!-- Card de serviço -->
<article class="service-card">
  <div class="service-card__image"><img src="..." alt="..."></div>
  <div class="service-card__body">
    <span class="service-card__category">Corte</span>
    <h3 class="service-card__title">Nome do serviço</h3>
    <p class="service-card__desc">Descrição</p>
    <div class="service-card__footer">
      <span class="service-card__price"><small>desde</small> 35 €</span>
      <a href="..." class="btn btn--primary btn--sm">Marcar</a>
    </div>
  </div>
</article>
```

Componentes disponíveis: `.btn`, `.stylist-card`, `.testimonial-card`, `.journal-card`, `.bridal-package`, `.before-after`, `.faq-item`, `.gallery-item`, `.booking-option`, `.service-row`, `.process-step`, `.newsletter-form`, `.form-group`.

---

## Funcionalidades JavaScript

Todas em `assets/js/main.js`:

| Função | Descrição |
|---|---|
| `initMobileNavigation()` | Menu hamburguer, fechar com Escape |
| `initHeaderScroll()` | Blur e sombra no header ao fazer scroll |
| `initServiceFilters()` | Filtros de categoria em services.html |
| `initTeamFilters()` | Filtros de especialidade em team.html |
| `initGallery()` | Filtros + lightbox com navegação e foco |
| `initBeforeAfter()` | Slider antes/depois com drag, touch e teclado |
| `initBookingFlow()` | Fluxo de 5 etapas com validação e sessionStorage |
| `initCalendar()` | Calendário visual em booking.html |
| `initJournalSearch()` | Pesquisa e filtros de categoria em journal.html |
| `initAccordions()` | FAQ accordion com aria-expanded |
| `initForms()` | Validação de formulários e feedback de submissão |
| `initNewsletter()` | Submissão da newsletter |
| `initRevealAnimations()` | IntersectionObserver para animações de entrada |
| `initStatsCounter()` | Contador animado nos stat blocks |
| `markCurrentPage()` | Marca o link ativo via aria-current |

---

## Limitações dos formulários frontend

- **Nenhum formulário envia dados reais.** Todos simulam submissão com um timeout.
- Para integração real, substitua `simulateSubmit()` por chamadas `fetch` à sua API.
- O formulário de noivas, contacto e newsletter seguem o mesmo padrão.
- A marcação usa `sessionStorage` — os dados são perdidos ao fechar o browser.

---

## Notas de acessibilidade

- Todos os formulários têm `<label>` associado ao campo correspondente
- Erros de validação são anunciados via `role="alert"`
- A lightbox tem `role="dialog"` e `aria-modal="true"`; o foco é preso enquanto está aberta
- O slider antes/depois tem suporte de teclado (setas esquerda/direita)
- O menu mobile fecha com a tecla Escape e devolve o foco ao botão de toggle
- Animações de entrada são desativadas automaticamente com `prefers-reduced-motion: reduce`
- Todos os links de navegação têm `aria-current="page"` na página ativa
- `aria-expanded` é atualizado corretamente no menu mobile e nos accordions

---

## Notas de performance

- Imagens fora do viewport usam `loading="lazy"`
- A imagem do hero principal não usa lazy loading
- O JavaScript é carregado com `defer`
- Fontes do Google Fonts com `display=swap`
- As animações usam `IntersectionObserver` (não scroll events)
- Sem dependências externas — zero requests de bibliotecas adicionais

---

## Converter para Astro ou React

Este template foi estruturado para facilitar a conversão:

1. **Componentes identificados**: cada bloco CSS tem uma classe semântica clara (`.stylist-card`, `.journal-card`, etc.)
2. **Dados fictícios isolados**: serviços, preços e profissionais estão sempre em HTML — fáceis de extrair para ficheiros JSON ou CMS
3. **JavaScript modular**: cada função é independente e pode ser portada para hooks React ou scripts Astro
4. **CSS sem dependências**: os 6 ficheiros CSS funcionam como CSS modules ou global CSS em qualquer framework

---

*Template desenvolvido com HTML5, CSS moderno e JavaScript vanilla. Sem dependências.*
