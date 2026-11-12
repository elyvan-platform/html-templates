# Categorias da montra

Até 650 px, a lista nativa de seleção apresenta todas as áreas num único controlo; “Todas as áreas” remove o filtro. A lista oferece teclado, foco e anúncio da opção selecionada através do navegador. Em larguras maiores mantêm-se os botões existentes. Ambos os controlos partilham o mesmo estado, incluindo ao mudar o tamanho da janela ou limpar os filtros; a pesquisa continua a combinar-se com a área e o contador anuncia os resultados.

A montra estática é gerada com `node scripts/generate-showcase.mjs` depois de alterar a marcação ou os assets da montra. O teste de navegador verifica os filtros e o espaço ocupado em 320, 390 e 768 px quando Chromium está disponível.
