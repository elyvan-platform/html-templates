# Montra: largura responsiva

Os filhos de flex e grid podem conservar a largura mínima intrínseca do seu conteúdo. A montra permite agora que pesquisa e controlos encolham, que as barras quebrem em várias linhas e que nomes longos sem espaços quebrem dentro dos respetivos cartões e do preview. Os alvos de filtros, dispositivos e ações mantêm pelo menos 44 px de altura. O iframe continua a ser escalado à largura disponível; não se esconde o overflow do documento.

O teste `test/showcase-overflow.test.mjs` usa Chromium, quando instalado, para medir o documento e o diálogo nas larguras de 320, 360, 390, 430 e 768 px, incluindo nomes longos e os três dispositivos de preview. Também verifica pesquisa e reposição de filtros. Sem Chromium, o teste é assinalado como ignorado.

Capturas a 390 × 900 px: [antes](montra-overflow/antes-390.png) e [depois](montra-overflow/depois-390.png). Com os dados atuais a medição anterior já era 390 px de scrollWidth; os nomes longos e as restrições intrínsecas foram por isso cobertos explicitamente no teste.
