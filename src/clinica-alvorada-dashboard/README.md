# Clínica Alvorada (Medical Dashboard)

Template independente de painel de consultas e utentes, em português de Portugal. Abra `index.html` no navegador; não requer instalação nem dependências.

Inclui KPIs do dia, agenda com seleção de dia, filtros por tipo e estado, confirmação e cancelamento de marcações (com "Desfazer"), lista de utentes com pesquisa e filtro, ficha demonstrativa sem dados pessoais reais, agendamento com validação e estados vazios (dia sem marcações, fim de semana, sem resultados) e de erro (dados guardados ilegíveis ou armazenamento indisponível).

Os dados são fictícios: as marcações de cada dia são geradas de forma determinística e as alterações ficam apenas em `localStorage`; "Repor dados demonstrativos" restaura o exemplo. Não há backend, autenticação, pedidos externos nem integrações reais. Os ícones são SVG embutidos e não há imagens externas.

Cores e tokens estão em `assets/style.css`; dados de exemplo, regras de agenda e interações estão em `assets/main.js`.
