# Atelier Tesoura

Template de página única para salão de cabeleireiro, em português de Portugal. Inclui apresentação de serviços, equipa, tabela de preços, formulário de pedido de marcação, contactos e horário, com navegação adaptada a dispositivos móveis.

Abra `index.html` diretamente no browser ou use a montra do projeto. Não há dependências nem passo de build.

---

## Estrutura

```
src/atelier-tesoura/
├── index.html
├── assets/
│   ├── style.css   ← cores, tipografia e layout (variáveis em :root)
│   └── main.js     ← menu móvel e validação do formulário
└── README.md
```

---

## Como personalizar

- **Nome, morada, telefone, email e horário**: secção `#contactos` em `index.html`, e o texto do logótipo no `<header>`.
- **Cores e tipografia**: variáveis `:root` no início de `assets/style.css`.
- **Serviços**: cartões `.card` na secção `#servicos` e opções do `<select id="servico">`.
- **Preços**: tabela `.price-table` na secção `#precos`. Os valores são indicativos e fictícios.
- **Equipa**: cartões `.member` na secção `#equipa`. As iniciais em `.avatar` podem ser substituídas por fotografias.

Todos os dados são exemplos fictícios e devem ser substituídos antes da publicação.

---

## Formulário de marcação

O formulário valida nome, contacto (telefone ou email) e serviço no browser, mas **não envia dados a lado nenhum**. Para ligar a um sistema real, substitua o bloco final do `submit` em `assets/main.js` por um `fetch` para a sua API.

---

## Acessibilidade

- Links de salto para o conteúdo, navegação com `aria-label` e menu móvel com `aria-expanded`
- Erros do formulário anunciados com `role="alert"` e foco no primeiro campo inválido
- Tabelas de preços e horário com `th scope` e legenda
- Animações de scroll desativadas com `prefers-reduced-motion`
