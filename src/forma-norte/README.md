# Template Premium — Forma Norte (Arquitetura, Construção e Remodelação)

Este é um template multipágina premium, contemporâneo e responsivo, concebido para empresas do setor de arquitetura de luxo, construção de moradias personalizadas de gama alta e remodelações de grande escala. 

Desenvolvido com foco na estética editorial (inspirada em revistas físicas de design e arquitetura), o template privilegia linhas finas estruturais, layouts assimétricos, tipografia serifa refinada e transições fluidas.

---

## Estrutura do Projeto

O projeto segue uma arquitetura modular estritamente estática, sem necessidade de compiladores ou servidores adicionais:

```text
forma-norte/
├── index.html               # Página Inicial (Apresentação Editorial)
├── services.html            # Nossos Serviços (Foco em Entregáveis e Clientes)
├── service-detail.html      # Detalhe do Serviço (Exemplo: Construção de Moradias)
├── projects.html            # Portfólio Geral (Filtro Dinâmico em JS)
├── project-detail.html      # Caso de Estudo Detalhado (Exemplo: Casa do Vale)
├── about.html               # O Atelier, Filosofia e Apresentação da Equipa
├── contact.html             # Formulário de Contacto Validado & Mapa Localizado
├── assets/
│   ├── css/
│   │   ├── reset.css        # Normalização e Reset Moderno de Elementos
│   │   ├── tokens.css       # Variáveis CSS (Cores, Fontes, Margens Fluidas)
│   │   ├── base.css         # Estilização Padrão das Tags Semânticas
│   │   ├── components.css   # Blocos Reutilizáveis (Header, Footer, FAQ, etc.)
│   │   ├── pages.css        # Layouts Específicos das Secções das Páginas
│   │   └── responsive.css   # Ajustes Finos de Responsividade e Touch
│   └── js/
│       └── main.js          # Scripts e Lógicas Vanilla JavaScript
└── README.md                # Este Ficheiro de Instruções
```

---

## Como Executar

Para visualizar o template, basta extrair a pasta e abrir qualquer um dos ficheiros HTML no seu navegador web preferido (ex: Chrome, Safari, Firefox). O template funciona localmente através do protocolo `file://` sem necessidade de correr um servidor local (como Node.js, PHP ou Apache).

---

## Como Customizar o Design System

### 1. Alterar Cores e Temas
Todas as cores do website estão centralizadas sob variáveis CSS no ficheiro [tokens.css](file:///home/fabio7maia/Projects/elyvan/html-templates/assets/css/tokens.css). Pode alterar as cores principais alterando os valores hexadecimais:

* **Cor de Fundo Areia (Clara)**: Modifique `--color-bg-primary: #F5F2EB;`
* **Cor de Fundo Carbono (Escura)**: Modifique `--color-bg-dark: #141414;`
* **Cor de Acento (Bronze)**: Modifique `--color-accent: #8C7D70;`

### 2. Alterar Tipografias
O template utiliza duas famílias tipográficas da Google Fonts carregadas via `<link>` nos cabeçalhos HTML:
* **Títulos**: *Cormorant Garamond* (Serifa elegante)
* **Texto Geral & Rótulos**: *Plus Jakarta Sans* (Sans-serif geométrica)

Se pretender substituir as fontes:
1. Adicione o novo link da Google Fonts no `<head>` dos ficheiros HTML.
2. Atualize as variáveis no [tokens.css](file:///home/fabio7maia/Projects/elyvan/html-templates/assets/css/tokens.css):
   ```css
   --font-serif: 'Nova Fonte Serifada', Georgia, serif;
   --font-sans: 'Nova Fonte Sans', sans-serif;
   ```

### 3. Substituir Imagens
As imagens utilizadas no template são carregadas remotamente através de URLs da Unsplash de alta qualidade. Para usar as suas próprias imagens:
* Aloje as suas imagens numa pasta local `/assets/images/`.
* Altere o atributo `src` correspondente nas tags `<img>` dos ficheiros HTML (ex: `<img src="assets/images/moradia-fachada.jpg" ...>`).
* **Nota Técnica**: Defina sempre os atributos `width` e `height` nas novas imagens para evitar deslocamento de layout (CLS).

---

## Como Reutilizar Blocos do Template

Os estilos foram desenhados para permitir a máxima modularidade. Pode facilmente copiar e colar qualquer um dos seguintes componentes de uma página para outra:

* **Header (`.site-header`)**: O menu é idêntico em todas as páginas. A classe `.header-dark` é adicionada opcionalmente na tag `<header>` quando o topo da página é escuro para reverter as cores de texto e logo de forma transparente.
* **Section Heading (`.section-header`)**: Um cabeçalho de grelha assimétrico reutilizável que contém um número editorial, um rótulo em maiúsculas, o título principal (H2) e um pequeno parágrafo descritivo à direita.
* **Accordion de FAQ (`.accordion`)**: Funciona com base em botões `.accordion-trigger` e divs `.accordion-content`. A expansão física e a acessibilidade ARIA são controladas pelo script no `main.js`.
* **Formulário de Contacto (`.form-container`)**: Grelha flexível com rótulos e feedback de erros. Para usar noutra página, basta copiar a estrutura HTML do `<form>` com os respetivos IDs e certificar-se de carregar o `main.js`.

---

## Como Criar uma Nova Página

1. Duplique o ficheiro `services.html` (para manter os links da folha de estilo e navegação).
2. Substitua o conteúdo do bloco `<main>` pela nova estrutura.
3. Se a nova página começar com uma secção escura (ex: um hero de grande impacto visual com imagem de fundo), adicione a classe `header-dark` à tag `<header class="site-header header-dark" ...>`.
4. Adicione o novo link na lista do menu `<nav class="nav-desktop">` e `.nav-mobile-list` em todas as páginas para manter a consistência de navegação do utilizador.

---

## Funcionalidades JavaScript Integradas

Todas as interações utilizam código vanilla e estão detalhadas em [main.js](file:///home/fabio7maia/Projects/elyvan/html-templates/assets/js/main.js):
* **Scroll Reveal (Intersection Observer)**: Elementos com a classe `.reveal-item` sobem ligeiramente e surgem de forma fluida à medida que entram no campo de visão do utilizador.
* **Header Dinâmico**: O menu ganha um fundo semi-transparente fosco e reduz a sua altura em 15% ao rolar mais do que 50px de altura para libertar área de leitura e manter contraste de cor.
* **Filtro de Portfólio**: Na página de projetos, o utilizador pode alternar entre categorias. Os projetos desnecessários são ocultados e os relevantes entram com um ligeiro efeito de escala.
* **Validação e Feedback**: O formulário do contacto valida o formato do e-mail e verifica se o número de telemóvel introduzido contém o formato padrão nacional de 9 dígitos.

---

## Notas de Acessibilidade e Performance

* **Movimento Reduzido**: O CSS e o JavaScript respeitam a propriedade do sistema operativo `@media (prefers-reduced-motion: reduce)`, desativando animações e revelando conteúdos de imediato se o utilizador necessitar de estabilidade visual.
* **Acessibilidade por Teclado (A11y)**: O menu móvel e os acordeões contêm atributos `aria-expanded` dinâmicos. Todos os links e botões possuem um estado visual outline focado muito claro e contrastante (`:focus-visible`).
* **Performance e CLS**: Todas as imagens não críticas localizadas fora do ecrã inicial contêm o atributo nativo `loading="lazy"`. Além disso, a biblioteca JavaScript executa um efeito de revelação suave (fade-in gradual) assim que a imagem termina de carregar no browser do utilizador.
