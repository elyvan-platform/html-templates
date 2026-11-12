# Maison Albor

Template multipágina para uma loja de design e decoração com experiência de compra premium. Estilo editorial: grelha assimétrica, fotografia grande, branco quente e preto, com tipografia Bodoni Moda e Hanken Grotesk.

Abra `index.html` no navegador ou utilize a montra do projeto. Não há build, bundler nem dependências obrigatórias.

## Páginas incluídas

- `index.html`: página inicial com categorias, peça da semana, novidades e subscrição
- `catalogo.html`: pesquisa, filtros por categoria e preço, ordenação e estados vazios
- `produto.html?id=candeeiro-arco-lumen`: galeria, variantes, quantidade, favoritos, detalhes e peças relacionadas; um id inexistente mostra o estado de erro
- `favoritos.html`: peças guardadas, com estado vazio
- `carrinho.html`: quantidades, remoção, código promocional simulado, envio e totais

## Estrutura de pastas

```text
src/maison-albor/
├── index.html
├── catalogo.html
├── produto.html
├── favoritos.html
├── carrinho.html
├── assets/
│   ├── style.css
│   └── main.js
└── README.md
```

## Como alterar o catálogo

Os dados estão em `assets/main.js`:

- `categories`: categorias, texto de apoio e imagem de cada tile
- `products`: peças, com `price`, `stock`, `compareAt` (preço anterior), `createdAt` (usado em Novidades), `featured` (peça da semana) e `options`
- `PHOTOS`: identificadores das fotografias, usados em `photo()` e `shot()`

Cada `option` é um grupo de variantes (por exemplo, acabamento ou medida). Os `delta` somam-se ao preço base. Um `swatch` mostra uma bola de cor em vez do texto.

## Como funciona o carrinho e os favoritos

Tudo é simulado no browser. O estado é guardado em `localStorage` com as chaves:

- `maison-albor-cart`
- `maison-albor-favorites`
- `maison-albor-promo`

Códigos promocionais aceites: `ALBOR10` (10% de desconto). O envio é gratuito a partir de 150 €; abaixo disso, 6,90 €. O IVA (23%) é apresentado como incluído nos preços.

O botão "Finalizar compra" apenas mostra uma nota de demonstração. Não há pagamento, pedido nem envio de emails.

## Como alterar cores e tipografia

Os tokens estão no início de `assets/style.css` (`--paper`, `--ink`, `--muted`, `--accent`, `--font-display`, `--font-body`). Os tipos de letra são carregados do Google Fonts no `<head>` de `index.html`; as restantes páginas usam o mesmo ficheiro de estilos, por isso os tipos de letra devem ser mantidos em sincronia nas quatro páginas HTML.

## Imagens

As fotografias são remotas, do Unsplash, e estão em `PHOTOS` (em `assets/main.js`) e nos atributos `src` das imagens fixas (em `index.html`, `produto.html` e restantes páginas). Para trocar, substitua os identificadores e mantenha `alt` e as dimensões.

## Notas

- A demonstração requer JavaScript para renderizar o catálogo, a galeria e o carrinho.
- Os nomes, preços, morada e contactos são fictícios e devem ser substituídos antes de publicar.
- Acessibilidade: skip link, navegação com `aria-current`, grupos de variantes com `fieldset` e `legend`, mensagens com `role="status"`, foco visível e respeito por `prefers-reduced-motion`.
