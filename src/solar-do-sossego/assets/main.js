(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=75`;
  const eur = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const dateFmt = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" });

  const rooms = [
    { id: "rio", name: "Suite Rio", price: 285, capacity: 3, size: 48, bed: "cama king", desc: "Grandes portadas de vidro abrem para o rio. Sala com lareira a bioetanol e banheira em granito ao lado da janela.", amenities: ["Vista de rio", "Lareira", "Banheira em pedra", "Pequeno-almoço incluído"], photos: [["1582719508461-905c673771fd", "Quarto amplo com banheira esculpida em pedra"], ["1590490360182-c33d57733427", "Cama king com madeira de carvalho e tons terra"], ["1540555700478-4be289fbecef", "Terraço privado com espreguiçadeiras"]] },
    { id: "vinha", name: "Quarto Vinha", price: 190, capacity: 2, size: 32, bed: "cama king", desc: "Carvalho escuro, linho cru e uma janela baixa sobre os socalcos. O quarto mais sossegado da casa.", amenities: ["Vista de vinha", "Duche de chuva", "Pequeno-almoço incluído"], photos: [["1590490360182-c33d57733427", "Quarto Vinha com mobiliário em carvalho"], ["1618773928121-c32242e63f39", "Pormenor de cama com roupa de linho"], ["1504280390367-361c6d9f38f4", "Socalcos do Douro vistos da janela"]] },
    { id: "patio", name: "Suite Pátio", price: 240, capacity: 3, size: 42, bed: "cama king + sofá-cama", desc: "Pátio interior privativo com oliveira centenária. Ideal para famílias pequenas ou estadias longas.", amenities: ["Pátio privativo", "Sofá-cama", "Kitchenette", "Pequeno-almoço incluído"], photos: [["1582719508461-905c673771fd", "Suite Pátio com banheira de pedra"], ["1584132967334-10e028bd69f7", "Paredes de xisto restauradas"], ["1590490360182-c33d57733427", "Zona de cama em tons quentes"]] },
    { id: "pedra", name: "Casa da Pedra", price: 420, capacity: 4, size: 90, bed: "dois quartos", desc: "Moradia independente em xisto, com piscina própria e dois quartos. Para quem quer a casa toda por uns dias.", amenities: ["Piscina privada", "Dois quartos", "Cozinha equipada", "Lareira"], photos: [["1566665797739-1674de7a421a", "Moradia em xisto com piscina"], ["1600585154340-be6161a56a0c", "Interior luminoso da moradia"], ["1600334129128-685c5582fd35", "Sala de estar com materiais naturais"]] },
  ];

  const experiences = [
    { name: "Cruzeiro privado ao pôr do sol", cat: "Natureza", duration: "2 h 30", price: "a partir de 60 €/pessoa", text: "Barco de madeira pelas curvas do rio, com vinho do Porto a bordo.", img: ["1559136555-9303baea8ebd", "Barco de madeira no rio Douro"] },
    { name: "Prova na cave de xisto", cat: "Sabores", duration: "1 h 30", price: "a partir de 35 €/pessoa", text: "Cinco vinhos da quinta, com queijos e enchidos da aldeia.", img: ["1510812431401-41d2bd2722f3", "Copos de vinho numa prova"] },
    { name: "Jantar na brasa", cat: "Sabores", duration: "3 h", price: "a partir de 75 €/pessoa", text: "Menu de cinco momentos com legumes da horta e carnes maturadas.", img: ["1544025162-d76694265947", "Legumes frescos e ervas"] },
    { name: "Massagem à luz de velas", cat: "Bem-estar", duration: "1 h", price: "a partir de 80 €", text: "Óleos de alecrim e laranja, numa sala com vista para a vinha.", img: ["1544367567-0f2fcb009e0b", "Sala de massagem com velas"] },
    { name: "Caminhada ao nascer do dia", cat: "Natureza", duration: "3 h", price: "Incluída na estadia", text: "Trilho entre socalcos, com piquenique de pão quente e fruta.", img: ["1504280390367-361c6d9f38f4", "Nascer do sol sobre o Douro"] },
    { name: "Piquenique entre as vinhas", cat: "Sabores", duration: "2 h", price: "a partir de 45 €/casal", text: "Cesto preparado pela nossa cozinha, para estender onde preferir.", img: ["1526244433293-179424fc8ee0", "Cesto de piquenique com pão e fruta"] },
  ];

  const nights = (a, b) => Math.round((b - a) / 864e5);
  const parse = (value) => (value ? new Date(`${value}T00:00:00`) : null);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const state = { search: null, guests: 2 };

  // Disponibilidade ilustrativa e determinística: um quarto está "ocupado" em certos dias.
  function isTaken(room, day) {
    const seed = [...room.id].reduce((n, c) => n + c.charCodeAt(0), 0);
    return (Math.floor(day.getTime() / 864e5) + seed) % 7 < 2 + (seed % 2);
  }
  function availableRooms(start, end) {
    return rooms.map((room) => {
      let free = true;
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) if (isTaken(room, d)) { free = false; break; }
      return { room, free, fits: room.capacity >= state.guests };
    });
  }
  const el = (tag, props = {}, ...kids) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...kids);
    return node;
  };

  // Menu móvel
  const toggle = $(".menu-toggle"), nav = $("#site-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }
  });

  // Quartos
  const roomsEl = $("#rooms");
  roomsEl.replaceChildren(...rooms.map((room) => {
    const [id, alt] = room.photos[0];
    const open = el("button", { type: "button", className: "room-open" }, el("span", { className: "sr-only" }, `Ver detalhes de ${room.name}`));
    const img = el("img", { src: photo(id), alt, loading: "lazy", width: 1000, height: 680 });
    open.addEventListener("click", () => openRoom(room, open));
    return el("article", { className: "room" },
      el("div", { className: "room-media" }, img, open),
      el("div", { className: "room-info" },
        el("h3", {}, room.name),
        el("p", { className: "meta" }, `${room.size} m² · ${room.bed} · até ${room.capacity} hóspedes`),
        el("p", {}, room.desc),
        el("p", { className: "price" }, `desde ${eur.format(room.price)} / noite`),
        Object.assign(el("button", { type: "button", className: "link" }, "Galeria e detalhes ", el("span", { className: "sr-only" }, room.name)), { onclick: (e) => openRoom(room, e.currentTarget) })));
  }));

  // Diálogo de quarto com galeria
  const dlg = $("#room-dialog");
  let current = null, idx = 0, opener = null;
  function showPhoto(i) {
    idx = (i + current.photos.length) % current.photos.length;
    const [id, alt] = current.photos[idx];
    const img = $("#dlg-image");
    img.src = photo(id); img.alt = alt;
    $("#dlg-count").textContent = `${idx + 1} de ${current.photos.length}`;
    [...$("#dlg-thumbs").children].forEach((b, n) => b.setAttribute("aria-current", String(n === idx)));
  }
  function openRoom(room, from) {
    current = room; opener = from;
    $("#dlg-title").textContent = room.name;
    $("#dlg-desc").textContent = `${room.desc} ${room.size} m², ${room.bed}.`;
    $("#dlg-price").textContent = `Desde ${eur.format(room.price)} por noite (valor ilustrativo)`;
    $("#dlg-amenities").replaceChildren(...room.amenities.map((a) => el("li", {}, a)));
    $("#dlg-thumbs").replaceChildren(...room.photos.map(([id, alt], n) =>
      Object.assign(el("button", { type: "button", "aria-label": `Fotografia ${n + 1}: ${alt}` }, el("img", { src: photo(id).replace("w=1000", "w=200"), alt: "", loading: "lazy", width: 100, height: 70 })), { onclick: () => showPhoto(n) })));
    showPhoto(0);
    dlg.showModal();
  }
  $("#dlg-prev").addEventListener("click", () => showPhoto(idx - 1));
  $("#dlg-next").addEventListener("click", () => showPhoto(idx + 1));
  $("#dlg-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPhoto(idx - 1);
    if (e.key === "ArrowRight") showPhoto(idx + 1);
  });
  dlg.addEventListener("close", () => opener?.focus());
  $("#dlg-choose").addEventListener("click", () => {
    $("#req-room").value = current.id;
    dlg.close();
    $("#request-form").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    $("#req-name").focus({ preventScroll: true });
  });

  // Experiências
  const expList = $("#experiences"), expStatus = $("#exp-status");
  function renderExperiences(filter) {
    const items = experiences.filter((x) => filter === "all" || x.cat === filter);
    expList.replaceChildren(...items.map((x) => el("li", { className: "exp" },
      el("img", { src: photo(x.img[0]).replace("w=1000", "w=700"), alt: x.img[1], loading: "lazy", width: 700, height: 470 }),
      el("p", { className: "meta" }, `${x.cat} · ${x.duration}`),
      el("h3", {}, x.name), el("p", {}, x.text), el("p", { className: "price" }, x.price))));
    expStatus.textContent = items.length ? `${items.length} experiências` : "Sem experiências nesta categoria.";
    if (!items.length) expList.append(el("li", { className: "notice" }, "Sem experiências nesta categoria."));
  }
  document.querySelectorAll(".filters button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    renderExperiences(b.dataset.filter);
  }));
  renderExperiences("all");

  // Datas e hóspedes
  const ci = $("#checkin"), co = $("#checkout");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  ci.min = iso(today);
  ci.addEventListener("change", () => {
    const start = parse(ci.value);
    if (!start) return;
    const next = new Date(start); next.setDate(next.getDate() + 1);
    co.min = iso(next);
    if (!co.value || parse(co.value) <= start) co.value = iso(next);
  });
  const setGuests = (n) => { state.guests = Math.min(4, Math.max(1, n)); $("#guests").textContent = state.guests; $("#guests-minus").disabled = state.guests === 1; $("#guests-plus").disabled = state.guests === 4; };
  $("#guests-minus").addEventListener("click", () => setGuests(state.guests - 1));
  $("#guests-plus").addEventListener("click", () => setGuests(state.guests + 1));
  setGuests(2);

  const reqRoom = $("#req-room");
  rooms.forEach((r) => reqRoom.append(el("option", { value: r.id }, r.name)));

  const fail = (node, msg) => { node.textContent = msg; node.hidden = false; };
  $("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#search-error"); err.hidden = true;
    const start = parse(ci.value), end = parse(co.value);
    if (!start || !end) return fail(err, "Indique as datas de chegada e de partida.");
    if (start < today) return fail(err, "A data de chegada não pode estar no passado.");
    if (end <= start) return fail(err, "A partida tem de ser depois da chegada.");
    if (nights(start, end) > 14) return fail(err, "Para estadias superiores a 14 noites, contacte-nos diretamente.");
    state.search = { start, end };
    const n = nights(start, end);
    const results = availableRooms(start, end);
    const out = $("#availability");
    const list = el("ul", { className: "avail" }, ...results.map(({ room, free, fits }) => {
      const status = !fits ? `Máx. ${room.capacity} hóspedes` : free ? "Disponível (ilustrativo)" : "Indisponível nestas datas";
      const li = el("li", { className: free && fits ? "ok" : "no" },
        el("span", {}, el("strong", {}, room.name), el("br"), el("small", {}, `${status}${free && fits ? ` · ${eur.format(room.price * n)} por ${n} noite${n > 1 ? "s" : ""}` : ""}`)));
      if (free && fits) li.append(Object.assign(el("button", { type: "button", className: "link" }, "Pedir"), { onclick: () => { reqRoom.value = room.id; $("#request-form").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); reqRoom.focus({ preventScroll: true }); } }));
      return li;
    }));
    out.replaceChildren(el("p", { className: "hint" }, `${dateFmt.format(start)} → ${dateFmt.format(end)} · ${n} noite${n > 1 ? "s" : ""} · ${state.guests} hóspede${state.guests > 1 ? "s" : ""}`), list);
    if (!results.some((r) => r.free && r.fits)) out.append(el("p", { className: "notice" }, "Sem quartos disponíveis para estas datas e hóspedes. Experimente alterar as datas."));
  });

  // Pedido de reserva
  const form = $("#request-form"), result = $("#request-result");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#request-error"); err.hidden = true;
    const data = new FormData(form);
    const room = rooms.find((r) => r.id === data.get("room"));
    const name = String(data.get("name")).trim(), email = String(data.get("email")).trim();
    const check = (ok, msg, field) => { if (!ok) { fail(err, msg); $(field).focus(); } return ok; };
    if (!check(state.search, "Escolha primeiro as datas e os hóspedes e consulte a disponibilidade.", "#checkin")) return;
    if (!check(room, "Escolha um quarto.", "#req-room")) return;
    if (!check(name.length >= 2, "Indique o seu nome.", "#req-name")) return;
    if (!check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Indique um email válido.", "#req-email")) return;
    if (!check(data.get("consent"), "Confirme que compreende que o pedido não é uma reserva.", "#req-consent")) return;
    const n = nights(state.search.start, state.search.end);
    const lines = [
      "PEDIDO DE RESERVA (não confirmado)",
      `Quarto: ${room.name}`,
      `Chegada: ${dateFmt.format(state.search.start)}`,
      `Partida: ${dateFmt.format(state.search.end)} (${n} noite${n > 1 ? "s" : ""})`,
      `Hóspedes: ${state.guests}`,
      `Nome: ${name}`, `Email: ${email}`,
      data.get("phone") ? `Telefone: ${data.get("phone")}` : null,
      data.get("notes") ? `Pedidos: ${String(data.get("notes")).trim()}` : null,
    ].filter(Boolean).join("\n");
    $("#summary").textContent = lines;
    $("#mailto").href = `mailto:reservas@solardosossego.example?subject=${encodeURIComponent("Pedido de reserva")}&body=${encodeURIComponent(lines)}`;
    $("#copy-status").textContent = "";
    form.hidden = true; result.hidden = false; result.focus();
  });
  $("#copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#summary").textContent); $("#copy-status").textContent = "Resumo copiado."; }
    catch { $("#copy-status").textContent = "Não foi possível copiar. Selecione o texto manualmente."; }
  });
  $("#reset").addEventListener("click", () => { form.reset(); form.hidden = false; result.hidden = true; $("#req-room").focus(); });
})();
