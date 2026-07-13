'use strict';

const siteData = {
  memberships: {
    monthly: {
      label: 'Mensal',
      plans: {
        base: { price: 49, total: 49, savings: 'Sem fidelização.', terms: 'Cancelamento com 30 dias.' },
        performance: { price: 69, total: 69, savings: 'Inclui revisão trimestral.', terms: 'Acesso total e plano base.' },
        total: { price: 109, total: 109, savings: 'Inclui prioridade em eventos.', terms: 'Condições especiais em PT.' },
      },
    },
    quarterly: {
      label: 'Trimestral',
      plans: {
        base: { price: 46, total: 138, savings: 'Poupança indicativa de 9 € por trimestre.', terms: 'Pagamento único a cada 3 meses.' },
        performance: { price: 65, total: 195, savings: 'Poupança indicativa de 12 € por trimestre.', terms: 'Renovação trimestral.' },
        total: { price: 103, total: 309, savings: 'Poupança indicativa de 18 € por trimestre.', terms: 'Sessões de acompanhamento mantidas.' },
      },
    },
    yearly: {
      label: 'Anual',
      plans: {
        base: { price: 43, total: 516, savings: 'Poupança indicativa de 72 € por ano.', terms: 'Renovação anual, taxa de inscrição separada.' },
        performance: { price: 61, total: 732, savings: 'Poupança indicativa de 96 € por ano.', terms: 'Inclui avaliação inicial e revisão trimestral.' },
        total: { price: 97, total: 1164, savings: 'Poupança indicativa de 144 € por ano.', terms: 'Prioridade em eventos e acompanhamento mensal.' },
      },
    },
  },
  trainers: [
    {
      id: 'joao-martins',
      name: 'João Martins',
      specialty: 'Força e condicionamento',
      tags: ['forca', 'funcional', 'personal-training'],
      education: 'Formação superior em exercício e treino desportivo',
      experience: '11 anos de experiência',
      philosophy: 'Treinar bem é repetir fundamentos com intenção, medir progresso e ajustar antes de complicar.',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1200&q=80',
      bio: 'Acompanha clientes em criação de rotina, aumento de força e preparação física geral com foco em técnica, consistência e progressão sustentável.',
      availability: 'Seg. a Sex. 07:00-13:00 e 17:00-21:00',
    },
    {
      id: 'ines-rocha',
      name: 'Inês Rocha',
      specialty: 'Mobilidade e treino funcional',
      tags: ['mobilidade', 'funcional'],
      education: 'Especialização em treino funcional e mobilidade aplicada',
      experience: '8 anos de experiência',
      philosophy: 'Movimento claro primeiro. Intensidade depois.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      bio: 'Trabalha padrões de movimento, estabilidade e confiança no treino para quem começa ou regressa.',
      availability: 'Seg., Qua. e Sex. 08:00-14:00',
    },
    {
      id: 'miguel-santos',
      name: 'Miguel Santos',
      specialty: 'Personal Training',
      tags: ['personal-training', 'forca'],
      education: 'Formação em prescrição de treino e acompanhamento individual',
      experience: '9 anos de experiência',
      philosophy: 'Objetivos claros, plano simples e revisões frequentes.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
      bio: 'Coordena programas individuais e duplas para clientes com agendas exigentes e objetivos específicos.',
      availability: 'Seg. a Sáb. por marcação',
    },
    {
      id: 'carolina-lopes',
      name: 'Carolina Lopes',
      specialty: 'Cycling e cardio',
      tags: ['cycling', 'cardio'],
      education: 'Formação em aulas de ritmo, resistência e coaching de grupo',
      experience: '7 anos de experiência',
      philosophy: 'Uma aula deve dar estrutura, ritmo e vontade de voltar.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      bio: 'Conduz aulas energéticas com foco em capacidade cardiovascular, gestão de esforço e motivação consistente.',
      availability: 'Ter. e Qui. 18:00-21:30, Sáb. manhã',
    },
    {
      id: 'andre-costa',
      name: 'André Costa',
      specialty: 'Boxing Conditioning',
      tags: ['boxing', 'funcional'],
      education: 'Experiência em preparação física e técnica de condicionamento com saco e estações',
      experience: '10 anos de experiência',
      philosophy: 'Coordenação, ritmo e trabalho de corpo inteiro sem perder controlo técnico.',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80',
      bio: 'Mistura trabalho técnico acessível com blocos de potência e coordenação para grupos de vários níveis.',
      availability: 'Qua. e Sex. 18:30-21:00',
    },
  ],
  classes: [
    {
      id: 'vertice-strength',
      name: 'Vértice Strength',
      category: 'forca',
      level: 'Intermédio',
      intensity: 'high',
      duration: 45,
      period: 'evening',
      capacity: 14,
      spots: 6,
      trainer: 'joao-martins',
      recommended: 'João Martins',
      format: 'Blocos de força com barra, halteres e acessórios',
      equipment: 'Racks, barras, discos, bancos e acessórios básicos',
      description: 'Aula orientada para força geral, técnica e controlo de intensidade em blocos claros e progressivos.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Seg. 18:30', 'Qua. 19:15', 'Sex. 18:30'],
    },
    {
      id: 'metabolic',
      name: 'Metabolic',
      category: 'funcional',
      level: 'Todos os níveis',
      intensity: 'high',
      duration: 50,
      period: 'morning',
      capacity: 18,
      spots: 9,
      trainer: 'ines-rocha',
      recommended: 'Inês Rocha',
      format: 'Circuitos por tempo e estações',
      equipment: 'Kettlebells, remos, caixas e acessórios funcionais',
      description: 'Combina força, cardio e coordenação em blocos de trabalho intensos mas escaláveis.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Ter. 07:15', 'Qui. 12:30', 'Sáb. 10:00'],
    },
    {
      id: 'cycle',
      name: 'Cycle',
      category: 'cycling',
      level: 'Todos os níveis',
      intensity: 'medium',
      duration: 45,
      period: 'evening',
      capacity: 20,
      spots: 4,
      trainer: 'carolina-lopes',
      recommended: 'Carolina Lopes',
      format: 'Subidas, sprints e recuperação guiada',
      equipment: 'Bicicletas indoor e monitorização de esforço',
      description: 'Aula de cycling com estrutura musical, gestão de zonas e estímulo cardiovascular controlado.',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Seg. 19:30', 'Qui. 19:30'],
    },
    {
      id: 'mobility-flow',
      name: 'Mobility Flow',
      category: 'mobilidade',
      level: 'Todos os níveis',
      intensity: 'low',
      duration: 40,
      period: 'morning',
      capacity: 16,
      spots: 11,
      trainer: 'ines-rocha',
      recommended: 'Inês Rocha',
      format: 'Sequências de mobilidade e controlo articular',
      equipment: 'Tapetes, blocos e bandas',
      description: 'Sessão focada em amplitude útil, respiração e qualidade de movimento para complementar a semana.',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Ter. 08:15', 'Sex. 13:15', 'Dom. 10:30'],
    },
    {
      id: 'core-lab',
      name: 'Core Lab',
      category: 'iniciacao',
      level: 'Iniciação',
      intensity: 'medium',
      duration: 35,
      period: 'lunch',
      capacity: 12,
      spots: 8,
      trainer: 'miguel-santos',
      recommended: 'Miguel Santos',
      format: 'Blocos curtos de estabilidade e resistência',
      equipment: 'Tapetes, sliders e acessórios leves',
      description: 'Trabalho de estabilidade, coordenação e resistência do core adaptado a iniciantes e praticantes regulares.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Seg. 12:45', 'Qua. 12:45'],
    },
    {
      id: 'boxing-conditioning',
      name: 'Boxing Conditioning',
      category: 'boxing',
      level: 'Intermédio',
      intensity: 'high',
      duration: 50,
      period: 'evening',
      capacity: 16,
      spots: 5,
      trainer: 'andre-costa',
      recommended: 'André Costa',
      format: 'Rounds técnicos e condicionamento por blocos',
      equipment: 'Sacos, luvas de treino e acessórios',
      description: 'Condicionamento de corpo inteiro com técnica acessível de base, ritmo alto e rotação de estações.',
      image: 'https://images.unsplash.com/photo-1518611012118-fb8f2f4edd0c?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Qua. 20:00', 'Sex. 19:15'],
    },
    {
      id: 'cardio-engine',
      name: 'Cardio Engine',
      category: 'cardio',
      level: 'Todos os níveis',
      intensity: 'medium',
      duration: 45,
      period: 'morning',
      capacity: 16,
      spots: 10,
      trainer: 'carolina-lopes',
      recommended: 'Carolina Lopes',
      format: 'Intervalos simples com progressão semanal',
      equipment: 'Bicicletas, remos e passadeiras',
      description: 'Desenvolvimento da capacidade cardiorrespiratória com blocos claros e escaláveis.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Ter. 07:00', 'Qui. 07:00'],
    },
    {
      id: 'foundations',
      name: 'Foundations',
      category: 'iniciacao',
      level: 'Iniciação',
      intensity: 'low',
      duration: 50,
      period: 'afternoon',
      capacity: 10,
      spots: 3,
      trainer: 'miguel-santos',
      recommended: 'Miguel Santos',
      format: 'Aprendizagem técnica e adaptação à sala',
      equipment: 'Máquinas guiadas e acessórios básicos',
      description: 'Para quem quer começar a treinar com segurança, contexto e acompanhamento próximo.',
      image: 'https://images.unsplash.com/photo-1594737625785-cb74c36f7fd4?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Seg. 17:30', 'Qui. 17:30'],
    },
    {
      id: 'tempo-lift',
      name: 'Tempo Lift',
      category: 'forca',
      level: 'Avançado',
      intensity: 'signature',
      duration: 60,
      period: 'evening',
      capacity: 10,
      spots: 2,
      trainer: 'joao-martins',
      recommended: 'João Martins',
      format: 'Trabalho de tempo sob tensão e técnica',
      equipment: 'Racks, discos, bancos, caixas',
      description: 'Sessão para praticantes regulares que procuram mais controlo, volume útil e detalhe técnico.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Ter. 19:45', 'Sex. 20:00'],
    },
    {
      id: 'recovery-reset',
      name: 'Recovery Reset',
      category: 'mobilidade',
      level: 'Todos os níveis',
      intensity: 'low',
      duration: 30,
      period: 'lunch',
      capacity: 14,
      spots: 12,
      trainer: 'ines-rocha',
      recommended: 'Inês Rocha',
      format: 'Respiração, mobilidade e descarga',
      equipment: 'Tapetes, rolos e bandas',
      description: 'Sessão curta para aliviar tensão acumulada e melhorar a qualidade de recuperação entre treinos.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Qua. 13:10', 'Sex. 13:10'],
    },
    {
      id: 'hybrid-saturday',
      name: 'Hybrid Saturday',
      category: 'funcional',
      level: 'Todos os níveis',
      intensity: 'signature',
      duration: 60,
      period: 'morning',
      capacity: 22,
      spots: 15,
      trainer: 'andre-costa',
      recommended: 'André Costa',
      format: 'Estações, corrida curta e blocos de força',
      equipment: 'Zona funcional completa',
      description: 'Sessão de comunidade ao sábado com energia alta, ritmo coletivo e várias escalas.',
      image: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Sáb. 09:00'],
    },
    {
      id: 'express-lunch',
      name: 'Express Lunch',
      category: 'cardio',
      level: 'Todos os níveis',
      intensity: 'medium',
      duration: 30,
      period: 'lunch',
      capacity: 14,
      spots: 7,
      trainer: 'carolina-lopes',
      recommended: 'Carolina Lopes',
      format: 'Intervalos curtos para pausa de almoço',
      equipment: 'Air bikes, remos e acessórios leves',
      description: 'Treino rápido para manter consistência durante a semana sem ocupar a tarde inteira.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      nextTimes: ['Seg. a Qui. 13:00'],
    },
  ],
  schedule: [
    { day: 'Segunda', short: 'Seg.', date: '13 Jul', time: '07:00', classId: 'cardio-engine', trainer: 'carolina-lopes', room: 'Cardio', spots: 10 },
    { day: 'Segunda', short: 'Seg.', date: '13 Jul', time: '12:45', classId: 'core-lab', trainer: 'miguel-santos', room: 'Estúdio 2', spots: 8 },
    { day: 'Segunda', short: 'Seg.', date: '13 Jul', time: '18:30', classId: 'vertice-strength', trainer: 'joao-martins', room: 'Funcional', spots: 6 },
    { day: 'Segunda', short: 'Seg.', date: '13 Jul', time: '19:30', classId: 'cycle', trainer: 'carolina-lopes', room: 'Estúdio 1', spots: 4 },
    { day: 'Terça', short: 'Ter.', date: '14 Jul', time: '07:15', classId: 'metabolic', trainer: 'ines-rocha', room: 'Funcional', spots: 9 },
    { day: 'Terça', short: 'Ter.', date: '14 Jul', time: '08:15', classId: 'mobility-flow', trainer: 'ines-rocha', room: 'Mobilidade', spots: 11 },
    { day: 'Terça', short: 'Ter.', date: '14 Jul', time: '19:45', classId: 'tempo-lift', trainer: 'joao-martins', room: 'Força', spots: 2 },
    { day: 'Quarta', short: 'Qua.', date: '15 Jul', time: '12:45', classId: 'core-lab', trainer: 'miguel-santos', room: 'Estúdio 2', spots: 7 },
    { day: 'Quarta', short: 'Qua.', date: '15 Jul', time: '13:10', classId: 'recovery-reset', trainer: 'ines-rocha', room: 'Mobilidade', spots: 12 },
    { day: 'Quarta', short: 'Qua.', date: '15 Jul', time: '19:15', classId: 'vertice-strength', trainer: 'joao-martins', room: 'Funcional', spots: 5 },
    { day: 'Quarta', short: 'Qua.', date: '15 Jul', time: '20:00', classId: 'boxing-conditioning', trainer: 'andre-costa', room: 'Estúdio 2', spots: 5 },
    { day: 'Quinta', short: 'Qui.', date: '16 Jul', time: '07:00', classId: 'cardio-engine', trainer: 'carolina-lopes', room: 'Cardio', spots: 10 },
    { day: 'Quinta', short: 'Qui.', date: '16 Jul', time: '12:30', classId: 'metabolic', trainer: 'ines-rocha', room: 'Funcional', spots: 8 },
    { day: 'Quinta', short: 'Qui.', date: '16 Jul', time: '17:30', classId: 'foundations', trainer: 'miguel-santos', room: 'Estúdio 1', spots: 3 },
    { day: 'Quinta', short: 'Qui.', date: '16 Jul', time: '19:30', classId: 'cycle', trainer: 'carolina-lopes', room: 'Estúdio 1', spots: 5 },
    { day: 'Sexta', short: 'Sex.', date: '17 Jul', time: '13:10', classId: 'recovery-reset', trainer: 'ines-rocha', room: 'Mobilidade', spots: 12 },
    { day: 'Sexta', short: 'Sex.', date: '17 Jul', time: '18:30', classId: 'vertice-strength', trainer: 'joao-martins', room: 'Funcional', spots: 6 },
    { day: 'Sexta', short: 'Sex.', date: '17 Jul', time: '19:15', classId: 'boxing-conditioning', trainer: 'andre-costa', room: 'Estúdio 2', spots: 6 },
    { day: 'Sexta', short: 'Sex.', date: '17 Jul', time: '20:00', classId: 'tempo-lift', trainer: 'joao-martins', room: 'Força', spots: 2 },
    { day: 'Sábado', short: 'Sáb.', date: '18 Jul', time: '09:00', classId: 'hybrid-saturday', trainer: 'andre-costa', room: 'Funcional', spots: 15 },
    { day: 'Sábado', short: 'Sáb.', date: '18 Jul', time: '10:00', classId: 'metabolic', trainer: 'ines-rocha', room: 'Funcional', spots: 9 },
    { day: 'Domingo', short: 'Dom.', date: '19 Jul', time: '10:30', classId: 'mobility-flow', trainer: 'ines-rocha', room: 'Mobilidade', spots: 11 },
  ],
  facilities: [
    {
      id: 'rececao',
      name: 'Receção',
      description: 'Ponto de entrada com check-in simples, atendimento, apoio a marcações e vista direta para a sala.',
      equipment: 'Balcão, lounge curto, cacifos rápidos, ponto de água',
      capacity: 'Fluxo confortável para horas de ponta',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'musculacao',
      name: 'Musculação',
      description: 'Zona principal com estações de força livres e guiadas, organizada por padrões de movimento.',
      equipment: 'Racks, barras, halteres, bancos, máquinas complementares',
      capacity: 'Até 28 utilizadores em simultâneo',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'cardio',
      name: 'Cardio',
      description: 'Área iluminada para trabalho contínuo, intervalado e aquecimento antes de treinos de força.',
      equipment: 'Passadeiras, bicicletas, remos, elípticas',
      capacity: '14 postos',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'funcional',
      name: 'Funcional',
      description: 'Plataforma aberta para circuitos, kettlebells, trenós, carries e trabalho de pequenos grupos.',
      equipment: 'Kettlebells, caixas, cordas, sacos, ergómetros',
      capacity: '20 lugares',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'estudio-1',
      name: 'Estúdio 1',
      description: 'Sala dedicada a cycling e aulas com ritmo, luz controlada e leitura clara do esforço.',
      equipment: 'Bicicletas indoor, sistema de som e monitor de treino',
      capacity: '20 bicicletas',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'estudio-2',
      name: 'Estúdio 2',
      description: 'Espaço versátil para boxing conditioning, core e blocos de iniciação.',
      equipment: 'Sacos, tapetes, luvas de treino, acessórios leves',
      capacity: '16 lugares',
      image: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'mobilidade',
      name: 'Mobilidade',
      description: 'Ambiente mais calmo para trabalho técnico, respiração e recuperação ativa.',
      equipment: 'Tapetes, rolos, bandas e blocos',
      capacity: '14 lugares',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'recuperacao',
      name: 'Recuperação',
      description: 'Zona de descarga com assentos, pontos de hidratação e material de libertação miofascial.',
      equipment: 'Rolos, bolas, bancos e ponto de água',
      capacity: '8 lugares',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'balnearios',
      name: 'Balneários',
      description: 'Balneários organizados com duches, bancos corridos, espelhos amplos e cacifos.',
      equipment: 'Duches, secadores, cacifos e área de apoio',
      capacity: 'Fluxo rápido nas mudanças de aula',
      image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  journal: [
    {
      id: 'rotina-treino',
      title: 'Como criar uma rotina de treino que consigas manter',
      category: 'habitos',
      author: 'Miguel Santos',
      date: '08 Julho 2026',
      excerpt: 'Estrutura, frequência e expectativas realistas para transformar intenção em presença regular.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'forca-ou-cardio',
      title: 'Força ou cardio: como equilibrar sem complicar',
      category: 'treino',
      author: 'João Martins',
      date: '03 Julho 2026',
      excerpt: 'Uma forma simples de distribuir energia, recuperação e objetivos ao longo da semana.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'primeira-avaliacao',
      title: 'O que esperar da primeira avaliação',
      category: 'iniciacao',
      author: 'Inês Rocha',
      date: '28 Junho 2026',
      excerpt: 'O que observamos, porque importa e como essa conversa influencia o teu plano.',
      image: 'https://images.unsplash.com/photo-1594737625785-cb74c36f7fd4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'mobilidade-dia-a-dia',
      title: 'Mobilidade útil para quem passa muito tempo sentado',
      category: 'mobilidade',
      author: 'Inês Rocha',
      date: '21 Junho 2026',
      excerpt: 'Menos volume, mais regularidade: três blocos simples para encaixar na semana.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'recuperacao-semana',
      title: 'Recuperação: o que realmente ajuda entre treinos',
      category: 'recuperacao',
      author: 'André Costa',
      date: '14 Junho 2026',
      excerpt: 'Sono, gestão de carga e pequenas decisões com impacto real na continuidade.',
      image: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'aulas-grupo-primeira-vez',
      title: 'Primeira aula de grupo: como entrar sem ansiedade',
      category: 'aulas',
      author: 'Carolina Lopes',
      date: '10 Junho 2026',
      excerpt: 'Chegada, ritmo, adaptação de carga e o que dizer ao treinador antes de começar.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'forca-apos-40',
      title: 'Treino de força após os 40: consistência antes de volume',
      category: 'forca',
      author: 'João Martins',
      date: '04 Junho 2026',
      excerpt: 'Como organizar sessões produtivas sem tornar o treino mais complicado do que precisa de ser.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'comunidade-ajuda',
      title: 'Porque a comunidade ajuda a treinar melhor',
      category: 'comunidade',
      author: 'Vértice Training Club',
      date: '29 Maio 2026',
      excerpt: 'Rotina, ambiente e pequenos compromissos partilhados que aumentam a continuidade.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'pausa-almoco',
      title: 'Treinar na pausa de almoço sem rebentar a agenda',
      category: 'habitos',
      author: 'Miguel Santos',
      date: '23 Maio 2026',
      excerpt: 'Sessões curtas, preparação mínima e uma lógica prática para profissionais com dias cheios.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'box-conditioning',
      title: 'Boxing Conditioning: técnica acessível, esforço elevado',
      category: 'aulas',
      author: 'André Costa',
      date: '17 Maio 2026',
      excerpt: 'O que diferencia esta aula e porque funciona bem para quem gosta de ritmo e coordenação.',
      image: 'https://images.unsplash.com/photo-1518611012118-fb8f2f4edd0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'cadencia-cycle',
      title: 'Como ler cadência e esforço numa aula de Cycle',
      category: 'cardio',
      author: 'Carolina Lopes',
      date: '12 Maio 2026',
      excerpt: 'Indicadores simples para tirar mais de uma aula sem depender só da música.',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'regresso-ao-treino',
      title: 'Regressar ao treino depois de uma pausa longa',
      category: 'iniciacao',
      author: 'Inês Rocha',
      date: '05 Maio 2026',
      excerpt: 'Como voltar com margem, contexto e confiança em vez de recuperar tempo perdido à força.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  testimonials: [
    {
      name: 'Marta, 34',
      story: 'Passei de treinar sem regularidade para três sessões por semana porque finalmente tive um plano simples e um horário compatível com o trabalho.',
    },
    {
      name: 'Rui, 47',
      story: 'Voltei ao treino depois de anos parado. O que mais valorizo é a forma como corrigem sem criar pressão desnecessária.',
    },
    {
      name: 'Sofia, 29',
      story: 'As aulas de grupo deram-me estrutura, mas o acompanhamento técnico fez a diferença para continuar a evoluir.',
    },
  ],
  trialExperiences: [
    { id: 'visita', name: 'Visita ao clube', duration: '20 minutos', price: 'Gratuito', requirements: 'Roupa normal. Ideal para conhecer o espaço.' },
    { id: 'livre', name: 'Treino livre experimental', duration: '60 minutos', price: 'Gratuito', requirements: 'Trazer toalha e calçado limpo.' },
    { id: 'aula', name: 'Aula experimental', duration: '45 a 50 minutos', price: 'Gratuito', requirements: 'Escolha sujeita à disponibilidade horária.' },
    { id: 'avaliacao', name: 'Avaliação com treinador', duration: '35 minutos', price: '12 €', requirements: 'Inclui conversa inicial e recomendação de percurso.' },
    { id: 'pt', name: 'Sessão de Personal Training', duration: '50 minutos', price: '25 €', requirements: 'Marcação sujeita a confirmação do treinador.' },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  markCurrentPage();
  initMobileNavigation();
  initHeaderScroll();
  initMembershipPricing();
  renderHomePage();
  renderClassesPage();
  renderClassDetail();
  renderSchedulePage();
  initSchedule();
  renderTrainersPage();
  initTrainerFilters();
  renderTrainerDetail();
  initFacilityMap();
  initSessionSelector();
  initTrialFlow();
  renderJournalPage();
  renderJournalDetail();
  initClassFilters();
  initJournalSearch();
  initAccordions();
  initForms();
  initNewsletter();
  initRevealAnimations();
});

function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function trainerById(id) {
  return siteData.trainers.find(item => item.id === id);
}

function classById(id) {
  return siteData.classes.find(item => item.id === id);
}

function intensityLabel(level) {
  return {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    signature: 'Assinatura',
  }[level] || level;
}

function intensityClass(level) {
  return `intensity-${level}`;
}

function availabilityClass(spots) {
  if (spots <= 3) return 'availability-low';
  if (spots <= 7) return 'availability-medium';
  return 'availability-good';
}

function availabilityLabel(spots) {
  if (spots <= 3) return 'Poucos lugares';
  if (spots <= 7) return 'Disponibilidade moderada';
  return 'Boa disponibilidade';
}

function markCurrentPage() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  $all('[data-nav-link]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current) link.setAttribute('aria-current', 'page');
  });
}

function initMobileNavigation() {
  const toggle = $('.menu-toggle');
  const nav = $('.mobile-nav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  $all('.mobile-nav-link', nav).forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });
}

function initHeaderScroll() {
  const header = $('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMembershipPricing() {
  const toggles = $all('[data-price-toggle]');
  if (!toggles.length) return;

  const updatePricing = period => {
    const config = siteData.memberships[period];
    if (!config) return;
    $all('[data-membership-plan]').forEach(card => {
      const plan = card.dataset.membershipPlan;
      const data = config.plans[plan];
      if (!data) return;
      $('[data-price]', card).textContent = `${data.price} €`;
      $('[data-total]', card).textContent = `${data.total} € total`;
      $('[data-savings]', card).textContent = data.savings;
      $('[data-terms]', card).textContent = data.terms;
      const cta = $('[data-plan-cta]', card);
      if (cta) cta.textContent = period === 'yearly' ? 'Escolher plano anual' : `Escolher plano ${config.label.toLowerCase()}`;
    });
    toggles.forEach(btn => btn.classList.toggle('is-active', btn.dataset.priceToggle === period));
  };

  toggles.forEach(btn => btn.addEventListener('click', () => updatePricing(btn.dataset.priceToggle)));
  updatePricing('monthly');
}

function renderHomePage() {
  const nextClassHost = $('[data-next-class]');
  if (nextClassHost) {
    const nextSession = siteData.schedule.find(item => item.classId === 'vertice-strength') || siteData.schedule[0];
    const nextClass = classById(nextSession.classId);
    nextClassHost.innerHTML = `
      <div class="next-class reveal">
        <span class="eyebrow">Próxima aula</span>
        <div class="grid-2">
          <div>
            <p class="page-kicker">${nextSession.time}</p>
            <h3 class="display-title" style="font-size:var(--text-xl)">${nextClass.name}</h3>
            <p>${nextClass.duration} minutos · Com ${trainerById(nextSession.trainer).name}</p>
          </div>
          <div class="stack-panel">
            <span class="intensity ${intensityClass(nextClass.intensity)}">Intensidade ${intensityLabel(nextClass.intensity).toLowerCase()}</span>
            <span class="availability ${availabilityClass(nextSession.spots)}">${nextSession.spots} lugares disponíveis</span>
            <a class="btn btn-primary" href="class-detail.html#reservar">Reservar</a>
          </div>
        </div>
      </div>
    `;
  }

  renderCollection(
    '[data-home-classes]',
    siteData.classes.slice(0, 6),
    item => `
      <article class="class-card reveal" data-class-item data-category="${item.category}" data-level="${item.level}" data-intensity="${item.intensity}" data-duration="${item.duration}" data-period="${item.period}" data-search="${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.recommended.toLowerCase()}">
        <div class="class-card__meta">
          <span class="meta-pill">${item.duration} min</span>
          <span class="meta-pill">${item.level}</span>
          <span class="intensity ${intensityClass(item.intensity)}">${intensityLabel(item.intensity)}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <ul class="detail-list">
          <li>Treinador recomendado: ${item.recommended}</li>
          <li>Formato: ${item.format}</li>
          <li>Próximos horários: ${item.nextTimes.join(' · ')}</li>
        </ul>
        <div class="class-card__actions">
          <a class="btn btn-secondary" href="class-detail.html">Ver detalhe</a>
          <a class="btn btn-primary" href="schedule.html">Ver horários</a>
        </div>
      </article>
    `
  );

  renderScheduleCards('[data-home-schedule]', siteData.schedule.slice(0, 6));
  renderTrainerCards('[data-home-trainers]', siteData.trainers);
  renderCollection(
    '[data-home-testimonials]',
    siteData.testimonials,
    item => `
      <article class="testimonial reveal">
        <h3>${item.name}</h3>
        <p>${item.story}</p>
      </article>
    `
  );
  renderJournalCards('[data-home-journal]', siteData.journal.slice(0, 3));
}

function renderClassesPage() {
  renderCollection(
    '[data-classes-list]',
    siteData.classes,
    item => `
      <article class="class-card reveal" data-class-item data-category="${item.category}" data-level="${item.level}" data-intensity="${item.intensity}" data-duration="${item.duration}" data-period="${item.period}" data-search="${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.recommended.toLowerCase()}">
        <div class="rounded-media"><img src="${item.image}" alt="${item.name} no Vértice Training Club" width="1200" height="900" loading="lazy" /></div>
        <div class="class-card__meta">
          <span class="meta-pill">${item.duration} min</span>
          <span class="meta-pill">${item.level}</span>
          <span class="intensity ${intensityClass(item.intensity)}">${intensityLabel(item.intensity)}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <ul class="detail-list">
          <li>${item.format}</li>
          <li>Treinador: ${item.recommended}</li>
          <li>Próximos horários: ${item.nextTimes.join(' · ')}</li>
        </ul>
        <div class="class-card__actions">
          <a class="btn btn-secondary" href="class-detail.html">Ver detalhe</a>
          <a class="btn btn-primary" href="schedule.html">Reservar aula</a>
        </div>
      </article>
    `
  );
}

function initClassFilters() {
  const wrap = $('[data-classes-controls]');
  const list = $('[data-classes-list]');
  if (!wrap || !list) return;

  const searchInput = $('[data-class-search]', wrap);
  const buttons = $all('[data-filter]', wrap);
  const selects = $all('select[data-filter-key]', wrap);
  let category = 'all';

  const apply = () => {
    const term = (searchInput?.value || '').trim().toLowerCase();
    const filters = Object.fromEntries(selects.map(select => [select.dataset.filterKey, select.value]));
    $all('[data-class-item]', list).forEach(item => {
      const matchesCategory = category === 'all' || item.dataset.category === category;
      const matchesSearch = !term || item.dataset.search.includes(term);
      const matchesLevel = !filters.level || item.dataset.level === filters.level;
      const matchesIntensity = !filters.intensity || item.dataset.intensity === filters.intensity;
      const matchesDuration = !filters.duration || matchDuration(filters.duration, Number(item.dataset.duration));
      const matchesPeriod = !filters.period || item.dataset.period === filters.period;
      const show = matchesCategory && matchesSearch && matchesLevel && matchesIntensity && matchesDuration && matchesPeriod;
      item.hidden = !show;
    });
  };

  buttons.forEach(btn => btn.addEventListener('click', () => {
    category = btn.dataset.filter;
    buttons.forEach(item => item.classList.toggle('is-active', item === btn));
    apply();
  }));
  if (searchInput) searchInput.addEventListener('input', apply);
  selects.forEach(select => select.addEventListener('change', apply));
  apply();
}

function matchDuration(filter, duration) {
  if (filter === 'short') return duration <= 35;
  if (filter === 'medium') return duration > 35 && duration <= 50;
  if (filter === 'long') return duration > 50;
  return true;
}

function renderClassDetail() {
  const selector = $('[data-class-sessions]');
  if (!selector) return;
  const sessions = siteData.schedule.filter(item => item.classId === 'vertice-strength').slice(0, 4);
  selector.innerHTML = sessions.map((item, index) => `
    <button class="session-option ${index === 0 ? 'is-selected' : ''}" type="button" data-session-option data-date="${item.date}" data-time="${item.time}" data-trainer="${trainerById(item.trainer).name}" data-spots="${item.spots}">
      <span>
        <strong>${item.day}, ${item.date}</strong><br />
        ${item.time} · ${trainerById(item.trainer).name}
      </span>
      <span class="availability ${availabilityClass(item.spots)}">${item.spots} lugares</span>
    </button>
  `).join('');
  updateSessionSummary(selector.querySelector('[data-session-option]'));
}

function initSessionSelector() {
  const selector = $('[data-class-sessions]');
  if (!selector) return;
  selector.addEventListener('click', event => {
    const button = event.target.closest('[data-session-option]');
    if (!button) return;
    $all('[data-session-option]', selector).forEach(item => item.classList.toggle('is-selected', item === button));
    updateSessionSummary(button);
  });
}

function updateSessionSummary(button) {
  if (!button) return;
  const feedback = $('[data-session-feedback]');
  if (!feedback) return;
  feedback.textContent = `Sessão selecionada: ${button.dataset.date}, ${button.dataset.time} com ${button.dataset.trainer}.`;
}

function renderSchedulePage() {
  const grid = $('[data-schedule-grid]');
  if (!grid) return;
  const items = siteData.schedule.map(entry => {
    const classItem = classById(entry.classId);
    return { ...entry, className: classItem.name, duration: classItem.duration, intensity: classItem.intensity };
  });
  grid.innerHTML = items.map(item => scheduleMarkup(item)).join('');
}

function scheduleMarkup(item) {
  return `
    <article class="schedule-row schedule-card-mobile reveal" data-schedule-item data-day="${item.day}" data-class="${classById(item.classId).category}" data-trainer="${item.trainer}" data-intensity="${item.intensity}" data-period="${periodForTime(item.time)}">
      <div><strong>${item.time}</strong><br /><span>${item.short}</span></div>
      <div><strong>${item.className}</strong><br /><span>${item.duration} min · ${item.room}</span></div>
      <div>${trainerById(item.trainer).name}</div>
      <div class="intensity ${intensityClass(item.intensity)}">${intensityLabel(item.intensity)}</div>
      <div class="availability ${availabilityClass(item.spots)}">${item.spots}</div>
      <div>${item.date}</div>
      <div><button class="btn btn-primary" type="button" data-booking-button data-class-name="${item.className}" data-time="${item.time}" data-day="${item.day}">Reservar</button></div>
    </article>
  `;
}

function periodForTime(time) {
  const hour = Number(time.split(':')[0]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'lunch';
  return 'evening';
}

function initSchedule() {
  const panel = $('[data-schedule-panel]');
  if (!panel) return;
  const dayButtons = $all('[data-day-filter]', panel);
  const classSelect = $('[data-schedule-class]', panel);
  const trainerSelect = $('[data-schedule-trainer]', panel);
  const intensitySelect = $('[data-schedule-intensity]', panel);
  const periodSelect = $('[data-schedule-period]', panel);
  const todayButton = $('[data-today-button]', panel);
  const feedback = $('[data-booking-feedback]');

  const apply = () => {
    const selectedDay = dayButtons.find(btn => btn.classList.contains('is-active'))?.dataset.dayFilter || 'all';
    $all('[data-schedule-item]', panel).forEach(item => {
      const show = (selectedDay === 'all' || item.dataset.day === selectedDay)
        && (!classSelect.value || item.dataset.class === classSelect.value)
        && (!trainerSelect.value || item.dataset.trainer === trainerSelect.value)
        && (!intensitySelect.value || item.dataset.intensity === intensitySelect.value)
        && (!periodSelect.value || item.dataset.period === periodSelect.value);
      item.hidden = !show;
    });
  };

  dayButtons.forEach(btn => btn.addEventListener('click', () => {
    dayButtons.forEach(item => item.classList.toggle('is-active', item === btn));
    apply();
  }));
  [classSelect, trainerSelect, intensitySelect, periodSelect].forEach(select => select && select.addEventListener('change', apply));
  if (todayButton) {
    todayButton.addEventListener('click', () => {
      const btn = dayButtons.find(item => item.dataset.dayFilter === 'Segunda');
      if (btn) btn.click();
    });
  }
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-booking-button]');
    if (!button) return;
    feedback.textContent = `Reserva simulada enviada para ${button.dataset.className} em ${button.dataset.day} às ${button.dataset.time}.`;
  });
  apply();
}

function renderTrainerCards(selector, collection) {
  renderCollection(
    selector,
    collection,
    item => `
      <article class="trainer-card reveal" data-trainer-item data-specialties="${item.tags.join(',')}">
        <div class="rounded-media"><img src="${item.image}" alt="${item.name}, ${item.specialty}" width="1200" height="1200" loading="lazy" /></div>
        <div class="trainer-card__meta">
          <span class="meta-pill">${item.specialty}</span>
          <span class="meta-pill">${item.experience}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.bio}</p>
        <p><strong>Formação:</strong> ${item.education}</p>
        <div class="trainer-card__actions">
          <a class="btn btn-secondary" href="trainer-detail.html">Ver perfil</a>
          <a class="btn btn-primary" href="trial.html">Marcar avaliação</a>
        </div>
      </article>
    `
  );
}

function renderTrainersPage() {
  renderTrainerCards('[data-trainers-list]', siteData.trainers);
}

function initTrainerFilters() {
  const host = $('[data-trainers-filters]');
  const list = $('[data-trainers-list]');
  if (!host || !list) return;
  const buttons = $all('[data-specialty-filter]', host);
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.dataset.specialtyFilter;
    buttons.forEach(item => item.classList.toggle('is-active', item === btn));
    $all('[data-trainer-item]', list).forEach(item => {
      const tags = item.dataset.specialties.split(',');
      item.hidden = filter !== 'all' && !tags.includes(filter);
    });
  }));
}

function renderTrainerDetail() {
  const host = $('[data-related-articles]');
  if (!host) return;
  renderJournalCards('[data-related-articles]', siteData.journal.slice(0, 3));
}

function initFacilityMap() {
  const map = $('[data-facility-map]');
  if (!map) return;
  const detail = $('[data-facility-detail]');
  const update = id => {
    const area = siteData.facilities.find(item => item.id === id) || siteData.facilities[0];
    if (!area || !detail) return;
    detail.innerHTML = `
      <div class="detail-panel reveal is-visible">
        <div class="rounded-media"><img src="${area.image}" alt="${area.name} do Vértice Training Club" width="1200" height="900" loading="lazy" /></div>
        <h3>${area.name}</h3>
        <p>${area.description}</p>
        <ul class="detail-list">
          <li>Equipamentos: ${area.equipment}</li>
          <li>Capacidade: ${area.capacity}</li>
        </ul>
      </div>
    `;
    $all('.map-area', map).forEach(item => item.classList.toggle('is-active', item.dataset.area === id));
  };
  map.addEventListener('click', event => {
    const area = event.target.closest('.map-area');
    if (area) update(area.dataset.area);
  });
  map.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.map-area')) {
      event.preventDefault();
      update(event.target.closest('.map-area').dataset.area);
    }
  });
  update(siteData.facilities[0].id);
}

function initTrialFlow() {
  const flow = $('[data-trial-flow]');
  if (!flow) return;

  const state = JSON.parse(sessionStorage.getItem('verticeTrialFlow') || '{}');
  let step = Number(state.step || 1);
  const maxStep = 6;

  const goalOptions = $all('[data-goal-option]', flow);
  const experienceOptions = $all('[data-experience-option]', flow);
  const dateInput = $('[data-trial-date]', flow);
  const timeWrap = $('[data-time-options]', flow);
  const form = $('[data-trial-form]', flow);
  const feedback = $('[data-trial-feedback]', flow);
  const prevButton = $('[data-prev-step]', flow);
  const nextButton = $('[data-next-step]', flow);
  const confirmButton = $('[data-confirm-trial]', flow);

  const timeOptions = ['07:30', '12:30', '18:00', '19:15'];

  if (timeWrap) {
    timeWrap.innerHTML = timeOptions.map(time => `<button class="chip-btn" type="button" data-time-option="${time}">${time}</button>`).join('');
  }

  const persist = () => sessionStorage.setItem('verticeTrialFlow', JSON.stringify({ ...state, step }));

  const updateSummary = () => {
    const summary = $('[data-trial-summary]', flow);
    if (!summary) return;
    const experience = siteData.trialExperiences.find(item => item.id === state.experience);
    summary.innerHTML = `
      <strong>Resumo da marcação</strong>
      <p><strong>Objetivo:</strong> ${state.goal || 'Por definir'}</p>
      <p><strong>Experiência:</strong> ${experience ? experience.name : 'Por definir'}</p>
      <p><strong>Duração:</strong> ${experience ? experience.duration : 'Por definir'}</p>
      <p><strong>Custo:</strong> ${experience ? experience.price : 'Por definir'}</p>
      <p><strong>Data:</strong> ${state.date || 'Por definir'}</p>
      <p><strong>Hora:</strong> ${state.time || 'Por definir'}</p>
      <p><strong>Nome:</strong> ${state.name || 'Por definir'}</p>
      <p><strong>Email:</strong> ${state.email || 'Por definir'}</p>
      <p><strong>Telefone:</strong> ${state.phone || 'Por definir'}</p>
      <p><strong>Política:</strong> Cancelamentos até 12 horas antes; faltas sem aviso podem limitar nova marcação online.</p>
    `;
  };

  const renderStep = () => {
    $all('[data-trial-step]').forEach(node => {
      const nodeStep = Number(node.dataset.trialStep);
      node.classList.toggle('is-current', nodeStep === step);
      node.classList.toggle('is-complete', nodeStep < step);
    });
    $all('[data-step-panel]', flow).forEach(panel => panel.hidden = Number(panel.dataset.stepPanel) !== step);
    goalOptions.forEach(btn => btn.classList.toggle('is-selected', btn.dataset.goalOption === state.goal));
    experienceOptions.forEach(btn => btn.classList.toggle('is-selected', btn.dataset.experienceOption === state.experience));
    $all('[data-time-option]', flow).forEach(btn => btn.classList.toggle('is-active', btn.dataset.timeOption === state.time));
    if (dateInput && state.date) dateInput.value = state.date;
    if (form) {
      ['name', 'email', 'phone'].forEach(key => {
        const input = form.elements[key];
        if (input && state[key]) input.value = state[key];
      });
    }
    if (prevButton) prevButton.hidden = step === 1;
    if (nextButton) nextButton.hidden = step >= 5;
    if (confirmButton) confirmButton.hidden = step !== 5;
    updateSummary();
    persist();
  };

  const validateStep = () => {
    if (step === 1 && !state.goal) return 'Seleciona um objetivo.';
    if (step === 2 && !state.experience) return 'Seleciona uma experiência.';
    if (step === 3 && !state.date) return 'Escolhe uma data.';
    if (step === 4 && !state.time) return 'Escolhe uma hora.';
    if (step === 5) {
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const phone = form.elements.phone.value.trim();
      if (!name || !validateEmail(email) || !validatePhone(phone)) return 'Preenche nome, email e telefone com dados válidos.';
      state.name = name;
      state.email = email;
      state.phone = phone;
    }
    return '';
  };

  goalOptions.forEach(btn => btn.addEventListener('click', () => {
    state.goal = btn.dataset.goalOption;
    renderStep();
  }));
  experienceOptions.forEach(btn => btn.addEventListener('click', () => {
    state.experience = btn.dataset.experienceOption;
    renderStep();
  }));
  if (dateInput) dateInput.addEventListener('change', () => {
    state.date = dateInput.value;
    renderStep();
  });
  flow.addEventListener('click', event => {
    const timeButton = event.target.closest('[data-time-option]');
    if (timeButton) {
      state.time = timeButton.dataset.timeOption;
      renderStep();
    }
    const next = event.target.closest('[data-next-step]');
    const prev = event.target.closest('[data-prev-step]');
    const confirm = event.target.closest('[data-confirm-trial]');

    if (next) {
      const error = validateStep();
      feedback.textContent = error;
      if (!error && step < maxStep) {
        step += 1;
        renderStep();
      }
    }
    if (prev && step > 1) {
      step -= 1;
      feedback.textContent = '';
      renderStep();
    }
    if (confirm) {
      if (step !== 5) return;
      const error = validateStep();
      feedback.textContent = error || 'Pedido experimental enviado com sucesso. Receberás confirmação por email ou telefone.';
      if (!error) {
        step = 6;
        renderStep();
      }
    }
  });
  renderStep();
}

function renderJournalPage() {
  const feature = $('[data-journal-feature]');
  if (feature) {
    const post = siteData.journal[0];
    feature.innerHTML = `
      <article class="journal-feature reveal">
        <div class="journal-feature__media"><img src="${post.image}" alt="${post.title}" width="1200" height="900" /></div>
        <div class="journal-card">
          <div class="journal-card__meta"><span class="meta-pill">${post.category}</span><span>${post.date}</span><span>${post.author}</span></div>
          <h2>${post.title}</h2>
          <p>${post.excerpt}</p>
          <div class="class-card__actions">
            <a class="btn btn-primary" href="journal-detail.html">Ler artigo</a>
            <a class="btn btn-secondary" href="trial.html">Marcar treino experimental</a>
          </div>
        </div>
      </article>
    `;
  }
  renderJournalCards('[data-journal-list]', siteData.journal);
}

function renderJournalCards(selector, collection) {
  renderCollection(
    selector,
    collection,
    item => `
      <article class="journal-card reveal" data-journal-item data-category="${item.category}" data-search="${item.title.toLowerCase()} ${item.excerpt.toLowerCase()} ${item.author.toLowerCase()}">
        <div class="rounded-media"><img src="${item.image}" alt="${item.title}" width="1200" height="900" loading="lazy" /></div>
        <div class="journal-card__meta">
          <span class="meta-pill">${item.category}</span>
          <span>${item.date}</span>
          <span>${item.author}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="btn btn-secondary" href="journal-detail.html">Ler artigo</a>
      </article>
    `
  );
}

function initJournalSearch() {
  const controls = $('[data-journal-controls]');
  const list = $('[data-journal-list]');
  if (!controls || !list) return;
  const search = $('[data-journal-search]', controls);
  const buttons = $all('[data-journal-filter]', controls);
  let category = 'all';
  const apply = () => {
    const term = (search.value || '').trim().toLowerCase();
    $all('[data-journal-item]', list).forEach(item => {
      const show = (category === 'all' || item.dataset.category === category) && (!term || item.dataset.search.includes(term));
      item.hidden = !show;
    });
  };
  buttons.forEach(btn => btn.addEventListener('click', () => {
    category = btn.dataset.journalFilter;
    buttons.forEach(item => item.classList.toggle('is-active', item === btn));
    apply();
  }));
  search.addEventListener('input', apply);
  apply();
}

function renderJournalDetail() {
  const related = $('[data-article-related]');
  if (related) renderJournalCards('[data-article-related]', siteData.journal.slice(1, 4));
}

function initAccordions() {
  $all('[data-accordion-button]').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
}

function initForms() {
  $all('[data-validate-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const feedback = $('[data-form-feedback]', form) || form.nextElementSibling;
      const email = form.querySelector('input[type="email"]');
      const phone = form.querySelector('input[name="telefone"], input[name="phone"]');
      let valid = true;
      if (email && !validateEmail(email.value.trim())) valid = false;
      if (phone && !validatePhone(phone.value.trim())) valid = false;
      $all('[required]', form).forEach(input => {
        if (!String(input.value).trim()) valid = false;
      });
      feedback.textContent = valid ? 'Pedido enviado com sucesso. Responderemos em breve.' : 'Revê os campos obrigatórios e confirma email e telefone.';
    });
  });
}

function initNewsletter() {
  $all('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const feedback = $('[data-newsletter-feedback]', form);
      feedback.textContent = validateEmail(email.value.trim())
        ? 'Subscrição registada. Receberás novidades do clube e do Journal.'
        : 'Introduz um email válido para subscrever.';
    });
  });
}

function initRevealAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $all('.reveal').forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  $all('.reveal').forEach(item => observer.observe(item));
}

function renderScheduleCards(selector, collection) {
  renderCollection(
    selector,
    collection,
    item => {
      const related = classById(item.classId);
      return `
        <article class="schedule-card-mobile reveal">
          <strong>${item.short} ${item.date} · ${item.time}</strong>
          <h3>${related.name}</h3>
          <p>${trainerById(item.trainer).name} · ${related.duration} min · ${item.room}</p>
          <p class="intensity ${intensityClass(related.intensity)}">${intensityLabel(related.intensity)}</p>
          <p class="availability ${availabilityClass(item.spots)}">${availabilityLabel(item.spots)}</p>
        </article>
      `;
    }
  );
}

function renderCollection(selector, collection, renderer) {
  const host = $(selector);
  if (!host) return;
  host.innerHTML = collection.map(renderer).join('');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9+\s]{9,20}$/.test(phone);
}
