(() => {
  "use strict";

  const CART_KEY = "maison-albor-cart";
  const FAVORITES_KEY = "maison-albor-favorites";
  const PROMO_KEY = "maison-albor-promo";
  const FREE_SHIPPING_FROM = 150;
  const SHIPPING_FEE = 6.9;
  const VAT_RATE = 0.23;
  const PROMO_CODES = { ALBOR10: { rate: 0.1, label: "10% de desconto" } };
  const SORTS = {
    relevancia: () => 0,
    "preco-asc": (a, b) => a.price - b.price,
    "preco-desc": (a, b) => b.price - a.price,
    nome: (a, b) => a.name.localeCompare(b.name, "pt"),
    novidades: (a, b) => b.createdAt.localeCompare(a.createdAt),
  };
  const PRICE_RANGES = {
    "": () => true,
    "ate-60": (price) => price < 60,
    "60-200": (price) => price >= 60 && price <= 200,
    "acima-200": (price) => price > 200,
  };
  const PRICE_LABELS = { "": "Todos os preços", "ate-60": "Até 60 €", "60-200": "60 € a 200 €", "acima-200": "Acima de 200 €" };

  const PHOTOS = {
    luz: "1600607687920-4e2a09cf159d",
    cozinha: "1618221195710-dd6b41faaea6",
    madeira: "1590490360182-c33d57733427",
    atelier: "1508214751196-bcfd4ca60f91",
    betao: "1513694203232-719a280e022f",
    textura: "1584132967334-10e028bd69f7",
    casa: "1600585154340-be6161a56a0c",
    madeiraClara: "1600566753190-17f0baa2a6c3",
    quarto: "1582719508461-905c673771fd",
    cama: "1618773928121-c32242e63f39",
    lareira: "1600334129128-685c5582fd35",
    velas: "1544367567-0f2fcb009e0b",
    livros: "1503676260728-1c00da094a0b",
    pedra: "1510812431401-41d2bd2722f3",
    prateleira: "1518843875459-f738682238a6",
    rustico: "1566665797739-1674de7a421a",
  };
  const photo = (key, width) => `https://images.unsplash.com/photo-${PHOTOS[key]}?auto=format&fit=crop&w=${width}&q=80`;
  const shot = (key, alt) => ({ src: photo(key, 1200), thumb: photo(key, 320), alt });

  const categories = [
    { id: "iluminacao", label: "Iluminação", image: photo("luz", 1000), text: "Luz indireta para cada divisão." },
    { id: "mobiliario", label: "Mobiliário", image: photo("madeira", 1000), text: "Madeira, tecido e linhas tranquilas." },
    { id: "texteis", label: "Têxteis", image: photo("cama", 1000), text: "Linho, algodão e mantas para o inverno." },
    { id: "ceramica", label: "Cerâmica", image: photo("textura", 1000), text: "Grés e argila feitos à mão." },
    { id: "mesa", label: "Mesa e cozinha", image: photo("cozinha", 1000), text: "Vidro soprado e madeira para partilhar." },
  ];

  const products = [
    {
      id: "candeeiro-arco-lumen",
      name: "Candeeiro de arco Lúmen",
      category: "iluminacao",
      price: 289,
      createdAt: "2026-10-14",
      stock: 6,
      summary: "Haste em aço e cúpula de linho cru para uma luz suave sobre a mesa de jantar.",
      description: "Desenhado para pairar sobre a mesa ou o sofá, o arco reparte a luz de forma uniforme. A cúpula de linho difunde o brilho sem ofuscar.",
      materials: "Aço com acabamento escovado, cúpula de linho cru e base em mármore.",
      dimensions: "Altura 210 cm · Alcance 120 cm · 2,6 kg",
      images: [shot("luz", "Candeeiro de arco com cúpula de linho sobre uma mesa de jantar"), shot("lareira", "Candeeiro de arco junto a uma lareira"), shot("rustico", "Pormenor da base em mármore do candeeiro")],
      options: [
        { id: "acabamento", label: "Acabamento", values: [
          { id: "latao", label: "Latão escovado", delta: 0, swatch: "#b8975a" },
          { id: "preto", label: "Preto mate", delta: 0, swatch: "#1d1b18" },
          { id: "niquel", label: "Níquel", delta: 30, swatch: "#b9bcbf" },
        ] },
      ],
    },
    {
      id: "aplique-travertino",
      name: "Aplique Travertino",
      category: "iluminacao",
      price: 148,
      createdAt: "2026-09-20",
      stock: 14,
      summary: "Disco de travertino natural com luz indireta, pensado para corredores e cabeceiras.",
      description: "A pedra deixa passar uma luz quente e irregular. Cada peça tem veios próprios, por isso nenhum aplique é igual ao outro.",
      materials: "Travertino natural, estrutura em latão e cablagem certificada.",
      dimensions: "Diâmetro 20 cm ou 35 cm · Profundidade 9 cm",
      images: [shot("pedra", "Aplique de travertino com luz indireta numa parede clara"), shot("quarto", "Aplique junto à cabeceira de uma cama"), shot("velas", "Luz quente de um aplique de pedra")],
      options: [
        { id: "medida", label: "Medida", values: [
          { id: "pequeno", label: "Ø 20 cm", delta: 0 },
          { id: "grande", label: "Ø 35 cm", delta: 60 },
        ] },
      ],
    },
    {
      id: "luminaria-washi",
      name: "Luminária Washi",
      category: "iluminacao",
      price: 84,
      createdAt: "2026-08-05",
      stock: 0,
      summary: "Papel washi sobre armação de bambu, para uma luz difusa e leve.",
      description: "Papel japonês de fibra longa que filtra a luz sem pesar. Ideal para dias de chuva e para acompanhar uma leitura.",
      materials: "Papel washi, armação de bambu e cabo de algodão.",
      dimensions: "Diâmetro 45 cm · Altura 30 cm",
      images: [shot("velas", "Luminária de papel washi acesa"), shot("livros", "Luminária de papel junto a um livro aberto"), shot("prateleira", "Luminária de papel numa prateleira")],
      options: [
        { id: "cor", label: "Cor", values: [
          { id: "areia", label: "Areia", delta: 0, swatch: "#d9c9a8" },
          { id: "carvao", label: "Carvão", delta: 0, swatch: "#3a3733" },
        ] },
      ],
    },
    {
      id: "cadeira-freixo",
      name: "Cadeira Freixo",
      category: "mobiliario",
      price: 390,
      compareAt: 430,
      createdAt: "2026-07-11",
      stock: 4,
      featured: true,
      summary: "Assento moldado em freixo maciço, com encosto ligeiramente inclinado para jantares longos.",
      description: "Trabalhada à mão numa oficina de Guimarães, a cadeira combina a leveza do freixo com um encosto que acompanha as costas sem as prender.",
      materials: "Freixo maciço, assento em palha vienense ou linho cru.",
      dimensions: "Largura 52 cm · Profundidade 50 cm · Altura 80 cm · 4,8 kg",
      images: [shot("madeira", "Cadeira de freixo junto a uma mesa de madeira"), shot("madeiraClara", "Pormenor do encosto de freixo"), shot("atelier", "Cadeira de freixo no atelier")],
      options: [
        { id: "acabamento", label: "Acabamento", values: [
          { id: "natural", label: "Freixo natural", delta: 0 },
          { id: "fumado", label: "Freixo fumado", delta: 40 },
        ] },
        { id: "assento", label: "Assento", values: [
          { id: "palha", label: "Palha vienense", delta: 0 },
          { id: "linho", label: "Linho cru", delta: 55 },
        ] },
      ],
    },
    {
      id: "mesa-lateral-carvalho",
      name: "Mesa lateral Carvalho",
      category: "mobiliario",
      price: 240,
      createdAt: "2026-10-28",
      stock: 9,
      summary: "Mesa de apoio em carvalho maciço com tampo de bordo arredondado.",
      description: "Pensada para ao lado do sofá ou da cama. O tampo de bordo arredondado é fácil de tocar e envelhece com a patine da madeira.",
      materials: "Carvão maciço, óleo natural ou óleo de nogueira.",
      dimensions: "Tampo Ø 40 ou 55 cm · Altura 50 cm",
      images: [shot("madeiraClara", "Mesa lateral de carvalho junto a uma janela"), shot("rustico", "Mesa de carvalho com um vaso"), shot("quarto", "Mesa lateral ao lado de uma cama")],
      options: [
        { id: "acabamento", label: "Acabamento", values: [
          { id: "natural", label: "Carvalho natural", delta: 0 },
          { id: "nogueira", label: "Nogueira tingida", delta: 20 },
        ] },
        { id: "tamanho", label: "Tamanho", values: [
          { id: "40", label: "Ø 40 cm", delta: 0 },
          { id: "55", label: "Ø 55 cm", delta: 40 },
        ] },
      ],
    },
    {
      id: "banco-duna",
      name: "Banco Duna",
      category: "mobiliario",
      price: 520,
      createdAt: "2026-06-02",
      stock: 2,
      summary: "Banco baixo estofado, de linhas suaves, para entradas e quartos.",
      description: "Espuma de alta densidade com um revestimento que aguenta o uso diário. Serve de assento, de apoio para malas ou de mesa de apoio.",
      materials: "Estrutura em madeira de faia, espuma de alta densidade e tecido técnico.",
      dimensions: "Comprimento 120 cm · Profundidade 42 cm · Altura 40 cm",
      images: [shot("cama", "Banco estofado junto a uma cama"), shot("casa", "Banco estofado em sala ampla"), shot("textura", "Pormenor do tecido do banco")],
      options: [
        { id: "tecido", label: "Tecido", values: [
          { id: "bouclé", label: "Bouclé creme", delta: 0 },
          { id: "veludo", label: "Veludo musgo", delta: 60 },
        ] },
      ],
    },
    {
      id: "manta-linho",
      name: "Manta de linho lavado",
      category: "texteis",
      price: 118,
      createdAt: "2026-10-05",
      stock: 20,
      summary: "Linho lavado que fica mais macio a cada utilização.",
      description: "Tecida em teares manuais e lavada duas vezes para ganhar caimento. Pode ser usada sobre a cama, no sofá ou como toalha de mesa.",
      materials: "100% linho lavado, bainha costurada à mão.",
      dimensions: "130 × 170 cm ou 180 × 240 cm · Lavar a 30 °C",
      images: [shot("cama", "Manta de linho dobrada sobre uma cama"), shot("quarto", "Manta de linho num quarto com luz natural"), shot("textura", "Pormenor do tecido de linho")],
      options: [
        { id: "cor", label: "Cor", values: [
          { id: "cru", label: "Cru", delta: 0, swatch: "#ece4d3" },
          { id: "carvao", label: "Carvão", delta: 0, swatch: "#3a3733" },
          { id: "argila", label: "Argila", delta: 0, swatch: "#b5806a" },
        ] },
        { id: "medida", label: "Medida", values: [
          { id: "130", label: "130 × 170 cm", delta: 0 },
          { id: "180", label: "180 × 240 cm", delta: 70 },
        ] },
      ],
    },
    {
      id: "almofadas-pedra",
      name: "Almofadas de algodão Pedra",
      category: "texteis",
      price: 64,
      createdAt: "2026-09-01",
      stock: 30,
      summary: "Par de almofadas em algodão grosso, com fecho invisível.",
      description: "Algodão de tear com textura irregular, fácil de lavar. Os tons neutros combinam com quase qualquer sofá.",
      materials: "100% algodão, enchimento de penas e fibra recicladas.",
      dimensions: "45 × 45 cm",
      images: [shot("rustico", "Almofadas de algodão sobre um sofá"), shot("lareira", "Almofadas junto a uma lareira"), shot("cama", "Almofada sobre uma cama")],
      options: [
        { id: "cor", label: "Cor", values: [
          { id: "pedra", label: "Pedra", delta: 0, swatch: "#c9c1b3" },
          { id: "carvao", label: "Carvão", delta: 0, swatch: "#3a3733" },
        ] },
      ],
    },
    {
      id: "vaso-terra",
      name: "Vaso de grés Terra",
      category: "ceramica",
      price: 96,
      createdAt: "2026-08-22",
      stock: 11,
      summary: "Vaso de grés com vidrado mate, modelado à mão em pequenos lotes.",
      description: "Cada vaso sai do forno com uma variação própria de cor. O interior é vidrado, por isso pode levar água sem preocupações.",
      materials: "Grés de alta temperatura com vidrado mate.",
      dimensions: "Diâmetro 18 cm · Altura 38 ou 22 cm",
      images: [shot("textura", "Vaso de grés com vidrado mate"), shot("prateleira", "Vasos de grés numa prateleira"), shot("betao", "Vaso de grés junto a uma parede de betão")],
      options: [
        { id: "vidrado", label: "Vidrado", values: [
          { id: "areia", label: "Areia", delta: 0, swatch: "#d2b48c" },
          { id: "negro", label: "Negro", delta: 0, swatch: "#1d1b18" },
        ] },
        { id: "altura", label: "Altura", values: [
          { id: "alto", label: "Alto · 38 cm", delta: 0 },
          { id: "baixo", label: "Baixo · 22 cm", delta: -10 },
        ] },
      ],
    },
    {
      id: "chavenas-argila",
      name: "Conjunto de chávenas Argila",
      category: "ceramica",
      price: 58,
      createdAt: "2026-10-20",
      stock: 16,
      summary: "Conjunto de quatro chávenas de bordo fino, para café ou chá.",
      description: "Porcelana de pasta de argila com esmalte aveludado. A pega é desenhada para caber no dedo e a base não risca a mesa.",
      materials: "Porcelana de pasta de argila, esmalte aveludado.",
      dimensions: "Capacidade 180 ml · Altura 7 cm · Conjunto de 4 peças",
      images: [shot("cozinha", "Conjunto de chávenas de cerâmica numa mesa"), shot("velas", "Chávena de café com luz quente"), shot("textura", "Pormenor do esmalte das chávenas")],
      options: [
        { id: "cor", label: "Cor", values: [
          { id: "branco", label: "Branco quente", delta: 0, swatch: "#f2ebdd" },
          { id: "terracota", label: "Terracota", delta: 0, swatch: "#a8603f" },
        ] },
      ],
    },
    {
      id: "tabua-nogueira",
      name: "Tábua de nogueira",
      category: "mesa",
      price: 72,
      createdAt: "2026-05-18",
      stock: 12,
      summary: "Tábua de corte em nogueira, com pega lateral e acabamento em óleo.",
      description: "Madeira de topo para não estragar a faca. Basta uma passagem de óleo de vez em quando para manter a cor.",
      materials: "Nogueira de topo, óleo alimentar.",
      dimensions: "30 × 20 cm ou 45 × 30 cm · Espessura 3,5 cm",
      images: [shot("madeiraClara", "Tábua de nogueira sobre a bancada"), shot("cozinha", "Tábua de nogueira numa cozinha"), shot("livros", "Tábua de nogueira ao lado de livros")],
      options: [
        { id: "tamanho", label: "Tamanho", values: [
          { id: "pequena", label: "30 × 20 cm", delta: 0 },
          { id: "grande", label: "45 × 30 cm", delta: 18 },
        ] },
      ],
    },
    {
      id: "copos-soprado",
      name: "Copos de vidro soprado",
      category: "mesa",
      price: 110,
      compareAt: 128,
      createdAt: "2026-09-15",
      stock: 7,
      summary: "Conjunto de copos soprados à boca, com base ligeiramente espessa.",
      description: "Cada copo tem pequenas bolhas e linhas que mostram a mão de quem o soprou. Próprios para vinho ou água.",
      materials: "Vidro soprado à boca, sem chumbo.",
      dimensions: "Capacidade 320 ml · Altura 12 cm",
      images: [shot("velas", "Copos de vidro soprado com luz quente"), shot("cozinha", "Copos de vidro numa mesa posta"), shot("prateleira", "Copos de vidro numa prateleira")],
      options: [
        { id: "tom", label: "Tom", values: [
          { id: "ambar", label: "Âmbar", delta: 0, swatch: "#c57f2c" },
          { id: "transparente", label: "Transparente", delta: 0, swatch: "#e6eef0" },
        ] },
        { id: "quantidade", label: "Conjunto", values: [
          { id: "4", label: "4 copos", delta: 0 },
          { id: "6", label: "6 copos", delta: 40 },
        ] },
      ],
    },
  ];

  const money = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
  const formatPrice = (value) => money.format(value);
  const round = (value) => Math.round(value * 100) / 100;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const productById = (id) => products.find((product) => product.id === id);
  const categoryById = (id) => categories.find((category) => category.id === id);
  const isNew = (product) => product.createdAt >= "2026-10-01";

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Sem armazenamento disponível o estado fica apenas nesta página.
    }
  }

  const statusRegion = document.createElement("p");
  statusRegion.className = "visually-hidden";
  statusRegion.setAttribute("role", "status");
  statusRegion.setAttribute("aria-live", "polite");
  document.body.append(statusRegion);

  function announce(message) {
    statusRegion.textContent = "";
    setTimeout(() => {
      statusRegion.textContent = message;
    }, 50);
  }

  function bump(element) {
    element.classList.remove("bump");
    void element.offsetWidth;
    element.classList.add("bump");
  }

  let cart = (readStorage(CART_KEY, []) || []).filter((item) => productById(item?.id) && Number.isInteger(item.qty) && item.qty > 0);
  let favorites = new Set((readStorage(FAVORITES_KEY, []) || []).filter((id) => productById(id)));
  const storedPromo = readStorage(PROMO_KEY, "");
  let promo = PROMO_CODES[storedPromo] ? storedPromo : "";
  const hooks = { favorites: () => {} };

  const saveCart = () => writeStorage(CART_KEY, cart);

  function selectedValues(product, selection) {
    return (product.options || []).map((group) => ({
      group,
      value: group.values.find((value) => value.id === selection[group.id]) || group.values[0],
    }));
  }

  function defaultSelection(product) {
    return Object.fromEntries((product.options || []).map((group) => [group.id, group.values[0].id]));
  }

  function unitPrice(product, selection) {
    return round(product.price + selectedValues(product, selection).reduce((sum, { value }) => sum + value.delta, 0));
  }

  function describeSelection(product, selection) {
    return selectedValues(product, selection).map(({ group, value }) => `${group.label}: ${value.label}`).join(" · ");
  }

  function lineKey(id, selection) {
    return `${id}?${Object.keys(selection).sort().map((key) => `${key}=${selection[key]}`).join("&")}`;
  }

  function quantityInCart(productId) {
    return cart.filter((item) => item.id === productId).reduce((sum, item) => sum + item.qty, 0);
  }

  function remainingStock(product) {
    return Math.max(0, product.stock - quantityInCart(product.id));
  }

  function addToCart(productId, selection, quantity = 1) {
    const product = productById(productId);
    const available = remainingStock(product);
    if (product.stock === 0) return { ok: false, added: 0, message: `${product.name} está esgotado de momento.` };
    if (available === 0) return { ok: false, added: 0, message: `Já tem no carrinho todas as unidades disponíveis de ${product.name}.` };
    const added = Math.min(quantity, available);
    const key = lineKey(productId, selection);
    const existing = cart.find((item) => lineKey(item.id, item.selection) === key);
    if (existing) existing.qty += added;
    else cart.push({ id: productId, selection: { ...selection }, qty: added });
    saveCart();
    updateCounters();
    return { ok: true, added, clamped: added < quantity, message: `${added} × ${product.name} adicionado ao carrinho.` };
  }

  function cartLines() {
    return cart.map((item, index) => {
      const product = productById(item.id);
      const unit = unitPrice(product, item.selection);
      return { index, product, selection: item.selection, qty: item.qty, unit, total: round(unit * item.qty) };
    });
  }

  function maxLineQuantity(index) {
    const { id, qty } = cart[index];
    const others = cart.reduce((sum, item, position) => (position !== index && item.id === id ? sum + item.qty : sum), 0);
    return Math.max(1, productById(id).stock - others);
  }

  function cartTotals(lines) {
    const subtotal = round(lines.reduce((sum, line) => sum + line.total, 0));
    const discount = round(subtotal * (PROMO_CODES[promo]?.rate || 0));
    const afterDiscount = round(subtotal - discount);
    const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    const total = round(afterDiscount + shipping);
    const vat = round(total - total / (1 + VAT_RATE));
    return { subtotal, discount, shipping, total, vat, afterDiscount };
  }

  function updateCounters() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $$("[data-cart-count]").forEach((element) => {
      if (element.textContent !== String(count)) bump(element);
      element.textContent = count;
    });
    $$("[data-favorite-count]").forEach((element) => {
      element.textContent = favorites.size;
    });
  }

  function updateFavoriteButton(button) {
    const product = productById(button.dataset.id);
    const active = favorites.has(product.id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    const text = button.querySelector("[data-favorite-text]");
    if (text) text.textContent = active ? "Nos favoritos" : "Guardar nos favoritos";
    else button.setAttribute("aria-label", `${active ? "Remover" : "Guardar"} ${product.name} ${active ? "dos" : "nos"} favoritos`);
  }

  function toggleFavorite(id) {
    const product = productById(id);
    const active = !favorites.has(id);
    if (active) favorites.add(id);
    else favorites.delete(id);
    writeStorage(FAVORITES_KEY, [...favorites]);
    $$(`[data-favorite][data-id="${id}"]`).forEach(updateFavoriteButton);
    announce(active ? `${product.name} guardado nos favoritos.` : `${product.name} removido dos favoritos.`);
    updateCounters();
    hooks.favorites();
  }

  const heartIcon = () => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1z"/></svg>';

  function priceMarkup(product, price = product.price) {
    const old = product.compareAt ? `<s><span class="visually-hidden">Preço anterior </span>${formatPrice(product.compareAt)}</s> ` : "";
    return `${old}<span class="price-current">${formatPrice(price)}</span>`;
  }

  function productCard(product) {
    const id = escapeHtml(product.id);
    const name = escapeHtml(product.name);
    const active = favorites.has(product.id);
    const soldOut = product.stock === 0;
    const badge = soldOut ? '<span class="badge">Esgotado</span>' : isNew(product) ? '<span class="badge">Novo</span>' : "";
    return `<article class="product-card">
  <div class="product-media">
    <a class="product-image-link" href="produto.html?id=${id}" tabindex="-1" aria-hidden="true"><img src="${product.images[0].thumb}" alt="" loading="lazy" width="320" height="400"></a>
    ${badge}
    <button type="button" class="fav-toggle${active ? " is-active" : ""}" data-favorite data-id="${id}" aria-pressed="${active}" aria-label="${active ? "Remover" : "Guardar"} ${name} ${active ? "dos" : "nos"} favoritos">${heartIcon()}</button>
  </div>
  <div class="product-info">
    <p class="product-category">${escapeHtml(categoryById(product.category).label)}</p>
    <h3 class="product-name"><a href="produto.html?id=${id}">${name}</a></h3>
    <p class="product-price">${priceMarkup(product)}</p>
    <button type="button" class="btn btn-line btn-small" data-add="${id}"${soldOut ? " disabled" : ""}>${soldOut ? "Esgotado" : "Adicionar"}</button>
  </div>
</article>`;
  }

  function initHeader() {
    const header = $(".site-header");
    const toggle = $(".menu-toggle", header);
    if (!toggle) return;
    const setOpen = (open) => {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("span").textContent = open ? "Fechar" : "Menu";
    };
    toggle.addEventListener("click", () => setOpen(!header.classList.contains("nav-open")));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function initNewsletter() {
    const form = $("#newsletter");
    if (!form) return;
    const input = $("input[type=email]", form);
    const feedback = $("#newsletter-feedback");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      feedback.className = "feedback";
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid) {
        feedback.classList.add("is-error");
        feedback.textContent = "Introduza um email válido, por exemplo nome@exemplo.pt.";
        input.focus();
        return;
      }
      feedback.classList.add("is-success");
      feedback.textContent = "Obrigado. Esta é uma demonstração: nenhum email foi enviado.";
      form.reset();
    });
  }

  function initHome() {
    $("#category-grid").innerHTML = categories.map((category, index) => {
      const count = products.filter((product) => product.category === category.id).length;
      return `<a class="category-tile" href="catalogo.html?categoria=${category.id}">
  <img src="${category.image}" alt="" loading="lazy" width="1000" height="1250">
  <span class="category-text">
    <span class="category-number">${String(index + 1).padStart(2, "0")}</span>
    <span class="category-name">${escapeHtml(category.label)}</span>
    <span class="category-copy">${escapeHtml(category.text)}</span>
    <span class="category-count">${count} ${count === 1 ? "peça" : "peças"} →</span>
  </span>
</a>`;
    }).join("");

    const featured = products.find((product) => product.featured);
    $("#featured").innerHTML = `<article class="feature">
  <figure class="feature-media"><img src="${featured.images[0].src}" alt="${escapeHtml(featured.images[0].alt)}" loading="lazy" width="1200" height="1500"></figure>
  <div class="feature-copy">
    <p class="eyebrow">${escapeHtml(categoryById(featured.category).label)}</p>
    <h3 class="feature-name"><a href="produto.html?id=${featured.id}">${escapeHtml(featured.name)}</a></h3>
    <p class="lead">${escapeHtml(featured.description)}</p>
    <p class="feature-price">${priceMarkup(featured)}</p>
    <div class="actions"><a class="btn btn-solid" href="produto.html?id=${featured.id}">Ver a peça</a></div>
  </div>
</article>`;

    $("#novelties").innerHTML = [...products]
      .sort(SORTS.novidades)
      .slice(0, 3)
      .map(productCard)
      .join("");
    initNewsletter();
  }

  function filterProducts({ q, category, price, sort }) {
    const term = normalize(q.trim());
    return products
      .filter((product) => (!category || product.category === category) && PRICE_RANGES[price](product.price))
      .filter((product) => !term || normalize(`${product.name} ${categoryById(product.category).label} ${product.summary} ${product.materials}`).includes(term))
      .sort(SORTS[sort]);
  }

  function initCatalog() {
    const params = new URLSearchParams(location.search);
    const state = {
      q: params.get("q") || "",
      category: categoryById(params.get("categoria")) ? params.get("categoria") : "",
      price: PRICE_RANGES[params.get("preco")] ? params.get("preco") : "",
      sort: SORTS[params.get("ordenar")] ? params.get("ordenar") : "relevancia",
    };
    const search = $("#search");
    const sort = $("#sort");
    const price = $("#price");
    const chips = $("#category-chips");
    const grid = $("#product-grid");
    const count = $("#results-count");
    const empty = $("#empty-state");

    search.value = state.q;
    sort.value = state.sort;
    price.innerHTML = Object.entries(PRICE_LABELS).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    price.value = state.price;
    chips.innerHTML = [{ id: "", label: "Todas" }, ...categories]
      .map((category) => `<button type="button" class="chip" data-category="${category.id}" aria-pressed="false">${escapeHtml(category.label)}</button>`)
      .join("");

    function sync() {
      $$("[data-category]", chips).forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.category === state.category)));
      const list = filterProducts(state);
      grid.innerHTML = list.map(productCard).join("");
      grid.hidden = list.length === 0;
      empty.hidden = list.length > 0;
      count.textContent = list.length === 0 ? "Nenhuma peça encontrada" : `${list.length} ${list.length === 1 ? "peça" : "peças"} de ${products.length}`;
      const next = new URLSearchParams();
      if (state.q) next.set("q", state.q);
      if (state.category) next.set("categoria", state.category);
      if (state.price) next.set("preco", state.price);
      if (state.sort !== "relevancia") next.set("ordenar", state.sort);
      const query = next.toString();
      history.replaceState(null, "", query ? `?${query}` : location.pathname);
    }

    function reset() {
      Object.assign(state, { q: "", category: "", price: "", sort: "relevancia" });
      search.value = "";
      sort.value = "relevancia";
      price.value = "";
      sync();
    }

    search.addEventListener("input", () => {
      state.q = search.value;
      sync();
    });
    sort.addEventListener("change", () => {
      state.sort = sort.value;
      sync();
    });
    price.addEventListener("change", () => {
      state.price = price.value;
      sync();
    });
    chips.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-category]");
      if (!chip) return;
      state.category = chip.dataset.category;
      sync();
    });
    $("#clear-filters").addEventListener("click", reset);
    $("#empty-reset").addEventListener("click", reset);
    $("#search-form").addEventListener("submit", (event) => event.preventDefault());
    sync();
  }

  function initProduct() {
    const id = new URLSearchParams(location.search).get("id");
    const product = productById(id);
    if (!product) {
      $("#product-view").hidden = true;
      $("#product-error").hidden = false;
      document.title = "Peça não encontrada | Maison Albor";
      return;
    }
    $("#product-error").hidden = true;
    $("#product-view").hidden = false;
    document.title = `${product.name} | Maison Albor`;
    const category = categoryById(product.category);
    const selection = defaultSelection(product);
    let imageIndex = 0;

    const mainImage = $("#gallery-image");
    const thumbs = $("#gallery-thumbs");
    const quantity = $("#quantity");
    const addButton = $("#add-button");
    const feedback = $("#product-feedback");
    const stockNote = $("#stock-note");
    const favoriteButton = $("#favorite-button");

    $("#crumb-category").textContent = category.label;
    $("#crumb-category").href = `catalogo.html?categoria=${category.id}`;
    $("#crumb-name").textContent = product.name;
    $("#product-category").textContent = category.label;
    $("#product-name").textContent = product.name;
    $("#product-summary").textContent = product.summary;
    $("#product-description").textContent = product.description;
    $("[data-field=materials]").textContent = product.materials;
    $("[data-field=dimensions]").textContent = product.dimensions;

    function showImage(index) {
      imageIndex = index;
      const image = product.images[index];
      mainImage.src = image.src;
      mainImage.alt = image.alt;
      $$("[data-thumb]", thumbs).forEach((thumb, position) => thumb.setAttribute("aria-pressed", String(position === index)));
    }

    thumbs.innerHTML = product.images.map((image, index) => `<button type="button" class="thumb" data-thumb="${index}" aria-pressed="false" aria-label="Ver imagem ${index + 1} de ${product.images.length}"><img src="${image.thumb}" alt="" width="320" height="400"></button>`).join("");
    thumbs.hidden = product.images.length < 2;
    thumbs.addEventListener("click", (event) => {
      const thumb = event.target.closest("[data-thumb]");
      if (thumb) showImage(Number(thumb.dataset.thumb));
    });
    showImage(0);

    $("#option-groups").innerHTML = (product.options || []).map((group) => `<fieldset class="option-group">
  <legend>${escapeHtml(group.label)} · <span data-legend="${group.id}"></span></legend>
  <div class="options">${group.values.map((value) => `<label class="option">
    <input type="radio" name="${group.id}" value="${value.id}"${value.id === selection[group.id] ? " checked" : ""}>
    <span class="option-chip${value.swatch ? " option-chip--swatch" : ""}"${value.swatch ? ` style="--swatch:${value.swatch}"` : ""}>${escapeHtml(value.label)}<small>${value.delta ? `${value.delta > 0 ? "+" : "−"}${formatPrice(Math.abs(value.delta))}` : "Incluído"}</small></span>
  </label>`).join("")}</div>
</fieldset>`).join("");

    function update() {
      const left = remainingStock(product);
      $("#product-price").innerHTML = priceMarkup(product, unitPrice(product, selection));
      for (const group of product.options || []) {
        const value = selectedValues(product, selection).find((item) => item.group.id === group.id).value;
        $(`[data-legend="${group.id}"]`).textContent = value.label;
      }
      quantity.max = Math.max(1, left);
      if (Number(quantity.value) > Math.max(1, left)) quantity.value = Math.max(1, left);
      stockNote.className = "stock-note";
      if (product.stock === 0) {
        stockNote.textContent = "De momento esgotado.";
      } else if (left === 0) {
        stockNote.textContent = "Já tem no carrinho todas as unidades disponíveis.";
      } else if (left <= 3) {
        stockNote.textContent = `Últimas ${left} ${left === 1 ? "unidade" : "unidades"}.`;
        stockNote.classList.add("is-warning");
      } else {
        stockNote.textContent = "Em stock · entrega em 3 a 5 dias úteis.";
      }
      addButton.disabled = left === 0;
      addButton.textContent = product.stock === 0 ? "Esgotado" : left === 0 ? "Limite no carrinho" : "Adicionar ao carrinho";
    }

    $("#option-groups").addEventListener("change", (event) => {
      if (!event.target.matches("input[type=radio]")) return;
      selection[event.target.name] = event.target.value;
      update();
    });

    $(".stepper").addEventListener("click", (event) => {
      const step = event.target.closest("[data-step]");
      if (!step) return;
      quantity.value = clamp(Number(quantity.value) + Number(step.dataset.step), 1, Math.max(1, remainingStock(product)));
    });

    quantity.addEventListener("change", () => {
      quantity.value = clamp(Math.round(Number(quantity.value)) || 1, 1, Math.max(1, remainingStock(product)));
    });

    $("#product-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const result = addToCart(product.id, selection, Number(quantity.value));
      feedback.className = `feedback ${result.ok ? "is-success" : "is-error"}`;
      feedback.textContent = result.ok && result.clamped
        ? `Só foram adicionadas ${result.added} unidades, o stock disponível.`
        : result.message;
      if (result.ok) {
        addButton.textContent = "Adicionado ✓";
        setTimeout(update, 1600);
      }
      update();
    });

    favoriteButton.dataset.id = product.id;
    updateFavoriteButton(favoriteButton);

    const related = [
      ...products.filter((item) => item.category === product.category && item.id !== product.id),
      ...products.filter((item) => item.category !== product.category),
    ].slice(0, 3);
    $("#related-grid").innerHTML = related.map(productCard).join("");
    update();
  }

  function initFavorites() {
    const grid = $("#favorites-grid");
    const count = $("#favorites-count");
    const empty = $("#favorites-empty");
    const render = () => {
      const list = [...favorites].map(productById);
      grid.innerHTML = list.map(productCard).join("");
      grid.hidden = list.length === 0;
      empty.hidden = list.length > 0;
      count.textContent = list.length === 0 ? "" : `${list.length} ${list.length === 1 ? "peça guardada" : "peças guardadas"}`;
    };
    hooks.favorites = () => {
      render();
      $("#page-title").focus();
    };
    render();
  }

  function initCart() {
    const list = $("#cart-list");
    const empty = $("#cart-empty");
    const summary = $("#cart-summary");
    const promoInput = $("#promo-code");
    const promoFeedback = $("#promo-feedback");
    const promoRemove = $("#promo-remove");
    const checkoutNote = $("#checkout-note");

    function lineMarkup(line) {
      const name = escapeHtml(line.product.name);
      const id = escapeHtml(line.product.id);
      const max = maxLineQuantity(line.index);
      return `<li class="cart-item">
  <a class="cart-thumb" href="produto.html?id=${id}" tabindex="-1" aria-hidden="true"><img src="${line.product.images[0].thumb}" alt="" width="320" height="400"></a>
  <div class="cart-info">
    <h3 class="cart-name"><a href="produto.html?id=${id}">${name}</a></h3>
    <p class="muted">${escapeHtml(describeSelection(line.product, line.selection))}</p>
    <p class="muted">${formatPrice(line.unit)} cada</p>
    <button type="button" class="text-button" data-remove="${line.index}">Remover do carrinho</button>
  </div>
  <div class="cart-controls">
    <div class="stepper">
      <button type="button" data-step="-1" data-line="${line.index}" aria-label="Diminuir quantidade de ${name}"${line.qty <= 1 ? " disabled" : ""}>−</button>
      <input type="number" inputmode="numeric" min="1" max="${max}" value="${line.qty}" data-qty-input data-line="${line.index}" aria-label="Quantidade de ${name}">
      <button type="button" data-step="1" data-line="${line.index}" aria-label="Aumentar quantidade de ${name}"${line.qty >= max ? " disabled" : ""}>+</button>
    </div>
    <p class="line-total">${formatPrice(line.total)}</p>
  </div>
</li>`;
    }

    function render(focusSelector) {
      const lines = cartLines();
      list.innerHTML = lines.map(lineMarkup).join("");
      list.hidden = lines.length === 0;
      empty.hidden = lines.length > 0;
      summary.hidden = lines.length === 0;
      if (lines.length) {
        const totals = cartTotals(lines);
        $("#t-subtotal").textContent = formatPrice(totals.subtotal);
        $("#t-discount").textContent = totals.discount ? `−${formatPrice(totals.discount)}` : formatPrice(0);
        $("#t-discount-label").textContent = promo ? `Desconto (${promo})` : "Desconto";
        $("#t-shipping").textContent = totals.shipping === 0 ? "Grátis" : formatPrice(totals.shipping);
        $("#t-shipping-note").textContent = totals.shipping === 0
          ? "Envio gratuito incluído."
          : `Faltam ${formatPrice(round(FREE_SHIPPING_FROM - totals.afterDiscount))} para envio gratuito.`;
        $("#t-total").textContent = formatPrice(totals.total);
        $("#t-vat").textContent = `Inclui IVA (23%): ${formatPrice(totals.vat)}.`;
      }
      promoRemove.hidden = !promo;
      if (promo) {
        promoFeedback.className = "feedback is-success";
        promoFeedback.textContent = `Código ${promo} aplicado: ${PROMO_CODES[promo].label}.`;
      }
      if (focusSelector) $(focusSelector)?.focus();
    }

    function setLineQuantity(index, requested) {
      const max = maxLineQuantity(index);
      const value = clamp(Math.round(Number(requested)) || 1, 1, max);
      if (Number(requested) > max) announce(`Stock disponível: ${max} ${max === 1 ? "unidade" : "unidades"}.`);
      cart[index].qty = value;
      saveCart();
      updateCounters();
    }

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove]");
      if (remove) {
        const removed = productById(cart[Number(remove.dataset.remove)].id);
        cart.splice(Number(remove.dataset.remove), 1);
        saveCart();
        updateCounters();
        announce(`${removed.name} removido do carrinho.`);
        render("#cart-title");
        return;
      }
      const step = event.target.closest("[data-step]");
      if (step) {
        const index = Number(step.dataset.line);
        setLineQuantity(index, cart[index].qty + Number(step.dataset.step));
        render(`[data-qty-input][data-line="${index}"]`);
      }
    });

    list.addEventListener("change", (event) => {
      if (!event.target.matches("[data-qty-input]")) return;
      const index = Number(event.target.dataset.line);
      setLineQuantity(index, event.target.value);
      render(`[data-qty-input][data-line="${index}"]`);
    });

    $("#promo-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      promoFeedback.className = "feedback";
      if (!code) {
        promoFeedback.classList.add("is-error");
        promoFeedback.textContent = "Introduza um código promocional.";
        return;
      }
      if (!PROMO_CODES[code]) {
        promoFeedback.classList.add("is-error");
        promoFeedback.textContent = "Código inválido. Experimente ALBOR10.";
        return;
      }
      promo = code;
      writeStorage(PROMO_KEY, promo);
      promoInput.value = "";
      render();
    });

    promoRemove.addEventListener("click", () => {
      promo = "";
      writeStorage(PROMO_KEY, promo);
      promoFeedback.className = "feedback";
      promoFeedback.textContent = "Código removido.";
      render();
      promoInput.focus();
    });

    $("#checkout").addEventListener("click", () => {
      checkoutNote.textContent = "Demonstração: o pagamento não está ligado e nenhum pedido é criado.";
    });

    render();
  }

  const pages = {
    inicio: initHome,
    catalogo: initCatalog,
    produto: initProduct,
    favoritos: initFavorites,
    carrinho: initCart,
  };

  document.addEventListener("click", (event) => {
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) {
      toggleFavorite(favorite.dataset.id);
      return;
    }
    const add = event.target.closest("[data-add]");
    if (add) {
      const product = productById(add.dataset.add);
      const result = addToCart(product.id, defaultSelection(product));
      announce(result.message);
      if (result.ok) {
        const original = add.textContent;
        add.textContent = "Adicionado ✓";
        setTimeout(() => {
          add.textContent = original;
        }, 1600);
      }
    }
  });

  initHeader();
  updateCounters();
  pages[document.body.dataset.page]?.();
})();
