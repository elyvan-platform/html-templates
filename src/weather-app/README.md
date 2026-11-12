# Brisa Meteo

Template independente em PT-PT (HTML, CSS e JS simples), sem dependências nem pedidos externos. Abrir `index.html` diretamente ou usar a entrada Weather App no catálogo (`npm run dev`).

Todos os valores são um cenário fixo e fictício (12 nov. 2026, 14:00), identificado como demo. Inclui pesquisa (sem acentos) em 8 localizações, previsão para 24 horas e 7 dias, alternância °C/°F, vento, probabilidade de chuva e humidade, e favoritos que duram apenas a visita. Pesquisas sem resultados mostram um estado vazio com ação de reposição.

Dados e lógica em `assets/main.js`; visual glassmorphism e breakpoints em `assets/style.css`. Respeita reduced-motion e navegação por teclado.
