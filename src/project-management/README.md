# Compasso — Gestão de projetos

Template independente em PT-PT, sem dependências ou serviços externos. Abra `index.html` diretamente ou escolha Compasso no catálogo (`npm run dev`). O projeto fictício Website Atelier tem três responsáveis e oito tarefas de exemplo, em novembro de 2026.

Crie e edite tarefas nos diálogos; altere estado por arrastamento entre colunas ou pelo seletor «Mover para», disponível também na vista lista e por teclado. Pesquisa por título/descrição e filtros de responsável, prioridade e etiqueta combinam-se nas duas vistas. O progresso considera todas as tarefas, independentemente dos filtros. A ordem dentro de cada coluna segue a criação, sem reordenação manual.

As alterações são guardadas automaticamente apenas no navegador, na chave `compasso-tasks-v1`. Se o armazenamento não estiver disponível, a aplicação funciona em memória e avisa ao guardar; dados inválidos recuperam os exemplos com aviso. Limpar essa chave repõe a demonstração. Não há integrações, autenticação ou envio de dados.

Layout adaptável, controlos nativos, foco visível, diálogo com Escape e respeito por reduced-motion. Preview SVG local e ficheiros CSS/JS na pasta assets.
