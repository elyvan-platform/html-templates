# QA de acessibilidade e ligações

Executar com Node >=20:

```sh
npm ci
npm test
# Apenas a suite de browser:
npm run test:qa
```

O `pretest` instala o Chromium headless do Playwright se faltar (download gratuito na primeira execução; pode ser preparado em cache). Em Linux sem bibliotecas de sistema, executar previamente `npx playwright install --with-deps chromium`. O workflow existente já instala o browser e as dependências antes de `npm test`. Não há testes de browser opcionais nesta suite: falta do browser ou erros provocam exit code diferente de zero. O relatório TAP identifica rota, regra axe e seletores.

## Cobertura e extensão

A versão axe 4.11 está fixada para manter compatibilidade com Node 20 e resultados reproduzíveis; a regra experimental `label-content-name-mismatch` é ativada explicitamente. A montra é auditada com Playwright + axe-core em claro, escuro, sistema e viewport móvel. O viewer e o diálogo também são auditados, excluindo o conteúdo do iframe: os templates são avaliados separadamente. Todas as violações critical/serious bloqueiam a montra; verificações de landmarks, hierarquia de headings, nomes de links/botões, labels, alt e contraste também bloqueiam independentemente da severidade. Não há exceções axe na montra.

Os fluxos usam eventos reais de teclado para pesquisa, filtro desktop/móvel, abertura, dispositivos, Escape, botão de fechar e recuperação de foco. Seletores assentam em funções e atributos estáveis; os testes não dependem de títulos ou quantidades fixas de cartões.

`test/qa/routes.mjs` seleciona restauração (Café Aurora), portfólio (Architecture Studio) e aplicação/dashboard (Admin Dashboard). Acrescentar rotas a esta lista estende os testes de axe, links e viewers. Novas rotas começam sem exceções. A lista de links da montra inclui todos os destinos do catálogo e thumbnails disponíveis; não se percorrem recursivamente todos os HTML de todos os templates. As páginas selecionadas verificam href, data-href, src, poster, todos os candidatos srcset, estilos inline e URLs/imports CSS recursivos. Os destinos locais são obtidos por HTTP; fragmentos são validados em IDs ou âncoras nomeadas do HTML de destino. Há uma fixture negativa que confirma falha para paths, anchors e assets em CSS importado inexistentes.

## Exceções existentes nos templates

O âmbito desta alteração é a montra e o tooling. `test/qa/template-baseline.json` regista sete ocorrências serious preexistentes nos templates, por rota, regra, severidade e seletor exato. Nenhuma regra inteira é desativada; qualquer ocorrência adicional bloqueia. As ocorrências continuam visíveis como diagnóstico da suite:

- Café Aurora: cinco contrastes em texto secundário e títulos com ênfase.
- Architecture Studio: nome acessível do link da marca não inclui integralmente o texto visível.
- Admin Dashboard: contraste do texto do log.

Esta baseline é dívida a corrigir no trabalho específico dos templates, não uma declaração de aprovação de acessibilidade. Ao corrigir uma ocorrência, remover a entrada correspondente. Não regenerar a baseline para aceitar uma regressão. Novas exceções exigem justificação técnica documentada e revisão dos seletores e da severidade.

## Política de ligações

Apenas o mesmo origin local é bloqueante. Não se consultam serviços externos na suite e os seus pedidos de browser são bloqueados para tornar os resultados determinísticos. URLs HTTP(S) externos, `mailto:` e `tel:` exemplificativos não são chamados nem tratados como 404; precisam de revisão humana antes de publicação. Uma indisponibilidade externa isolada não bloqueia sem confirmação do responsável. Verificar manualmente destino, domínio, endereço e número real pretendidos. Fragmentos vazios (`#`) são ações demonstrativas permitidas; fragmentos não vazios têm de existir. Diretivas de fragmento de texto (`#:~:text=`) ficam para verificação manual.

## Limites e verificações manuais

Testes automáticos não demonstram conformidade WCAG total. Rever com leitor de ecrã (NVDA/VoiceOver), ordem e visibilidade de foco, navegação completa e ausência de armadilhas no iframe, qualidade dos textos alternativos/nomes, mensagens e erros de formulários, zoom/reflow a 200–400%, contraste de estados/imagens/gradientes que axe não resolve, movimento reduzido e todos os estados interativos dos templates. Validar temas do sistema nos dois modos e conteúdo após fontes/serviços externos reais carregarem. As páginas e estados fora da lista representativa permanecem por auditar.
