# Atlântico FC — HTML Template

Template multipágina profissional para clube de futebol português, criado com HTML5 semântico, CSS moderno e JavaScript vanilla. Adequado para clubes profissionais, semiprofissionais, academias e clubes regionais.

---

## Descrição

O **Atlântico FC** é um template editorial de futebol construído com foco em identidade visual forte, editorial desportivo e experiência de utilizador de alta qualidade. Não usa frameworks nem dependências de build — funciona diretamente no browser.

**Conceito:** Clube fictício fundado em 1937, sediado numa cidade costeira do norte de Portugal. Identidade marítima, azul-marinho, coral.

---

## Páginas Incluídas

| Ficheiro | Descrição |
|---|---|
| `index.html` | Homepage — hero de dia de jogo, resultados, notícias, plantel, classificação, história, academia, sócios, newsletter |
| `matches.html` | Calendário completo com filtros, resultados e classificação lateral |
| `match-detail.html` | Detalhe de jogo — antevisão, formação, jogadores em foco, h2h, bilhetes |
| `squad.html` | Plantel completo com filtros por posição e equipa técnica |
| `player-detail.html` | Perfil de jogador — estatísticas, biografia, últimos jogos, navegação |
| `news.html` | Lista de notícias com filtros por categoria e pesquisa frontend |
| `news-detail.html` | Artigo completo com sidebar, partilha, tags e navegação entre artigos |
| `club.html` | História, timeline, palmarés, estádio, setores e identidade do clube |
| `academy.html` | Academia — escalões, filosofia, formulário de candidatura |
| `tickets.html` | Bilhetes com mapa SVG interativo do estádio, seleção de setor e FAQ |
| `membership.html` | Sócios — 5 modalidades, formulário de adesão, testemunho, FAQ |
| `contact.html` | Contactos por departamento, formulário e informações de transporte |

---

## Estrutura de Pastas

```
src/atlantico-fc/
├── index.html
├── matches.html
├── match-detail.html
├── squad.html
├── player-detail.html
├── news.html
├── news-detail.html
├── club.html
├── academy.html
├── tickets.html
├── membership.html
├── contact.html
├── README.md
└── assets/
    ├── css/
    │   ├── reset.css        — Reset CSS moderno
    │   ├── tokens.css       — Design tokens (todas as variáveis CSS)
    │   ├── base.css         — Estilos base de HTML e utilitários
    │   ├── components.css   — Todos os componentes reutilizáveis
    │   ├── pages.css        — Estilos específicos de cada página
    │   └── responsive.css   — Media queries e breakpoints
    ├── js/
    │   └── main.js          — JavaScript vanilla, sem dependências
    └── images/
        └── (adicionar imagens locais aqui)
```

---

## Como Executar

Abra qualquer ficheiro `.html` diretamente no browser. Não é necessário servidor ou build.

Para desenvolvimento, recomenda-se um servidor local simples:

```bash
# Python
python -m http.server 3000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:3000
```

---

## Personalização

### Alterar as Cores do Clube

Edite as variáveis em `assets/css/tokens.css`:

```css
:root {
  --color-navy:   #091525;   /* Azul-marinho principal */
  --color-ocean:  #1a4b8c;   /* Azul oceano secundário */
  --color-accent: #e63946;   /* Cor de destaque (coral/vermelho) */
  --color-white:  #ffffff;   /* Branco */
}
```

### Alterar o Emblema

O emblema é um SVG inline repetido em todas as páginas. Para substituir:

1. Crie o seu SVG (recomendado: `viewBox="0 0 48 58"`)
2. Encontre todas as ocorrências com `<svg viewBox="0 0 48 58"` nos ficheiros HTML
3. Substitua o conteúdo SVG pelo seu emblema
4. Mantenha a classe `emblem-svg` e o atributo `aria-hidden="true"`

Para uma manutenção mais fácil, considere extrair o emblema para um componente ou usar `<symbol>` + `<use>`.

### Alterar a Tipografia

Em `assets/css/tokens.css`:

```css
--font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
--font-body:    'Inter', 'Segoe UI', system-ui, sans-serif;
```

Nos ficheiros HTML, atualize o link de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte..." rel="stylesheet">
```

### Substituir Imagens

Todas as imagens usam URLs do Unsplash com os atributos corretos (`alt`, `width`, `height`, `loading`). Para substituir:

1. Adicione os seus ficheiros em `assets/images/`
2. Substitua os `src` das imagens pelo caminho relativo, ex: `assets/images/hero.jpg`
3. Mantenha os atributos `alt`, `width`, `height` e `loading`

### Editar Jogos e Resultados

Os dados de jogos estão em HTML puro em `matches.html` e `index.html`. Para editar:

- Localize os elementos com classe `.fixture-item`
- Atualize datas, equipas, resultados e a `data-match-filter` (valores: `casa liga`, `fora liga`, `casa taca`, `fora taca`)
- Para filtros funcionarem, os valores em `data-match-filter` devem corresponder aos `data-filter` dos botões

### Editar a Classificação

Em `matches.html` e `index.html`, localize a tabela `.standings-table` ou os elementos `.sidebar-standings-row` e edite diretamente os valores de posição, pontos e diferença de golos.

### Adicionar Jogadores

Em `squad.html`:

1. Copie o bloco `.player-card` de um jogador existente
2. Atualize número, nome, posição, nacionalidade, idade e imagem
3. Defina `data-position` como `gr`, `def`, `med` ou `av` para os filtros funcionarem

### Adicionar Notícias

Em `news.html`:

1. Copie o bloco `.news-card` de uma notícia existente
2. Atualize `data-news-title`, `data-news-category` e `data-news-excerpt` para a pesquisa funcionar
3. Atualize categoria, título, data e imagem

### Configurar os Setores do Estádio

Em `tickets.html`, o objeto `sectorData` em `assets/js/main.js` define os dados de cada setor:

```js
var sectorData = {
  'bancada-mar': { name: 'Bancada Mar', price: '20', available: 1840, desc: '...' },
  // ...
};
```

Para marcar um setor como esgotado, adicione-o ao objeto `soldOut`:

```js
var soldOut = { 'topo-sul': true };
```

### Alterar Modalidades de Sócio

Em `membership.html`, edite os blocos `.membership-plan`. Cada plano contém:
- `.membership-plan__name` — nome da modalidade
- `.membership-plan__amount` — preço
- `.membership-plan__period` — período (ex: "/ ano")
- `.membership-plan__feature` — benefícios (lista)

---

## Funcionalidades JavaScript

Todas as funções estão em `assets/js/main.js`, organizadas por responsabilidade:

| Função | Descrição |
|---|---|
| `initMobileNavigation()` | Abre/fecha menu mobile com acessibilidade |
| `initHeaderScroll()` | Altera visual do header ao fazer scroll |
| `initMatchFilters()` | Filtra jogos por tipo (casa, fora, competição) |
| `initSquadFilters()` | Filtra plantel por posição |
| `initNewsSearch()` | Pesquisa de notícias em tempo real (frontend) |
| `initNewsFilters()` | Filtra notícias por categoria |
| `initTicketSelector()` | Seleciona setor no mapa e atualiza preços |
| `initAccordions()` | FAQ accordion com acessibilidade |
| `initForms()` | Validação e feedback de submissão em todos os formulários |
| `initNewsletter()` | Validação e feedback do formulário de newsletter |
| `initRevealAnimations()` | Scroll reveal com IntersectionObserver |
| `initLangSelector()` | Seletor de idioma PT/EN |
| `markActivePage()` | Marca a página ativa na navegação |

---

## Limitações dos Formulários Frontend

Os formulários incluem **validação e feedback visual** mas **não enviam dados para nenhum servidor**. Para integração com backend:

- Substitua o `action="#"` pelo endpoint correto
- Remova o `e.preventDefault()` em `initForms()` (ou mantenha e use `fetch`/`XMLHttpRequest`)
- O botão "Comprar Bilhetes" no mapa é uma simulação visual sem processamento de pagamento

---

## Notas de Acessibilidade

- Todas as páginas têm `skip link` para o conteúdo principal
- Hierarquia de headings correta em todas as páginas (`h1` único por página)
- `aria-current="page"` aplicado à página ativa na navegação
- `aria-expanded` nos menus e accordions
- `aria-label` em botões sem texto visível
- Tabelas com `<caption>` e `<th scope>`
- Formulários com `<label>` associado a todos os campos
- Mensagens de erro programaticamente associadas
- Focus visível em todos os elementos interativos
- Animações respeitam `prefers-reduced-motion`

---

## Notas de Performance

- Fontes carregadas com `rel="preconnect"` e `display=swap`
- Imagens com `loading="lazy"` exceto na imagem principal do hero
- JavaScript com `defer`
- CSS organizado em 6 ficheiros para cache eficiente
- Sem dependências externas de JavaScript
- Sem JavaScript inline
- Imagens com `width` e `height` para evitar layout shift

---

## Conversão para Astro ou React

O template foi construído com modularidade em mente:

- Cada componente CSS tem classe clara e reutilizável (`.news-card`, `.player-card`, etc.)
- O header e footer são idênticos em todas as páginas → fáceis de extrair como layout
- Os dados fictícios podem ser migrados para um CMS (Contentful, Sanity, etc.)
- O JavaScript está organizado em funções independentes → fácil de portar para hooks React

---

## Créditos

Template criado para montra comercial de templates premium. Dados, nomes de clubes, jogadores e competições são inteiramente fictícios. Imagens de demonstração via [Unsplash](https://unsplash.com).

---

© 2025 Atlântico FC Template — Uso comercial permitido com licença de template.
