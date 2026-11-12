// Dados fictícios para demonstração. Nenhum valor corresponde a serviços reais.
const SITE = {
  nome: "Pixel Porto",
  chaves: { favoritos: "pixel-porto:favoritos", nick: "pixel-porto:nick", lidas: "pixel-porto:noticias-lidas" },
};

const JOGOS = [
  { id: "sombra-do-cais", titulo: "Sombra do Cais", genero: "Aventura", plataformas: ["PC", "PS5"], avaliacao: 4.6, preco: 39.99, lancamento: 2025, destaque: true, cores: ["#7c3aed", "#22d3ee"], slogan: "Uma cidade portuária que esconde um segredo a cada maré.", descricao: "Explora um porto em ruínas, decifra cartas antigas e negoceia com contrabandistas num mundo aberto de noite." },
  { id: "torre-dos-ecos", titulo: "Torre dos Ecos", genero: "RPG", plataformas: ["PC", "Switch"], avaliacao: 4.8, preco: 34.99, lancamento: 2025, destaque: true, cores: ["#c6ff3d", "#2a6b4f"], slogan: "Cada andar da torre responde à tua última escolha.", descricao: "RPG tático por turnos com party de cinco heróis, árvore de talentos e um narrador que se lembra de tudo." },
  { id: "neon-ribeira", titulo: "Neon Ribeira", genero: "Ação", plataformas: ["PC", "PS5", "Xbox"], avaliacao: 4.2, preco: 59.99, lancamento: 2026, destaque: true, cores: ["#ff3d8b", "#3b82f6"], slogan: "Corre pelos telhados de uma Ribeira iluminada a néon.", descricao: "Ação em mundo aberto com parkour urbano, veículos e uma cidade que muda de humor ao pôr do sol." },
  { id: "ferrugem-estelar", titulo: "Ferrugem Estelar", genero: "Estratégia", plataformas: ["PC"], avaliacao: 4.3, preco: 24.99, lancamento: 2024, destaque: false, cores: ["#f59e0b", "#7f1d1d"], slogan: "Constrói uma frota com o que sobra da última guerra.", descricao: "Estratégia em tempo real com logística realista, sucata reciclável e batalhas em órbitas instáveis." },
  { id: "corrida-de-mare", titulo: "Corrida de Maré", genero: "Corridas", plataformas: ["PS5", "Xbox"], avaliacao: 4.1, preco: 29.99, lancamento: 2026, destaque: false, cores: ["#0ea5e9", "#1e3a8a"], slogan: "A pista muda com a maré e o vencedor é quem lê melhor a água.", descricao: "Corridas arcade em circuitos costeiros que emergem e desaparecem ao ritmo das marés." },
  { id: "pixel-pirata", titulo: "Pixel Pirata", genero: "Plataforma", plataformas: ["Switch", "PC"], avaliacao: 4.4, preco: 0, lancamento: 2023, destaque: false, cores: ["#f472b6", "#fbbf24"], slogan: "Saltos curtos, tesouros longos.", descricao: "Plataforma de 2D com níveis gerados à mão, cenários coloridos e uma tripulação de pixéis muito teimosa." },
  { id: "arena-vertice", titulo: "Arena Vértice", genero: "Competitivo", plataformas: ["PC", "Xbox"], avaliacao: 4.0, preco: 0, lancamento: 2026, destaque: false, cores: ["#a3e635", "#14532d"], slogan: "Equipas de cinco, mapas pequenos e tempo sem folga.", descricao: "Tiro tático competitivo com rankings sazonais, treino de mira e partidas de 20 minutos." },
  { id: "quinta-das-lanternas", titulo: "Quinta das Lanternas", genero: "Simulação", plataformas: ["PC", "Switch"], avaliacao: 4.5, preco: 14.99, lancamento: 2024, destaque: false, cores: ["#fde68a", "#92400e"], slogan: "Uma quinta pequena, um ciclo de estações e muita paciência.", descricao: "Simulação calma de gestão agrícola com animais, mercados de bairro e noites de festival." },
];

const NOTICIAS = [
  { id: "torneio-inverno", titulo: "Torneio de Inverno abre inscrições em Matosinhos", categoria: "Torneios", data: "2026-11-10", minutos: 3, cor: "#a3e635", resumo: "Oito equipas, dois dias de jogo e um prémio de 2 000 € para o vencedor da fase final.", paragrafos: ["As inscrições para o Torneio de Inverno estão abertas até 30 de novembro. Podem participar equipas de cinco jogadores com idade mínima de 16 anos.", "A fase de grupos decorre no sábado e a final no domingo, com transmissão local no auditório da comunidade e acesso gratuito para os inscritos."] },
  { id: "torre-atualizacao", titulo: "Torre dos Ecos recebe o capítulo de Outono", categoria: "Atualizações", data: "2026-11-08", minutos: 4, cor: "#c6ff3d", resumo: "Novo andar, três heróis e um modo de desafio que recompensa quem joga em silêncio.", paragrafos: ["O capítulo de Outono acrescenta o andar das Bibliotecas Submersas, três novos heróis e um modo de desafio sem música.", "Os jogadores que já tinham a torre instalada recebem o conteúdo gratuitamente no próximo arranque."] },
  { id: "sessao-retro", titulo: "Sessão retro no Cais: clássicos de 16 bits", categoria: "Eventos", data: "2026-11-06", minutos: 2, cor: "#f472b6", resumo: "Uma noite de jogos antigos, bancadas de madeira e um campeonato de Pixel Pirata.", paragrafos: ["A sessão retro acontece na sexta-feira às 19h30, com quatro ecrãs e consolas de época disponíveis para experimentar.", "Entrada livre, com limite de 40 lugares por ordem de chegada."] },
  { id: "neon-adiado", titulo: "Neon Ribeira adia o lançamento para a primavera", categoria: "Atualizações", data: "2026-11-04", minutos: 3, cor: "#ff3d8b", resumo: "O estúdio pede mais tempo para afinar o trânsito e a iluminação noturna.", paragrafos: ["O estúdio anunciou que o lançamento passa para a primavera para completar os testes de desempenho nas consolas.", "Quem reservou a edição digital mantém o preço e recebe uma cópia de teste antecipada."] },
  { id: "equipa-do-mes", titulo: "Equipa Maré Brava é a escolha do mês", categoria: "Comunidade", data: "2026-11-02", minutos: 5, cor: "#0ea5e9", resumo: "Dez vitórias seguidas na Arena Vértice e uma política de treino aberto a novos membros.", paragrafos: ["A Maré Brava somou dez vitórias seguidas e abre todas as terças-feiras sessões de treino para quem está a começar.", "Os treinos são gratuitos e ficam registados no calendário da comunidade."] },
  { id: "quinta-festival", titulo: "Festival da Quinta das Lanternas chega a Braga", categoria: "Eventos", data: "2026-10-29", minutos: 2, cor: "#fde68a", resumo: "Mercado de bairro, concurso de colheitas e uma noite de lanternas no jardim.", paragrafos: ["O festival reúne jogadores e criadores num fim de semana de colheitas, mercado e concurso de decoração.", "A participação é gratuita e não é necessária inscrição."] },
];

const JOGADORES = [
  { id: "ana-ferreira", nick: "Ana_Sombra", cidade: "Porto", bio: "Jogadora de RPG e estratégia. Prefere sessões longas com amigos e notas detalhadas sobre cada personagem.", horas: 1240, vitorias: 118, favoritos: 6, lidas: 5, pontos: { global: 9840, semanal: 1260, competitivo: 2140 } },
  { id: "tiago-rocha", nick: "TiagoRPM", cidade: "Braga", bio: "Corridas e simulações. Organiza a liga de fim de semana da comunidade do norte.", horas: 720, vitorias: 64, favoritos: 3, lidas: 4, pontos: { global: 6120, semanal: 1480, competitivo: 1190 } },
  { id: "mariana-lopes", nick: "Mari.Pixel", cidade: "Lisboa", bio: "Plataformas e jogos indie. Escreve análises curtas e gosta de encontrar joias escondidas.", horas: 430, vitorias: 22, favoritos: 4, lidas: 3, pontos: { global: 4870, semanal: 720, competitivo: 610 } },
  { id: "rui-carvalho", nick: "Rui_Vertice", cidade: "Coimbra", bio: "Competitivo de tiro tático. Treina às terças e tenta subir no ranking semanal todas as semanas.", horas: 1510, vitorias: 96, favoritos: 2, lidas: 1, pontos: { global: 8410, semanal: 1390, competitivo: 2480 } },
  { id: "beatriz-mota", nick: "Bia_Lanterna", cidade: "Faro", bio: "Simulação calma e festivais de bairro. Organiza o concurso de colheitas da comunidade algarvia.", horas: 310, vitorias: 9, favoritos: 5, lidas: 6, pontos: { global: 3150, semanal: 540, competitivo: 380 } },
  { id: "joao-pinto", nick: "JP_Neon", cidade: "Aveiro", bio: "Ação e mundo aberto. Explora cada canto das cidades e escreve guias para novos jogadores.", horas: 980, vitorias: 131, favoritos: 1, lidas: 2, pontos: { global: 7650, semanal: 1120, competitivo: 1720 } },
];

// Condições avaliadas sobre estatísticas: vitorias, horas, favoritos, lidas.
const BADGES = [
  { id: "primeira-vitoria", nome: "Primeira vitória", descricao: "Ganhar pelo menos um jogo competitivo.", condicao: (s) => s.vitorias >= 1 },
  { id: "colecionador", nome: "Colecionador", descricao: "Guardar três ou mais jogos nos favoritos.", condicao: (s) => s.favoritos >= 3 },
  { id: "leitor-atento", nome: "Leitor atento", descricao: "Ler três ou mais notícias da comunidade.", condicao: (s) => s.lidas >= 3 },
  { id: "veterano", nome: "Veterano", descricao: "Acumular 500 horas de jogo.", condicao: (s) => s.horas >= 500 },
  { id: "campeao", nome: "Campeão", descricao: "Chegar às 100 vitórias.", condicao: (s) => s.vitorias >= 100 },
];

const GENEROS = [...new Set(JOGOS.map((jogo) => jogo.genero))];
const PLATAFORMAS = [...new Set(JOGOS.flatMap((jogo) => jogo.plataformas))];
const CATEGORIAS_NOTICIAS = [...new Set(NOTICIAS.map((noticia) => noticia.categoria))];
