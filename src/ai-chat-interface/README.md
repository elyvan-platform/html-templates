# Lume Chat (AI Chat Interface)

Template independente de interface de chat com vários assistentes (Redator, Analista, Tutor) e modelos fictícios, em português de Portugal. Abra `index.html` no navegador; não requer instalação nem dependências.

Inclui barra lateral de conversas (criar, pesquisar, renomear e apagar com confirmação), escolha de assistente e modelo, respostas simuladas com streaming e indicação explícita **DEMO**, parar/regenerar/copiar resposta, estados vazios e de erro (escreva `/erro`), tema claro/escuro, atalhos (`Alt N`, `Alt B`, `/`, `?`, `Esc`) e layout móvel com gaveta lateral. Respeita `prefers-reduced-motion`.

Tudo fica em `localStorage`; "Repor demo" restaura o exemplo. Não há backend, autenticação nem pedidos externos. Tokens de cor em `assets/style.css`; assistentes, modelos e respostas em `assets/main.js`.
