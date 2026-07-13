# Mercado da Vila

Template HTML multipágina para uma mercearia local portuguesa com venda física, encomendas online, cabazes, entregas locais, recolha em loja e receitas ligadas ao catálogo.

## Páginas incluídas

- `index.html`
- `shop.html`
- `product-detail.html`
- `promotions.html`
- `cart.html`
- `delivery.html`
- `recipes.html`
- `recipe-detail.html`
- `about.html`
- `contact.html`

## Estrutura de pastas

```text
src/mercado-da-vila/
├── index.html
├── shop.html
├── product-detail.html
├── promotions.html
├── cart.html
├── delivery.html
├── recipes.html
├── recipe-detail.html
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

Abra qualquer ficheiro HTML diretamente no browser.

Exemplo:

1. Navegue até `src/mercado-da-vila/`
2. Abra `index.html`

Não existe build, bundler ou dependência obrigatória.

## Como alterar as cores

Edite os tokens em `assets/css/tokens.css`.

Principais variáveis:

- `--color-leaf`
- `--color-tomato`
- `--color-mustard`
- `--color-cream`
- `--color-paper`
- `--color-wood`
- `--color-ink`

## Como alterar o logótipo

O logótipo textual e o símbolo SVG inline estão repetidos no header e footer de cada página HTML.

Para adaptar:

1. Substitua o texto `Mercado da Vila`
2. Ajuste o subtítulo `Desde 1987`
3. Troque o SVG inline se quiser um novo símbolo

## Como alterar a tipografia

As fontes são carregadas no `<head>` de cada página.

Para mudar:

1. Substitua os links do Google Fonts
2. Atualize em `assets/css/tokens.css`:
   - `--font-display`
   - `--font-body`
   - `--font-note`

## Como substituir imagens

As imagens são remotas e estão distribuídas por:

- HTML das secções estáticas
- arrays de dados em `assets/js/main.js`

Para trocar:

1. Procure `images.unsplash.com`
2. Substitua os URLs pelos novos endereços
3. Mantenha `width`, `height` e `alt`

## Como editar produtos

Os produtos estão no array `products` em `assets/js/main.js`.

Cada item inclui campos como:

- `id`
- `name`
- `category`
- `price`
- `unit`
- `origin`
- `producer`
- `image`
- `availability`
- `organic`
- `glutenFree`
- `vegetarian`
- `promo`

## Como editar preços

Os preços são centralizados no array `products`.

Ao alterar `price`, o valor é refletido em:

- homepage
- loja
- produto relacionado
- promoções
- carrinho
- detalhe de receita para produtos usados

## Como criar promoções

No array `products`, adicione ou edite o objeto `promo`.

Exemplo:

```js
promo: {
  oldPrice: 2.95,
  label: "-16%",
  validUntil: "Sábado",
  savings: "0,46 €/kg",
  stock: "Stock confortável",
}
```

## Como editar produtores

Os produtores estão no array `producers` em `assets/js/main.js`.

Pode alterar:

- nome
- localização
- distância
- especialidade
- história
- imagem

## Como editar cabazes

Os cabazes estão no array `baskets` em `assets/js/main.js`.

Campos principais:

- `name`
- `people`
- `price`
- `frequency`
- `description`
- `includes`
- `custom`
- `image`

## Como editar receitas

As receitas estão no array `recipes` em `assets/js/main.js`.

Pode ajustar:

- `name`
- `time`
- `difficulty`
- `serves`
- `tags`
- `ingredients`
- `image`
- `steps`
- `ingredientList`
- `related`

## Como configurar zonas de entrega

As zonas estão no array `deliveryZones` em `assets/js/main.js`.

Campos:

- `zone`
- `postalCodes`
- `days`
- `cost`
- `min`
- `note`

O verificador de código postal usa os prefixos definidos em `initDeliveryChecker()`.

## Como funciona o carrinho

O carrinho é inteiramente frontend.

Funcionalidades incluídas:

- adicionar produto
- atualizar quantidades
- remover produto
- mudar entre entrega e recolha
- aplicar código promocional simulado
- calcular subtotal
- calcular entrega
- calcular desconto
- calcular total

## Como funciona o localStorage

São usadas três chaves:

- `mercado-da-vila-cart`
- `mercado-da-vila-promo`
- `mercado-da-vila-delivery-mode`

Isto permite persistência entre páginas e após recarregar o browser.

## Como reutilizar blocos

O CSS foi organizado para reutilização simples com classes como:

- `site-header`
- `market-hero`
- `category-feature`
- `product-card`
- `product-price`
- `producer-feature`
- `basket-card`
- `quantity-control`
- `cart-item`
- `recipe-card`
- `delivery-checker`
- `newsletter-card`
- `site-footer`

## Funcionalidades JavaScript

Implementadas em `assets/js/main.js`:

- menu mobile
- header com estado ao fazer scroll
- pesquisa global
- pesquisa de produtos
- filtros de produtos
- ordenação de produtos
- filtros de promoções
- pesquisa de receitas
- filtros de receitas
- controlo de quantidade
- adicionar ao carrinho
- remover do carrinho
- atualizar quantidades
- cálculo de subtotal
- cálculo de total
- `localStorage`
- contador do carrinho
- código promocional simulado
- entrega vs recolha
- verificador de código postal
- adicionar ingredientes ao carrinho
- accordion de FAQ
- validação de formulários
- feedback de submissão
- animações de entrada
- respeito por `prefers-reduced-motion`

## Limitações do checkout frontend

- não existe pagamento real
- não existe backoffice
- não existe envio efetivo de emails
- a confirmação é simulada no browser

## Notas de acessibilidade

- HTML semântico
- skip link
- `aria-current` na navegação
- `aria-expanded` no menu mobile e FAQ
- labels visíveis
- mensagens com `aria-live`
- foco visível
- formulários com validação simples

## Notas de performance

- sem frameworks
- sem bibliotecas pesadas
- CSS segmentado
- script carregado com `defer`
- imagens não críticas com `loading="lazy"`
- animações reduzidas quando `prefers-reduced-motion` está ativo
