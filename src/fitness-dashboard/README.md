# Ritmo — Fitness Dashboard

Área pessoal fictícia em PT-PT. Abrir `index.html` diretamente ou escolher Ritmo no catálogo (`npm run dev`). Sem dependências, fontes externas, autenticação ou backend.

O período de demonstração é novembro de 2026. O seletor atualiza resumo, gráfico, objetivos e histórico: semana de 9–15, semana anterior de 2–8 e mês completo. O mês contém apenas as atividades de exemplo registadas; intervalos sem atividade mostram zero. As calorias são estimativas fictícias. O gráfico apresenta os valores em texto junto às colunas.

O plano de hoje é independente do filtro de histórico. Os quatro exercícios podem ser assinalados e repostos; concluir o plano atualiza a mensagem e a barra, sem criar atividades ou alterar métricas históricas. Tudo é mantido apenas durante a visita e reposto ao recarregar. O histórico combina filtros de período e tipo e inclui um estado vazio com recuperação.

A navegação usa âncoras locais. Inclui controlos nativos, foco visível, alternativa textual ao gráfico e respeito por `prefers-reduced-motion`. HTML, CSS e JavaScript independentes estão nesta pasta; `preview.svg` é uma ilustração local da interface para o catálogo.
