# Onda — Music Player

Template independente em PT-PT. Abra `index.html` diretamente ou use `npm run dev` e escolha Onda na montra. Sem dependências, fontes remotas, APIs ou backend.

Biblioteca com seis faixas e três playlists editoriais, páginas de álbum dentro da interface, pesquisa sem distinção de acentos, favoritos persistidos em localStorage (quando disponível), fila com adição, remoção e seleção de faixas. Estados vazios para pesquisa, favoritos e fila. Os dados e artistas são fictícios.

O player é uma demo: cada faixa gera um acorde suave com Web Audio, iniciado apenas após interação. Não reproduz gravações de artistas. Play/pause, anterior/seguinte, posição, volume e mute funcionam localmente. No final, a fila repete; anterior reinicia a faixa após três segundos. Sem suporte de Web Audio, a interface anuncia um erro e permite tentar novamente. Os favoritos continuam a funcionar se o armazenamento estiver indisponível, apenas durante a sessão.

Personalize os dados em `assets/main.js`, os estilos em `assets/style.css` e as capas SVG locais em `assets/`. Teclado, foco visível, labels, anúncios de estado, navegação mobile e reduced-motion incluídos.
