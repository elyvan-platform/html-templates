(() => {
  const STORAGE_KEY = "mercado-da-vila-cart";
  const PROMO_KEY = "mercado-da-vila-promo";
  const DELIVERY_MODE_KEY = "mercado-da-vila-delivery-mode";

  const producers = [
    {
      id: "quinta-ribeira",
      name: "Quinta da Ribeira",
      location: "Santo Tirso",
      distance: "9 km",
      specialty: "Tomate, courgette e alface",
      story: "Exploração familiar com colheita matinal e entregas diretas três vezes por semana.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "horta-vale",
      name: "Horta do Vale",
      location: "Vila Nova de Famalicão",
      distance: "14 km",
      specialty: "Fruta da época e ervas frescas",
      story: "Produção sazonal em pequena escala, com foco em variedades de sabor mais intenso.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "padaria-sao-miguel",
      name: "Padaria São Miguel",
      location: "Trofa",
      distance: "6 km",
      specialty: "Broa de milho e pão rústico",
      story: "Fornadas curtas ao longo do dia para garantir pão fresco sem excesso de produção.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "queijaria-serra",
      name: "Queijaria da Serra",
      location: "Cabeceiras de Basto",
      distance: "47 km",
      specialty: "Queijo curado e queijo de cabra",
      story: "Casa pequena de cura lenta, com lotes reduzidos e maturação controlada.",
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "mel-campo-longo",
      name: "Mel do Campo Longo",
      location: "Vizela",
      distance: "18 km",
      specialty: "Mel multifloral e infusões",
      story: "Apicultura artesanal com extração limitada e seleção por floração dominante.",
      image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const products = [
    {
      id: "tomate-coracao-de-boi",
      name: "Tomate coração de boi",
      category: "Fruta e legumes",
      price: 2.49,
      unit: "€/kg",
      origin: "Santo Tirso",
      producer: "Quinta da Ribeira",
      producerId: "quinta-ribeira",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
      ],
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Escolha do dia",
      description: "Tomate carnudo, suculento e com acidez equilibrada. Excelente para saladas, arroz de tomate e sandes abertas.",
      organic: true,
      glutenFree: true,
      vegetarian: true,
      recent: true,
      promo: { oldPrice: 2.95, label: "-16%", validUntil: "Sábado", savings: "0,46 €/kg", stock: "Stock confortável" },
      detailLink: "product-detail.html",
      nutrition: [
        ["Energia", "18 kcal / 100 g"],
        ["Fibra", "1,2 g"],
        ["Vitamina C", "14 mg"],
        ["Água", "94%"],
      ],
      storage: "Conservar à temperatura ambiente e consumir em 2 a 3 dias para manter o aroma.",
      flavor: "Doce, aromático e de polpa firme.",
      orderOptions: [
        { label: "1 kg", multiplier: 1 },
        { label: "500 g", multiplier: 0.5 },
      ],
      related: ["azeite-virgem-extra", "queijo-curado-serra", "alface-romana", "feijao-vermelho-granel"],
    },
    {
      id: "pessego-nacional",
      name: "Pêssego nacional",
      category: "Fruta e legumes",
      price: 3.2,
      unit: "€/kg",
      origin: "Vila Nova de Famalicão",
      producer: "Horta do Vale",
      producerId: "horta-vale",
      image: "https://images.unsplash.com/photo-1629828874514-4f1f1e4d4fdb?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Doce da época",
      description: "Pêssego perfumado, ideal para sobremesas leves ou saladas frescas.",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: true,
    },
    {
      id: "broa-milho",
      name: "Broa de milho",
      category: "Padaria",
      price: 4.4,
      unit: "€/un.",
      origin: "Trofa",
      producer: "Padaria São Miguel",
      producerId: "padaria-sao-miguel",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      description: "Broa húmida, miolo amarelo e crosta bem marcada. Corta bem para sopa ou petisco.",
      organic: false,
      glutenFree: false,
      vegetarian: true,
      recent: false,
    },
    {
      id: "queijo-curado-serra",
      name: "Queijo curado da serra",
      category: "Charcutaria",
      price: 7.95,
      unit: "€/un.",
      origin: "Cabeceiras de Basto",
      producer: "Queijaria da Serra",
      producerId: "queijaria-serra",
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Regional",
      description: "Queijo curado de pasta firme, ideal para tábua, saladas e tostas.",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "presunto-regional",
      name: "Presunto regional",
      category: "Charcutaria",
      price: 5.8,
      unit: "€/100 g",
      origin: "Amarante",
      producer: "Fumeiro do Monte",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      availability: "Stock limitado",
      availabilityClass: "status-limited",
      description: "Fatias finas e sabor persistente, indicado para tábua ou sandes compostas.",
      organic: false,
      glutenFree: true,
      vegetarian: false,
      recent: false,
    },
    {
      id: "mel-multifloral",
      name: "Mel multifloral",
      category: "Produtos regionais",
      price: 6.2,
      unit: "€/frasco",
      origin: "Vizela",
      producer: "Mel do Campo Longo",
      producerId: "mel-campo-longo",
      image: "https://images.unsplash.com/photo-1587049016823-69ef39d12f35?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      description: "Mel de perfil floral equilibrado, bom para pequeno-almoço, iogurte e queijo.",
      organic: true,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "azeite-virgem-extra",
      name: "Azeite virgem extra",
      category: "Produtos regionais",
      price: 9.8,
      unit: "€/garrafa",
      origin: "Trás-os-Montes",
      producer: "Lagar da Encosta",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Prensa fria",
      description: "Azeite macio com final verde, ideal para tomate, sopas e saladas.",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "feijao-vermelho-granel",
      name: "Feijão vermelho a granel",
      category: "A granel",
      price: 2.15,
      unit: "€/500 g",
      origin: "Barroso",
      producer: "Cooperativa do Alto",
      image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e2?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      description: "Grão firme e uniforme, ótimo para saladas mornas, chili vegetariano e sopa.",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "courgette-tenra",
      name: "Courgette tenra",
      category: "Fruta e legumes",
      price: 1.95,
      unit: "€/kg",
      origin: "Santo Tirso",
      producer: "Quinta da Ribeira",
      producerId: "quinta-ribeira",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: true,
      glutenFree: true,
      vegetarian: true,
      recent: true,
      promo: { oldPrice: 2.25, label: "-13%", validUntil: "Sábado", savings: "0,30 €/kg", stock: "Stock médio" },
    },
    {
      id: "alface-romana",
      name: "Alface romana",
      category: "Fruta e legumes",
      price: 1.3,
      unit: "€/un.",
      origin: "Santo Tirso",
      producer: "Quinta da Ribeira",
      producerId: "quinta-ribeira",
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "cereja-tardia",
      name: "Cereja tardia",
      category: "Fruta e legumes",
      price: 4.95,
      unit: "€/500 g",
      origin: "Resende",
      producer: "Pomar da Fraga",
      image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80",
      availability: "Stock limitado",
      availabilityClass: "status-limited",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: true,
      promo: { oldPrice: 5.5, label: "-10%", validUntil: "Quinta", savings: "0,55 €", stock: "Últimos tabuleiros" },
    },
    {
      id: "compota-abobora",
      name: "Compota de abóbora",
      category: "Produtos regionais",
      price: 4.6,
      unit: "€/frasco",
      origin: "Paços de Ferreira",
      producer: "Doçaria da Eira",
      image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "ovos-caseiros",
      name: "Ovos caseiros",
      category: "Mercearia",
      price: 2.9,
      unit: "€/meia dúzia",
      origin: "Vizela",
      producer: "Quinta do Souto",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "iogurte-cabra",
      name: "Iogurte de cabra",
      category: "Biológicos",
      price: 2.25,
      unit: "€/un.",
      origin: "Cabeceiras de Basto",
      producer: "Queijaria da Serra",
      producerId: "queijaria-serra",
      image: "https://images.unsplash.com/photo-1571212515416-fca88f1d3a5d?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: true,
      glutenFree: true,
      vegetarian: true,
      recent: true,
    },
    {
      id: "cogumelos-castanhos",
      name: "Cogumelos castanhos",
      category: "Fruta e legumes",
      price: 2.8,
      unit: "€/250 g",
      origin: "Póvoa de Lanhoso",
      producer: "Vale do Bosque",
      image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "arroz-carolino",
      name: "Arroz carolino",
      category: "Mercearia",
      price: 2.4,
      unit: "€/kg",
      origin: "Baixo Mondego",
      producer: "Campos do Mondego",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "maca-bravo-esmolfe",
      name: "Maçã bravo de Esmolfe",
      category: "Fruta e legumes",
      price: 3.7,
      unit: "€/kg",
      origin: "Penalva do Castelo",
      producer: "Pomar de S. Vicente",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "granola-artesanal",
      name: "Granola artesanal",
      category: "Mercearia",
      price: 5.1,
      unit: "€/embalagem",
      origin: "Guimarães",
      producer: "Cozinha da Praça",
      image: "https://images.unsplash.com/photo-1514995669114-d7d7b17cd3f4?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: false,
      vegetarian: true,
      recent: true,
    },
    {
      id: "farinha-milho",
      name: "Farinha de milho",
      category: "A granel",
      price: 1.75,
      unit: "€/500 g",
      origin: "Trofa",
      producer: "Moinho da Ponte",
      image: "https://images.unsplash.com/photo-1514995669114-d7d7b17cd3f4?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: false,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "infusao-lucia-lima",
      name: "Infusão de lúcia-lima",
      category: "Biológicos",
      price: 3.95,
      unit: "€/saqueta",
      origin: "Vizela",
      producer: "Mel do Campo Longo",
      producerId: "mel-campo-longo",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      organic: true,
      glutenFree: true,
      vegetarian: true,
      recent: false,
    },
    {
      id: "cabaz-essencial-semanal",
      name: "Cabaz Essencial semanal",
      category: "Cabazes",
      price: 16.5,
      unit: "€",
      origin: "Mercado da Vila",
      producer: "Seleção da loja",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Pronto a encomendar",
      description: "Cabaz base com fruta, legumes e pão para 2 pessoas.",
      organic: false,
      glutenFree: false,
      vegetarian: true,
      recent: true,
      promo: { oldPrice: 18.5, label: "-11%", validUntil: "Sábado", savings: "2,00 €", stock: "Montagem por encomenda" },
    },
    {
      id: "cabaz-regional",
      name: "Cabaz Regional",
      category: "Cabazes",
      price: 34,
      unit: "€",
      origin: "Mercado da Vila",
      producer: "Seleção da loja",
      image: "https://images.unsplash.com/photo-1518164534281-5943b5919739?auto=format&fit=crop&w=900&q=80",
      availability: "Disponível",
      availabilityClass: "status-available",
      tag: "Oferta ou partilha",
      description: "Queijo, presunto, mel, compota, azeite e broa numa composição regional.",
      organic: false,
      glutenFree: false,
      vegetarian: false,
      recent: false,
    },
    {
      id: "pack-petisco-vila",
      name: "Pack petisco da vila",
      category: "Cabazes",
      price: 19.9,
      unit: "€",
      origin: "Mercado da Vila",
      producer: "Seleção da loja",
      image: "https://images.unsplash.com/photo-1518164534281-5943b5919739?auto=format&fit=crop&w=900&q=80",
      availability: "Stock limitado",
      availabilityClass: "status-limited",
      tag: "Pack da semana",
      description: "Pack promocional com queijo curado, broa e compota para petisco de fim de tarde.",
      organic: false,
      glutenFree: false,
      vegetarian: true,
      recent: true,
      promo: { oldPrice: 22.5, label: "-12%", validUntil: "Domingo", savings: "2,60 €", stock: "Stock limitado" },
    },
  ];

  const baskets = [
    {
      name: "Cabaz Essencial",
      people: "2 pessoas",
      price: "16,50 €",
      frequency: "Semanal",
      description: "Base prática para sopa, salada e fruta do dia a dia.",
      includes: "Tomate, alface, courgette, maçã, ovos e pão.",
      custom: "Pode trocar 2 produtos",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Cabaz Família",
      people: "4 a 5 pessoas",
      price: "29,90 €",
      frequency: "Semanal ou quinzenal",
      description: "Mais volume e maior variedade para refeições completas durante a semana.",
      includes: "Fruta da época, legumes, arroz, ovos, broa e queijo.",
      custom: "Personalização gratuita",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Cabaz da Horta",
      people: "3 a 4 pessoas",
      price: "18,90 €",
      frequency: "Semanal",
      description: "Foco em legumes frescos e ervas aromáticas para cozinha sazonal.",
      includes: "Tomate, courgette, alface, cogumelos, feijão e ervas.",
      custom: "Ajustável a preferências",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Cabaz Regional",
      people: "Mesa de petiscos",
      price: "34,00 €",
      frequency: "Pontual ou mensal",
      description: "Seleção de produtos de origem regional para oferecer ou partilhar.",
      includes: "Queijo curado, presunto, mel, compota, azeite e broa.",
      custom: "Pode incluir cartão personalizado",
      image: "https://images.unsplash.com/photo-1518164534281-5943b5919739?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const recipes = [
    {
      id: "arroz-tomate-legumes",
      name: "Arroz de tomate com legumes",
      time: "35 min",
      difficulty: "Fácil",
      serves: "4 pessoas",
      meal: "jantar",
      tags: ["almoco", "jantar", "vegetariano", "economico", "sazonal"],
      ingredients: ["tomate-coracao-de-boi", "arroz-carolino", "courgette-tenra", "azeite-virgem-extra"],
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "salada-pessego-queijo-curado-nozes",
      name: "Salada de pêssego, queijo curado e nozes",
      time: "15 min",
      difficulty: "Muito fácil",
      serves: "2 pessoas",
      meal: "almoco",
      tags: ["almoco", "jantar", "rapido", "vegetariano", "sazonal"],
      ingredients: ["pessego-nacional", "queijo-curado-serra", "alface-romana", "azeite-virgem-extra"],
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
      link: "recipe-detail.html",
      intro: "Uma salada fresca com contraste entre doçura, sal, crocância e gordura equilibrada.",
      tips: "Sirva com broa torrada e uma colher de mel se quiser reforçar o lado doce.",
      storage: "Consumir de imediato. Se necessário, guardar sem tempero durante 6 horas no frio.",
      nutrition: "Aproximadamente 320 kcal por dose, com boa presença de proteína e gordura insaturada.",
      steps: [
        "Lave e seque a alface, rasgando-a para uma travessa larga.",
        "Corte o pêssego em gomos finos e distribua por cima da alface.",
        "Lamine o queijo curado em lascas e junte um punhado de nozes partidas.",
        "Tempere com azeite, uma pitada de sal e pimenta preta moída na hora.",
      ],
      ingredientList: [
        "2 pêssegos nacionais maduros",
        "120 g de queijo curado da serra",
        "1 alface romana pequena",
        "2 colheres de sopa de azeite virgem extra",
        "1 punhado de nozes",
      ],
      related: ["arroz-tomate-legumes", "sopa-legumes-epoca", "tosta-mel-queijo"],
    },
    {
      id: "sopa-legumes-epoca",
      name: "Sopa de legumes da época",
      time: "40 min",
      difficulty: "Fácil",
      serves: "6 pessoas",
      meal: "jantar",
      tags: ["jantar", "vegetariano", "economico", "sazonal"],
      ingredients: ["courgette-tenra", "alface-romana", "ovos-caseiros"],
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "granola-iogurte-fruta",
      name: "Taça de granola, iogurte e fruta",
      time: "10 min",
      difficulty: "Muito fácil",
      serves: "2 pessoas",
      meal: "pequeno-almoco",
      tags: ["pequeno-almoco", "rapido", "vegetariano"],
      ingredients: ["granola-artesanal", "iogurte-cabra", "maca-bravo-esmolfe"],
      image: "https://images.unsplash.com/photo-1514995669114-d7d7b17cd3f4?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "tosta-mel-queijo",
      name: "Tosta de queijo curado com mel",
      time: "12 min",
      difficulty: "Muito fácil",
      serves: "2 pessoas",
      meal: "almoco",
      tags: ["almoco", "rapido", "vegetariano"],
      ingredients: ["queijo-curado-serra", "mel-multifloral", "broa-milho"],
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "salteado-cogumelos",
      name: "Salteado de cogumelos com ervas",
      time: "18 min",
      difficulty: "Fácil",
      serves: "2 pessoas",
      meal: "jantar",
      tags: ["jantar", "rapido", "vegetariano", "sazonal"],
      ingredients: ["cogumelos-castanhos", "azeite-virgem-extra"],
      image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "compota-queijo",
      name: "Queijo com compota de abóbora",
      time: "8 min",
      difficulty: "Muito fácil",
      serves: "4 pessoas",
      meal: "sobremesa",
      tags: ["sobremesa", "rapido", "vegetariano"],
      ingredients: ["compota-abobora", "queijo-curado-serra"],
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "salada-feijao-tomate",
      name: "Salada de feijão vermelho e tomate",
      time: "20 min",
      difficulty: "Fácil",
      serves: "3 pessoas",
      meal: "almoco",
      tags: ["almoco", "vegetariano", "economico", "sazonal"],
      ingredients: ["feijao-vermelho-granel", "tomate-coracao-de-boi", "azeite-virgem-extra"],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "broa-presunto",
      name: "Broa tostada com presunto",
      time: "14 min",
      difficulty: "Muito fácil",
      serves: "2 pessoas",
      meal: "jantar",
      tags: ["jantar", "rapido"],
      ingredients: ["broa-milho", "presunto-regional"],
      image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "maca-assada-mel",
      name: "Maçã assada com mel e nozes",
      time: "30 min",
      difficulty: "Fácil",
      serves: "4 pessoas",
      meal: "sobremesa",
      tags: ["sobremesa", "economico", "sazonal", "vegetariano"],
      ingredients: ["maca-bravo-esmolfe", "mel-multifloral"],
      image: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "infusao-verao",
      name: "Infusão fria de lúcia-lima",
      time: "6 min + repouso",
      difficulty: "Muito fácil",
      serves: "4 pessoas",
      meal: "pequeno-almoco",
      tags: ["pequeno-almoco", "rapido", "sazonal", "economico", "vegetariano"],
      ingredients: ["infusao-lucia-lima", "mel-multifloral"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
    {
      id: "ovos-cogumelos",
      name: "Ovos mexidos com cogumelos",
      time: "15 min",
      difficulty: "Fácil",
      serves: "2 pessoas",
      meal: "almoco",
      tags: ["almoco", "rapido", "economico"],
      ingredients: ["ovos-caseiros", "cogumelos-castanhos"],
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80",
      link: "recipes.html",
    },
  ];

  const deliveryZones = [
    { zone: "Zona central", postalCodes: "4785-100 a 4785-199", days: "Seg. a Sáb.", cost: 2.9, min: 15, note: "Entrega no próprio dia" },
    { zone: "Zona próxima", postalCodes: "4780-000 a 4780-999", days: "Seg., Qua. e Sex.", cost: 3.9, min: 20, note: "Entrega no dia seguinte" },
    { zone: "Zona alargada", postalCodes: "4795-000 a 4795-999", days: "Ter. e Sex.", cost: 5.9, min: 25, note: "Ideal para cabazes e encomendas maiores" },
  ];

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const origins = [...new Set(products.map((product) => product.origin))].sort();

  function formatPrice(value) {
    return `${value.toFixed(2).replace(".", ",")} €`;
  }

  function productPriceLabel(product, unitPrice = product.price) {
    if (product.unit === "€") return formatPrice(unitPrice);
    return `${formatPrice(unitPrice)} ${product.unit}`.trim();
  }

  function getProduct(id) {
    return products.find((product) => product.id === id);
  }

  function getRecipe(id) {
    return recipes.find((recipe) => recipe.id === id);
  }

  function setActiveNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === page) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initMobileNavigation() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initGlobalSearch() {
    document.querySelectorAll("[data-global-search]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const search = String(formData.get("search") || "").trim();
        const url = search ? `shop.html?search=${encodeURIComponent(search)}` : "shop.html";
        window.location.href = url;
      });
    });
  }

  function renderProductCard(product) {
    return `
      <article class="product-card reveal">
        ${product.promo ? `<span class="promotion-badge">${product.promo.label}</span>` : ""}
        ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
        <a href="${product.detailLink || "shop.html"}">
          <img src="${product.image}" alt="${product.name}" width="900" height="1125" loading="lazy" />
        </a>
        <div>
          <div class="product-meta"><span>${product.category}</span><span>${product.origin}</span></div>
          <h3><a href="${product.detailLink || "shop.html"}">${product.name}</a></h3>
          <p>${product.producer}</p>
        </div>
        <div class="product-price">
          <strong>${productPriceLabel(product)}</strong>
          ${product.promo ? `<span class="price-before">${productPriceLabel(product, product.promo.oldPrice)}</span>` : ""}
        </div>
        <div class="product-card-footer">
          <span class="status-pill ${product.availabilityClass}">${product.availability}</span>
          <button class="btn btn-secondary" type="button" data-add-to-cart="${product.id}">Adicionar</button>
        </div>
      </article>
    `;
  }

  function renderRecipeCard(recipe) {
    return `
      <article class="recipe-card reveal">
        <a href="${recipe.link}">
          <img src="${recipe.image}" alt="${recipe.name}" width="900" height="1125" loading="lazy" />
        </a>
        <div class="recipe-meta"><span>${recipe.time}</span><span>${recipe.difficulty}</span><span>${recipe.serves}</span></div>
        <h3><a href="${recipe.link}">${recipe.name}</a></h3>
        <p>${recipe.tags.includes("sazonal") ? "Receita sazonal ligada à banca da semana." : "Sugestão prática para o dia a dia."}</p>
      </article>
    `;
  }

  function renderPromoCard(product) {
    if (!product.promo) return "";

    return `
      <article class="promo-card reveal">
        <span class="promotion-badge">${product.promo.label}</span>
        <img src="${product.image}" alt="${product.name}" width="900" height="1125" loading="lazy" />
        <div class="product-meta"><span>${product.category}</span><span>${product.origin}</span></div>
        <h3>${product.name}</h3>
        <p>${product.producer}</p>
        <div class="product-price">
          <strong>${productPriceLabel(product)}</strong>
          <span class="price-before">${productPriceLabel(product, product.promo.oldPrice)}</span>
        </div>
        <p>Poupança: ${product.promo.savings} · Validade: ${product.promo.validUntil}</p>
        <div class="promo-card-footer">
          <span class="status-pill ${product.availabilityClass}">${product.promo.stock}</span>
          <button class="btn btn-secondary" type="button" data-add-to-cart="${product.id}">Adicionar</button>
        </div>
      </article>
    `;
  }

  function renderBaskets() {
    const grid = document.querySelector("[data-basket-grid]");
    if (!grid) return;

    grid.innerHTML = baskets
      .map(
        (basket) => `
        <article class="basket-card reveal">
          <img src="${basket.image}" alt="${basket.name}" width="900" height="1125" loading="lazy" />
          <h3>${basket.name}</h3>
          <p>${basket.description}</p>
          <div class="product-meta"><span>${basket.people}</span><span>${basket.frequency}</span></div>
          <p><strong>${basket.price}</strong></p>
          <p>${basket.includes}</p>
          <p>${basket.custom}</p>
          <a class="btn btn-secondary" href="contact.html">Pedir personalização</a>
        </article>
      `,
      )
      .join("");
  }

  function renderProducers() {
    const grid = document.querySelector("[data-producer-grid]");
    if (!grid) return;

    grid.innerHTML = producers
      .slice(0, 4)
      .map(
        (producer) => `
        <article class="producer-feature reveal">
          <img src="${producer.image}" alt="${producer.name}" width="900" height="1125" loading="lazy" />
          <div class="product-meta"><span>${producer.location}</span><span>${producer.distance}</span></div>
          <h3>${producer.name}</h3>
          <p><strong>${producer.specialty}</strong></p>
          <blockquote>${producer.story}</blockquote>
        </article>
      `,
      )
      .join("");
  }

  function renderHomePageCollections() {
    const featuredGrid = document.querySelector('[data-product-grid="featured"]');
    if (featuredGrid) featuredGrid.innerHTML = products.slice(0, 8).map(renderProductCard).join("");

    const promoGrid = document.querySelector('[data-promo-grid="home"]');
    if (promoGrid) promoGrid.innerHTML = products.filter((product) => product.promo).slice(0, 4).map(renderPromoCard).join("");

    const recipeGrid = document.querySelector('[data-recipe-grid="home"]');
    if (recipeGrid) recipeGrid.innerHTML = recipes.slice(0, 3).map(renderRecipeCard).join("");

    renderBaskets();
    renderProducers();
  }

  function populateSelect(select, options, placeholder) {
    if (!select) return;
    const currentOptions = options.map((option) => `<option value="${option}">${option}</option>`).join("");
    select.innerHTML = `<option value="">${placeholder}</option>${currentOptions}`;
  }

  function initShopFilters() {
    const grid = document.querySelector('[data-product-grid="shop"]');
    const form = document.querySelector("[data-shop-filters]");
    const sortSelect = document.querySelector("[data-shop-sort]");
    const count = document.querySelector("[data-shop-count]");

    if (!grid || !form || !sortSelect || !count) return;

    populateSelect(document.getElementById("shop-category"), categories, "Todas");
    populateSelect(document.getElementById("shop-origin"), origins, "Todas");

    const initialSearch = new URLSearchParams(window.location.search).get("search") || "";
    const searchField = form.querySelector('input[name="search"]');
    if (searchField) searchField.value = initialSearch;

    const filterAndRender = () => {
      const formData = new FormData(form);
      const search = String(formData.get("search") || "").trim().toLowerCase();
      const category = String(formData.get("category") || "");
      const origin = String(formData.get("origin") || "");
      const priceRange = String(formData.get("price") || "");
      const sortValue = sortSelect.value;
      const checks = {
        promotion: formData.get("promotion") === "on",
        organic: formData.get("organic") === "on",
        glutenFree: formData.get("glutenFree") === "on",
        vegetarian: formData.get("vegetarian") === "on",
        available: formData.get("available") === "on",
      };

      let filtered = products.filter((product) => {
        const matchesSearch = !search || `${product.name} ${product.category} ${product.origin} ${product.producer}`.toLowerCase().includes(search);
        const matchesCategory = !category || product.category === category;
        const matchesOrigin = !origin || product.origin === origin;
        const matchesPromotion = !checks.promotion || Boolean(product.promo);
        const matchesOrganic = !checks.organic || product.organic;
        const matchesGlutenFree = !checks.glutenFree || product.glutenFree;
        const matchesVegetarian = !checks.vegetarian || product.vegetarian;
        const matchesAvailable = !checks.available || product.availability === "Disponível";
        const matchesPrice =
          !priceRange ||
          (() => {
            const [min, max] = priceRange.split("-").map(Number);
            return product.price >= min && product.price <= max;
          })();

        return (
          matchesSearch &&
          matchesCategory &&
          matchesOrigin &&
          matchesPromotion &&
          matchesOrganic &&
          matchesGlutenFree &&
          matchesVegetarian &&
          matchesAvailable &&
          matchesPrice
        );
      });

      filtered = filtered.sort((left, right) => {
        if (sortValue === "price-asc") return left.price - right.price;
        if (sortValue === "price-desc") return right.price - left.price;
        if (sortValue === "name") return left.name.localeCompare(right.name, "pt");
        if (sortValue === "recent") return Number(right.recent) - Number(left.recent);
        return Number(Boolean(right.promo)) - Number(Boolean(left.promo));
      });

      grid.innerHTML = filtered.map(renderProductCard).join("");
      count.textContent = `${filtered.length} produtos`;
    };

    form.addEventListener("input", filterAndRender);
    sortSelect.addEventListener("change", filterAndRender);
    filterAndRender();
  }

  function renderProductDetail() {
    const container = document.querySelector("[data-product-detail]");
    if (!container) return;

    const product = getProduct(container.dataset.productDetail);
    if (!product) return;

    const producer = producers.find((item) => item.id === product.producerId);

    container.innerHTML = `
      <div class="detail-stack reveal">
        <div class="detail-gallery">
          <img class="detail-main-image" src="${product.gallery[0]}" alt="${product.name}" width="1200" height="750" data-detail-main-image />
          <div class="thumb-grid">
            ${product.gallery
              .map(
                (image, index) => `
                <button type="button" data-gallery-thumb="${image}" aria-label="Ver imagem ${index + 1}">
                  <img src="${image}" alt="${product.name} detalhe ${index + 1}" width="400" height="400" loading="lazy" />
                </button>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="detail-stack reveal">
        <div class="detail-card">
          <span class="tag">${product.tag || "Produto fresco"}</span>
          <h2>${product.name}</h2>
          <div class="product-meta"><span>${product.origin}</span><span>${product.producer}</span><span class="status-pill ${product.availabilityClass}">${product.availability}</span></div>
          <div class="product-price"><strong>${productPriceLabel(product)}</strong>${product.promo ? `<span class="price-before">${productPriceLabel(product, product.promo.oldPrice)}</span>` : ""}</div>
          <p>${product.description}</p>
          <label for="detail-unit">Unidade</label>
          <select class="select" id="detail-unit" data-detail-unit>
            ${product.orderOptions.map((option) => `<option value="${option.multiplier}">${option.label}</option>`).join("")}
          </select>
          <div class="control-inline">
            <div class="quantity-control" data-quantity-control>
              <button type="button" data-quantity-action="decrease">-</button>
              <input type="number" value="1" min="1" max="20" data-quantity-input aria-label="Quantidade" />
              <button type="button" data-quantity-action="increase">+</button>
            </div>
            <button class="btn btn-primary" type="button" data-add-detail-to-cart="${product.id}">Adicionar ao carrinho</button>
          </div>
          <p class="message" data-detail-message aria-live="polite"></p>
        </div>
        <div class="detail-card">
          <h3>Sabor e utilização</h3>
          <p>${product.flavor}</p>
          <h3>Conservação</h3>
          <p>${product.storage}</p>
          <h3>Produtor</h3>
          <p>${producer ? `${producer.name}, ${producer.location}. ${producer.story}` : product.producer}</p>
          <h3>Entrega</h3>
          <p>Entrega local em 24 horas ou recolha em loja no próprio dia.</p>
        </div>
        <div class="detail-card">
          <h3>Informação nutricional indicativa</h3>
          <div class="nutrition-grid">
            ${product.nutrition.map(([label, value]) => `<p><strong>${label}</strong><br />${value}</p>`).join("")}
          </div>
          <p><a class="inline-link" href="recipe-detail.html">Ver receita sugerida com este produto</a></p>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const mainImage = container.querySelector("[data-detail-main-image]");
        if (mainImage) mainImage.setAttribute("src", thumb.dataset.galleryThumb || "");
      });
    });
  }

  function initPromotions() {
    const grid = document.querySelector('[data-promo-grid="all"]');
    const filterSelect = document.querySelector("[data-promo-filter]");
    if (!grid || !filterSelect) return;

    populateSelect(filterSelect, categories, "Todas");

    const render = () => {
      const value = filterSelect.value;
      const items = products.filter((product) => product.promo && (!value || product.category === value));
      grid.innerHTML = items.map(renderPromoCard).join("");
    };

    filterSelect.addEventListener("change", render);
    render();
  }

  function initRecipes() {
    const grid = document.querySelector('[data-recipe-grid="all"]');
    const form = document.querySelector("[data-recipe-filters]");
    const count = document.querySelector("[data-recipe-count]");

    if (!grid || !form || !count) return;

    const render = () => {
      const data = new FormData(form);
      const search = String(data.get("search") || "").trim().toLowerCase();
      const activeTags = [...data.keys()].filter((key) => key !== "search");
      const filtered = recipes.filter((recipe) => {
        const matchesSearch = !search || `${recipe.name} ${recipe.tags.join(" ")}`.toLowerCase().includes(search);
        const matchesTags = !activeTags.length || activeTags.every((tag) => recipe.tags.includes(tag));
        return matchesSearch && matchesTags;
      });

      grid.innerHTML = filtered.map(renderRecipeCard).join("");
      count.textContent = `${filtered.length} receitas`;
    };

    form.addEventListener("input", render);
    render();
  }

  function renderRecipeDetail() {
    const container = document.querySelector("[data-recipe-detail]");
    if (!container) return;

    const recipe = getRecipe(container.dataset.recipeDetail);
    if (!recipe) return;

    const productCards = recipe.ingredients
      .map((id) => getProduct(id))
      .filter(Boolean)
      .map(
        (product) => `
        <div class="summary-line">
          <span>${product.name}</span>
          <strong>${productPriceLabel(product)}</strong>
        </div>
      `,
      )
      .join("");

    container.innerHTML = `
      <div class="detail-stack reveal">
        <img class="detail-main-image" src="${recipe.image}" alt="${recipe.name}" width="1200" height="750" />
      </div>
      <div class="detail-stack reveal">
        <div class="detail-card">
          <div class="product-meta"><span>${recipe.time}</span><span>${recipe.difficulty}</span><span>${recipe.serves}</span></div>
          <p>${recipe.intro}</p>
          <button class="btn btn-primary" type="button" data-add-recipe-ingredients="${recipe.id}">Adicionar ingredientes ao carrinho</button>
          <p class="message" data-recipe-message aria-live="polite"></p>
        </div>
        <div class="detail-card">
          <h3>Ingredientes</h3>
          <ul class="ingredient-list">
            ${recipe.ingredientList.map((ingredient) => `<li>${ingredient}</li>`).join("")}
          </ul>
          <div>${productCards}</div>
        </div>
        <div class="detail-card">
          <h3>Passos</h3>
          <ol class="step-list">
            ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
          <h3>Dicas</h3>
          <p>${recipe.tips}</p>
          <h3>Conservação</h3>
          <p>${recipe.storage}</p>
          <h3>Informação nutricional indicativa</h3>
          <p>${recipe.nutrition}</p>
        </div>
      </div>
    `;

    const relatedGrid = document.querySelector('[data-recipe-grid="related"]');
    if (relatedGrid) {
      relatedGrid.innerHTML = recipe.related.map(getRecipe).filter(Boolean).map(renderRecipeCard).join("");
    }
  }

  function renderDeliveryZones() {
    const container = document.querySelector("[data-delivery-zones]");
    if (!container) return;

    container.innerHTML = deliveryZones
      .map(
        (zone) => `
        <article class="info-panel reveal">
          <h3>${zone.zone}</h3>
          <p><strong>Códigos postais</strong> · ${zone.postalCodes}</p>
          <p><strong>Dias</strong> · ${zone.days}</p>
          <p><strong>Mínimo</strong> · ${formatPrice(zone.min)}</p>
          <p><strong>Custo</strong> · ${formatPrice(zone.cost)}</p>
          <p>${zone.note}</p>
        </article>
      `,
      )
      .join("");
  }

  function getStoredCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function getStoredPromo() {
    return localStorage.getItem(PROMO_KEY) || "";
  }

  function savePromo(code) {
    localStorage.setItem(PROMO_KEY, code);
  }

  function getDeliveryMode() {
    return localStorage.getItem(DELIVERY_MODE_KEY) || "delivery";
  }

  function saveDeliveryMode(mode) {
    localStorage.setItem(DELIVERY_MODE_KEY, mode);
  }

  function cartCount(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function updateCartCounters() {
    const cart = getStoredCart();
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = String(cartCount(cart));
    });
  }

  function addToCart(productId, quantity = 1, multiplier = 1, variantLabel = "") {
    const product = getProduct(productId);
    if (!product) return false;

    const cart = getStoredCart();
    const unitPrice = Number((product.price * multiplier).toFixed(2));
    const label = variantLabel || product.unit;
    const existing = cart.find((item) => item.id === productId && item.variantLabel === label);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        quantity,
        variantLabel: label,
        unitPrice,
      });
    }

    saveCart(cart);
    updateCartCounters();
    return true;
  }

  function removeFromCart(productId, variantLabel) {
    const next = getStoredCart().filter((item) => !(item.id === productId && item.variantLabel === variantLabel));
    saveCart(next);
    updateCartCounters();
  }

  function updateCartItem(productId, variantLabel, quantity) {
    const cart = getStoredCart();
    const item = cart.find((entry) => entry.id === productId && entry.variantLabel === variantLabel);
    if (!item) return;
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
    updateCartCounters();
  }

  function initAddToCartButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-cart]");
      if (!button) return;

      const added = addToCart(button.dataset.addToCart);
      if (!added) return;

      button.textContent = "Adicionado";
      window.setTimeout(() => {
        button.textContent = "Adicionar";
      }, 1200);
    });
  }

  function initQuantityControls(scope = document) {
    scope.querySelectorAll("[data-quantity-control]").forEach((control) => {
      const input = control.querySelector("[data-quantity-input]");
      if (!input) return;

      control.addEventListener("click", (event) => {
        const action = event.target.closest("[data-quantity-action]")?.dataset.quantityAction;
        if (!action) return;
        const current = Number(input.value) || 1;
        input.value = String(action === "increase" ? current + 1 : Math.max(1, current - 1));
      });
    });
  }

  function initProductDetailActions() {
    const button = document.querySelector("[data-add-detail-to-cart]");
    if (!button) return;

    initQuantityControls(document);

    button.addEventListener("click", () => {
      const quantity = Number(document.querySelector("[data-quantity-input]")?.value || 1);
      const unitSelect = document.querySelector("[data-detail-unit]");
      const multiplier = Number(unitSelect?.value || 1);
      const label = unitSelect?.selectedOptions[0]?.textContent || "";
      addToCart(button.dataset.addDetailToCart, quantity, multiplier, label);

      const message = document.querySelector("[data-detail-message]");
      if (message) {
        message.textContent = "Produto adicionado ao carrinho.";
        message.className = "message is-success";
      }
    });
  }

  function calculateCartSummary(cart, mode, promoCode) {
    const subtotal = cart.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    const delivery = mode === "pickup" ? 0 : subtotal >= 35 ? 0 : subtotal >= 20 ? 3.9 : subtotal > 0 ? 5.9 : 0;
    let discount = 0;

    if (promoCode === "MERCEARIA10" && subtotal >= 35) {
      discount = subtotal * 0.1;
    }
    if (promoCode === "VERAO5" && subtotal >= 25) {
      discount = 5;
    }

    const total = Math.max(0, subtotal + delivery - discount);
    return { subtotal, delivery, discount, total };
  }

  function renderCart() {
    const container = document.querySelector("[data-cart-items]");
    if (!container) return;

    const cart = getStoredCart();
    if (!cart.length) {
      container.innerHTML = `<p>O carrinho está vazio. <a class="inline-link" href="shop.html">Voltar à loja</a>.</p>`;
      updateCartSummary();
      return;
    }

    container.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.id);
        if (!product) return "";

        return `
          <article class="cart-item">
            <img src="${product.image}" alt="${product.name}" width="220" height="220" loading="lazy" />
            <div class="cart-item-meta">
              <h3>${product.name}</h3>
              <p>${item.variantLabel}</p>
              <div class="quantity-control" data-cart-control data-product-id="${product.id}" data-variant-label="${item.variantLabel}">
                <button type="button" data-cart-quantity="decrease">-</button>
                <input type="number" value="${item.quantity}" min="1" data-cart-input />
                <button type="button" data-cart-quantity="increase">+</button>
              </div>
              <button class="btn btn-ghost" type="button" data-remove-cart="${product.id}" data-variant-label="${item.variantLabel}">Remover</button>
            </div>
            <div class="price-stack">
              <span>${formatPrice(item.unitPrice)}</span>
              <strong>${formatPrice(item.quantity * item.unitPrice)}</strong>
            </div>
          </article>
        `;
      })
      .join("");

    updateCartSummary();
  }

  function updateCartSummary() {
    const subtotalNode = document.querySelector("[data-summary-subtotal]");
    const deliveryNode = document.querySelector("[data-summary-delivery]");
    const discountNode = document.querySelector("[data-summary-discount]");
    const totalNode = document.querySelector("[data-summary-total]");
    if (!subtotalNode || !deliveryNode || !discountNode || !totalNode) return;

    const mode = getDeliveryMode();
    const promoCode = getStoredPromo();
    const summary = calculateCartSummary(getStoredCart(), mode, promoCode);

    subtotalNode.textContent = formatPrice(summary.subtotal);
    deliveryNode.textContent = formatPrice(summary.delivery);
    discountNode.textContent = formatPrice(summary.discount);
    totalNode.textContent = formatPrice(summary.total);
  }

  function initCartPage() {
    const cartRoot = document.querySelector("[data-cart-items]");
    if (!cartRoot) return;

    document.querySelectorAll('input[name="deliveryMode"]').forEach((input) => {
      input.checked = input.value === getDeliveryMode();
      input.addEventListener("change", () => {
        saveDeliveryMode(input.value);
        updateCartSummary();
      });
    });

    const promoInput = document.querySelector("[data-promo-code]");
    if (promoInput) promoInput.value = getStoredPromo();

    renderCart();

    cartRoot.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-cart]");
      if (removeButton) {
        removeFromCart(removeButton.dataset.removeCart, removeButton.dataset.variantLabel || "");
        renderCart();
      }

      const quantityAction = event.target.closest("[data-cart-quantity]");
      if (quantityAction) {
        const control = event.target.closest("[data-cart-control]");
        const input = control?.querySelector("[data-cart-input]");
        if (!control || !input) return;
        const current = Number(input.value) || 1;
        const next = quantityAction.dataset.cartQuantity === "increase" ? current + 1 : Math.max(1, current - 1);
        input.value = String(next);
        updateCartItem(control.dataset.productId || "", control.dataset.variantLabel || "", next);
        renderCart();
      }
    });

    cartRoot.addEventListener("change", (event) => {
      const input = event.target.closest("[data-cart-input]");
      if (!input) return;
      const control = event.target.closest("[data-cart-control]");
      if (!control) return;
      updateCartItem(control.dataset.productId || "", control.dataset.variantLabel || "", Math.max(1, Number(input.value) || 1));
      renderCart();
    });

    const applyPromo = document.querySelector("[data-apply-promo]");
    const promoMessage = document.querySelector("[data-promo-message]");
    if (applyPromo && promoInput && promoMessage) {
      applyPromo.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        const valid = ["MERCEARIA10", "VERAO5"].includes(code);
        savePromo(valid ? code : "");
        promoMessage.textContent = valid ? "Código aplicado com sucesso." : "Código inválido para esta simulação.";
        promoMessage.className = `message ${valid ? "is-success" : "is-error"}`;
        updateCartSummary();
      });
    }

    const checkoutForm = document.querySelector("[data-checkout-form]");
    checkoutForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = checkoutForm.querySelector("[data-form-message]");
      if (!validateForm(checkoutForm, message)) return;
      if (!getStoredCart().length) {
        if (message) {
          message.textContent = "Adicione produtos ao carrinho antes de confirmar.";
          message.className = "message is-error";
        }
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROMO_KEY);
      renderCart();
      updateCartCounters();
      if (message) {
        message.textContent = "Encomenda simulada com sucesso. Entraremos em contacto para confirmação.";
        message.className = "message is-success";
      }
      checkoutForm.reset();
    });
  }

  function initDeliveryChecker() {
    const form = document.querySelector("[data-delivery-checker]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="postalCode"]');
      const message = form.querySelector("[data-delivery-message]");
      const value = String(input?.value || "").trim();
      const isValid = /^\d{4}-\d{3}$/.test(value);

      if (!message) return;

      if (!isValid) {
        message.textContent = "Introduza um código postal no formato 0000-000.";
        message.className = "message is-error";
        return;
      }

      const prefix = Number(value.slice(0, 4));
      const zone =
        (prefix >= 4785 && prefix <= 4785 && deliveryZones[0]) ||
        (prefix >= 4780 && prefix <= 4780 && deliveryZones[1]) ||
        (prefix >= 4795 && prefix <= 4795 && deliveryZones[2]);

      if (zone) {
        message.textContent = `Existe entrega para esta zona: ${zone.zone}. Próximo dia disponível: ${zone.days}. Custo estimado: ${formatPrice(zone.cost)}.`;
        message.className = "message is-success";
      } else {
        message.textContent = "De momento não fazemos entrega nessa zona. Pode optar por recolha em loja sem custo.";
        message.className = "message is-error";
      }
    });
  }

  function validateForm(form, messageNode) {
    const requiredFields = [...form.querySelectorAll("[required]")];

    for (const field of requiredFields) {
      const value = field.type === "checkbox" ? field.checked : String(field.value).trim();
      if (!value) {
        if (messageNode) {
          messageNode.textContent = "Preencha todos os campos obrigatórios.";
          messageNode.className = "message is-error";
        }
        field.focus();
        return false;
      }

      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(field.value).trim())) {
        if (messageNode) {
          messageNode.textContent = "Introduza um email válido.";
          messageNode.className = "message is-error";
        }
        field.focus();
        return false;
      }
    }

    return true;
  }

  function initForms() {
    document.querySelectorAll("[data-contact-form], [data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = form.querySelector("[data-form-message]");
        if (!validateForm(form, message)) return;
        form.reset();
        if (message) {
          message.textContent =
            form.hasAttribute("data-newsletter-form")
              ? "Subscrição registada. Vai receber a próxima seleção semanal."
              : "Mensagem enviada com sucesso. Respondemos durante o horário da loja.";
          message.className = "message is-success";
        }
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-toggle");
      if (!button) return;
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        item.classList.toggle("is-open", !expanded);
      });
    });
  }

  function initRecipeIngredientButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-recipe-ingredients]");
      if (!button) return;
      const recipe = getRecipe(button.dataset.addRecipeIngredients);
      const message = document.querySelector("[data-recipe-message]");
      if (!recipe) return;

      recipe.ingredients.forEach((ingredientId) => addToCart(ingredientId, 1));
      if (message) {
        message.textContent = "Ingredientes adicionados ao carrinho.";
        message.className = "message is-success";
      }
    });
  }

  function renderRelatedProducts() {
    const grid = document.querySelector('[data-product-grid="related"]');
    if (!grid) return;
    const main = getProduct("tomate-coracao-de-boi");
    if (!main) return;
    grid.innerHTML = main.related.map(getProduct).filter(Boolean).map(renderProductCard).join("");
  }

  function initRevealAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  function initAll() {
    setActiveNavigation();
    initMobileNavigation();
    initHeaderScroll();
    initGlobalSearch();
    renderHomePageCollections();
    initShopFilters();
    renderProductDetail();
    renderRelatedProducts();
    initPromotions();
    initCartPage();
    renderDeliveryZones();
    initDeliveryChecker();
    initRecipes();
    renderRecipeDetail();
    initForms();
    initAccordions();
    initAddToCartButtons();
    initProductDetailActions();
    initRecipeIngredientButtons();
    updateCartCounters();
    initRevealAnimations();
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();
