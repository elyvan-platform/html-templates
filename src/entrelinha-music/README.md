# Entrelinha — Music Player

Template independente em PT-PT, sem dependências ou pedidos externos. Abrir `index.html` diretamente ou escolher Entrelinha no catálogo (`npm run dev`). A categoria é Cultura e revistas.

Biblioteca fictícia de quatro faixas em dois álbuns, três playlists e pesquisa por título, artista ou álbum (ignora acentos e maiúsculas). Os favoritos persistem em localStorage quando disponível; os restantes controlos mantêm o estado apenas durante a visita. Os álbuns, playlists e favoritos podem ser reproduzidos como seleção. O botão + adiciona uma faixa à fila; a fila permite reproduzir, remover e limpar. Ao terminar a fila a reprodução para. Anterior volta ao início depois de três segundos; antes disso, regressa à faixa anteriormente ouvida.

Os quatro WAV mono de 24 segundos são pequenas texturas instrumentais sintetizadas originalmente para a demo, não gravações de artistas reais. Play/pause, progresso, volume e silêncio controlam áudio real no browser, iniciado pelo utilizador. Erros de carregamento/reprodução têm mensagens acessíveis. Não há serviços musicais, autenticação ou backend.

Capas e identidade criadas com CSS; preview SVG local. Navegação por teclado, labels, foco visível, estados vazios com recuperação e reduced-motion. Layout adapta-se a mobile, tablet e desktop. Sem fontes ou imagens remotas.
