// Lógica da demo: filtros, rankings, badges e preferências locais (sem rede nem contas).
const HEART_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7.5-4.6-9.5-9.1C1.1 8.6 3.2 5 6.7 5c2 0 3.5 1.1 4.3 2.4C11.8 6.1 13.3 5 15.3 5c3.5 0 5.6 3.6 4.2 6.9C17.5 16.4 12 21 12 21z"/></svg>';

const normalizar = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const esc = (valor) => String(valor).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const decimal = (valor) => valor.toFixed(1).replace(".", ",");
const formatarPreco = (valor) => (valor === 0 ? "Gratuito" : new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(valor));
const formatarData = (iso) => new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`));
const formatarNumero = (valor) => valor.toLocaleString("pt-PT");
const iniciais = (nome) => nome.replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(/\s+/).slice(0, 2).map((parte) => parte[0].toUpperCase()).join("");
const corDoNome = (texto) => [...texto].reduce((soma, letra) => soma + letra.charCodeAt(0), 0) % 360;

function filtrarJogos(jogos, filtros = {}) {
  const { texto = "", genero = "", plataforma = "", soFavoritos = false, favoritos = [], ordem = "destaque" } = filtros;
  const termo = normalizar(texto);
  const resultado = jogos.filter((jogo) =>
    (!termo || normalizar([jogo.titulo, jogo.genero, jogo.descricao].join(" ")).includes(termo)) &&
    (!genero || jogo.genero === genero) &&
    (!plataforma || jogo.plataformas.includes(plataforma)) &&
    (!soFavoritos || favoritos.includes(jogo.id)));
  const comparadores = {
    avaliacao: (a, b) => b.avaliacao - a.avaliacao || a.titulo.localeCompare(b.titulo, "pt"),
    nome: (a, b) => a.titulo.localeCompare(b.titulo, "pt"),
    lancamento: (a, b) => b.lancamento - a.lancamento || a.titulo.localeCompare(b.titulo, "pt"),
  };
  return comparadores[ordem] ? [...resultado].sort(comparadores[ordem]) : resultado;
}

function filtrarNoticias(noticias, categoria = "") {
  return noticias.filter((noticia) => !categoria || noticia.categoria === categoria).sort((a, b) => b.data.localeCompare(a.data));
}

function rankingDe(jogadores, chave) {
  return [...jogadores]
    .sort((a, b) => b.pontos[chave] - a.pontos[chave] || a.nick.localeCompare(b.nick, "pt"))
    .map((jogador, indice) => ({ ...jogador, posicao: indice + 1, pontuacao: jogador.pontos[chave] }));
}

function estatisticasDe(jogador, favoritos, lidas) {
  if (!jogador) return { horas: 0, vitorias: 0, favoritos: favoritos.length, lidas: lidas.length };
  return { horas: jogador.horas, vitorias: jogador.vitorias, favoritos: jogador.favoritos, lidas: jogador.lidas };
}

function badgesDe(estatisticas) {
  return BADGES.map((badge) => ({ ...badge, conquistado: badge.condicao(estatisticas) }));
}

function validarNick(valor) {
  const limpo = String(valor).trim().replace(/\s+/g, " ");
  if (limpo.length < 2) return { ok: false, erro: "O nome tem de ter pelo menos 2 caracteres." };
  if (limpo.length > 16) return { ok: false, erro: "O nome pode ter no máximo 16 caracteres." };
  if (!/^[\p{L}\p{N} _.-]+$/u.test(limpo)) return { ok: false, erro: "Usa apenas letras, números, espaços, pontos, traços ou underscores." };
  return { ok: true, valor: limpo };
}

function lerChave(armazenamento, chave, predefinido) {
  try {
    const bruto = armazenamento.getItem(chave);
    return bruto === null ? predefinido : JSON.parse(bruto);
  } catch {
    return predefinido;
  }
}

function guardarChave(armazenamento, chave, valor) {
  try {
    armazenamento.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

function testarArmazenamento(armazenamento) {
  try {
    armazenamento.setItem("pixel-porto:teste", "1");
    armazenamento.removeItem("pixel-porto:teste");
    return true;
  } catch {
    return false;
  }
}

function carregarEstado(armazenamento) {
  const listaDe = (chave) => {
    const valor = lerChave(armazenamento, chave, []);
    return Array.isArray(valor) ? valor.filter((item) => typeof item === "string") : [];
  };
  const nickGuardado = lerChave(armazenamento, SITE.chaves.nick, "");
  const validacao = validarNick(typeof nickGuardado === "string" ? nickGuardado : "");
  return {
    favoritos: listaDe(SITE.chaves.favoritos),
    lidas: listaDe(SITE.chaves.lidas),
    nick: validacao.ok ? validacao.valor : "Convidado",
  };
}

if (typeof module !== "undefined") {
  module.exports = { normalizar, filtrarJogos, filtrarNoticias, rankingDe, estatisticasDe, badgesDe, validarNick, carregarEstado, guardarChave, testarArmazenamento, iniciais };
}

function iniciar() {
  const $ = (id) => document.getElementById(id);
  const memoria = { getItem: () => null, setItem() { throw new Error("indisponível"); }, removeItem() {} };
  let armazenamento = memoria;
  try {
    armazenamento = window.localStorage;
  } catch {
    armazenamento = memoria;
  }
  const armazenamentoOk = testarArmazenamento(armazenamento);

  const estado = { ...carregarEstado(armazenamento), texto: "", genero: "", plataforma: "", ordem: "destaque", soFavoritos: false, categoria: "", ranking: "global", perfil: "eu", slide: 0 };
  const DESTAQUES = JOGOS.filter((jogo) => jogo.destaque);
  const CHAVES_RANKING = { global: "Pontos", semanal: "Pontos da semana", competitivo: "Rating" };

  const grelha = $("jogos");
  const estadoCatalogo = $("catalogo-estado");
  const pesquisa = $("jogo-pesquisa");
  const plataformaSelect = $("plataforma");
  const ordemSelect = $("ordem");
  const soFavoritosInput = $("so-favoritos");
  const toast = $("toast");
  let temporizadorToast;

  function guardar(chave, valor) {
    if (!guardarChave(armazenamento, chave, valor)) {
      $("aviso-armazenamento").hidden = false;
      return false;
    }
    return true;
  }

  function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("is-visible");
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function atualizarContadores() {
    $("fav-count").textContent = String(estado.favoritos.length);
  }

  function atualizarBotoesFavorito() {
    document.querySelectorAll(".fav-btn").forEach((botao) => {
      const jogo = JOGOS.find((item) => item.id === botao.dataset.fav);
      const ativo = estado.favoritos.includes(jogo.id);
      botao.setAttribute("aria-pressed", String(ativo));
      botao.setAttribute("aria-label", `${ativo ? "Remover" : "Adicionar"} ${jogo.titulo} ${ativo ? "dos" : "aos"} favoritos`);
      botao.querySelector("span").textContent = ativo ? "Favorito" : "Favoritar";
      botao.classList.toggle("is-active", ativo);
    });
  }

  function cartaoJogo(jogo) {
    return `<article class="game-card">
<div class="art" style="--c1:${jogo.cores[0]};--c2:${jogo.cores[1]}" aria-hidden="true"><span class="art-mark">${esc(jogo.titulo[0])}</span></div>
<div class="game-body">
<p class="game-meta">${esc(jogo.genero)} · ${jogo.lancamento}</p>
<h3>${esc(jogo.titulo)}</h3>
<p class="game-copy">${esc(jogo.slogan)}</p>
<p class="tags">${jogo.plataformas.map((plataforma) => `<span class="tag">${esc(plataforma)}</span>`).join("")}</p>
<div class="game-foot">
<span class="rating"><span aria-hidden="true">★</span> ${decimal(jogo.avaliacao)}<span class="visually-hidden"> em 5</span></span>
<span class="price">${formatarPreco(jogo.preco)}</span>
${botaoFavorito(jogo)}
</div></div></article>`;
  }

  function botaoFavorito(jogo) {
    const ativo = estado.favoritos.includes(jogo.id);
    return `<button type="button" class="fav-btn${ativo ? " is-active" : ""}" data-fav="${jogo.id}" aria-pressed="${ativo}" aria-label="${ativo ? "Remover" : "Adicionar"} ${esc(jogo.titulo)} ${ativo ? "dos" : "aos"} favoritos">${HEART_ICON}<span>${ativo ? "Favorito" : "Favoritar"}</span></button>`;
  }

  function renderGeneros() {
    const generos = ["", ...GENEROS];
    $("generos").innerHTML = generos.map((genero) => `<button type="button" class="chip" data-genero="${esc(genero)}" aria-pressed="${estado.genero === genero}">${genero || "Todos"}</button>`).join("");
  }

  function renderJogos() {
    const lista = filtrarJogos(JOGOS, { texto: estado.texto, genero: estado.genero, plataforma: estado.plataforma, soFavoritos: estado.soFavoritos, favoritos: estado.favoritos, ordem: estado.ordem });
    grelha.innerHTML = lista.map(cartaoJogo).join("");
    $("jogos-vazio").hidden = lista.length > 0;
    estadoCatalogo.textContent = lista.length ? `A mostrar ${lista.length} de ${JOGOS.length} jogos` : "Nenhum resultado para os filtros atuais";
  }

  function renderDestaques() {
    $("slides").innerHTML = DESTAQUES.map((jogo, indice) => `<article class="slide" role="group" aria-roledescription="diapositivo" aria-label="${indice + 1} de ${DESTAQUES.length}: ${esc(jogo.titulo)}" data-slide="${indice}"${indice === 0 ? "" : " hidden"}>
<div class="art slide-art" style="--c1:${jogo.cores[0]};--c2:${jogo.cores[1]}" aria-hidden="true"><span class="art-mark">${esc(jogo.titulo[0])}</span></div>
<div class="slide-info">
<p class="eyebrow">Destaque ${indice + 1} de ${DESTAQUES.length}</p>
<h3>${esc(jogo.titulo)}</h3>
<p class="slide-slogan">${esc(jogo.slogan)}</p>
<p class="slide-desc">${esc(jogo.descricao)}</p>
<p class="tags">${jogo.plataformas.map((plataforma) => `<span class="tag">${esc(plataforma)}</span>`).join("")}</p>
<div class="slide-actions">
<button type="button" class="btn" data-ver="${jogo.id}">Ver no catálogo</button>
${botaoFavorito(jogo)}
</div></div></article>`).join("");
    $("dots").innerHTML = DESTAQUES.map((jogo, indice) => `<button type="button" class="dot" data-dot="${indice}" aria-label="Mostrar destaque ${indice + 1}: ${esc(jogo.titulo)}"></button>`).join("");
    mostrarDestaque(0);
  }

  function mostrarDestaque(indice) {
    estado.slide = (indice + DESTAQUES.length) % DESTAQUES.length;
    document.querySelectorAll(".slide").forEach((slide) => {
      slide.hidden = Number(slide.dataset.slide) !== estado.slide;
    });
    document.querySelectorAll(".dot").forEach((dot) => {
      dot.setAttribute("aria-current", String(Number(dot.dataset.dot) === estado.slide));
    });
  }

  function renderNoticias() {
    const lista = filtrarNoticias(NOTICIAS, estado.categoria);
    $("categorias").innerHTML = ["", ...CATEGORIAS_NOTICIAS].map((categoria) => `<button type="button" class="chip" data-categoria="${esc(categoria)}" aria-pressed="${estado.categoria === categoria}">${categoria || "Todas"}</button>`).join("");
    $("noticias-lista").innerHTML = lista.map((noticia) => {
      const lida = estado.lidas.includes(noticia.id);
      return `<li><article class="news-card${lida ? " is-read" : ""}">
<div class="art news-art" style="--c1:${noticia.cor}" aria-hidden="true"><span>${esc(noticia.categoria)}</span></div>
<div class="news-body">
<p class="game-meta"><span>${esc(noticia.categoria)}</span> · <time datetime="${noticia.data}">${formatarData(noticia.data)}</time> · ${noticia.minutos} min</p>
<h3>${esc(noticia.titulo)}</h3>
<p class="game-copy">${esc(noticia.resumo)}</p>
<button type="button" class="btn ghost" data-noticia="${noticia.id}" aria-haspopup="dialog" aria-label="Ler notícia: ${esc(noticia.titulo)}">${lida ? "Ler de novo" : "Ler notícia"}${lida ? ' <span class="read-badge">Lida</span>' : ""}</button>
</div></article></li>`;
    }).join("");
    $("noticias-vazio").hidden = lista.length > 0;
  }

  let noticiaAberta = null;
  function abrirNoticia(id) {
    const noticia = NOTICIAS.find((item) => item.id === id);
    const dialogo = $("noticia-dialog");
    if (!noticia) return mostrarToast("Esta notícia já não está disponível.");
    noticiaAberta = id;
    $("noticia-conteudo").innerHTML = `<p class="game-meta"><span>${esc(noticia.categoria)}</span> · <time datetime="${noticia.data}">${formatarData(noticia.data)}</time> · ${noticia.minutos} min</p>
<h2 id="noticia-titulo">${esc(noticia.titulo)}</h2>
${noticia.paragrafos.map((paragrafo) => `<p>${esc(paragrafo)}</p>`).join("")}`;
    if (typeof dialogo.showModal === "function") dialogo.showModal();
    else dialogo.setAttribute("open", "");
  }

  function renderRanking() {
    const lista = rankingDe(JOGADORES, estado.ranking);
    document.querySelectorAll("#ranking-tabs [role=tab]").forEach((tab) => {
      const ativo = tab.dataset.key === estado.ranking;
      tab.setAttribute("aria-selected", String(ativo));
      tab.tabIndex = ativo ? 0 : -1;
    });
    $("ranking-painel").setAttribute("aria-labelledby", `tab-${estado.ranking}`);
    $("col-pontos").textContent = CHAVES_RANKING[estado.ranking];
    $("ranking-corpo").innerHTML = lista.map((jogador) => `<tr${jogador.id === estado.perfil ? ' class="is-selected"' : ""}>
<td class="pos">${jogador.posicao}º</td>
<td><span class="avatar avatar-sm" style="--hue:${corDoNome(jogador.id)}" aria-hidden="true">${iniciais(jogador.nick)}</span> <span class="nick">${esc(jogador.nick)}</span></td>
<td class="col-cidade">${esc(jogador.cidade)}</td>
<td class="num">${formatarNumero(jogador.pontuacao)}</td>
<td class="num"><button type="button" class="link-btn" data-perfil="${jogador.id}" aria-label="Ver perfil de ${esc(jogador.nick)}">Ver perfil</button></td>
</tr>`).join("");
  }

  function renderPerfil() {
    const eu = estado.perfil === "eu";
    const jogador = eu ? null : JOGADORES.find((item) => item.id === estado.perfil);
    if (!eu && !jogador) {
      $("perfil-cartao").hidden = true;
      $("perfil-erro").hidden = false;
      return;
    }
    $("perfil-cartao").hidden = false;
    $("perfil-erro").hidden = true;
    const nome = eu ? estado.nick : jogador.nick;
    const estatisticas = estatisticasDe(jogador, estado.favoritos, estado.lidas);
    const avatar = $("perfil-avatar");
    avatar.textContent = iniciais(nome);
    avatar.style.setProperty("--hue", String(corDoNome(eu ? "eu" : jogador.id)));
    $("perfil-nome").textContent = nome;
    $("perfil-cidade").textContent = eu ? "Perfil local deste navegador" : `${jogador.cidade} · Jogador fictício`;
    $("perfil-bio").textContent = eu ? "As estatísticas deste perfil vêm dos teus favoritos e das notícias que lês. Nada sai deste navegador." : jogador.bio;
    const linhas = eu
      ? [["Favoritos", estatisticas.favoritos], ["Notícias lidas", estatisticas.lidas]]
      : [["Horas de jogo", formatarNumero(estatisticas.horas)], ["Vitórias", formatarNumero(estatisticas.vitorias)], ["Favoritos", estatisticas.favoritos], ["Notícias lidas", estatisticas.lidas]];
    $("perfil-stats").innerHTML = linhas.map(([rotulo, valor]) => `<div><dt>${rotulo}</dt><dd>${valor}</dd></div>`).join("");
    $("nick-form").hidden = !eu;
    if (eu && document.activeElement !== $("nick-input")) $("nick-input").value = estado.nick;
    const badges = badgesDe(estatisticas);
    $("badges-titulo").textContent = `Badges · ${badges.filter((badge) => badge.conquistado).length} de ${badges.length}`;
    $("badges").innerHTML = badges.map((badge) => `<li class="badge ${badge.conquistado ? "is-earned" : "is-locked"}">
<span class="badge-icon" aria-hidden="true">${badge.conquistado ? "✓" : "·"}</span>
<span><strong>${esc(badge.nome)}</strong><span class="badge-desc">${esc(badge.descricao)}</span>
<span class="badge-state">${badge.conquistado ? "Conquistado" : "Por desbloquear"}</span></span></li>`).join("");
  }

  function renderFavoritos() {
    const jogos = estado.favoritos.map((id) => JOGOS.find((jogo) => jogo.id === id)).filter(Boolean);
    $("favoritos-lista").innerHTML = jogos.map((jogo) => `<li>
<button type="button" class="link-btn" data-ver="${jogo.id}">${esc(jogo.titulo)}</button>
<button type="button" class="text-btn" data-fav="${jogo.id}" aria-pressed="true" aria-label="Remover ${esc(jogo.titulo)} dos favoritos">Remover</button>
</li>`).join("");
    $("favoritos-vazio").hidden = jogos.length > 0;
  }

  function alternarFavorito(id, origem) {
    const jogo = JOGOS.find((item) => item.id === id);
    if (!jogo) return;
    const ativo = estado.favoritos.includes(id);
    estado.favoritos = ativo ? estado.favoritos.filter((item) => item !== id) : [...estado.favoritos, id];
    const guardado = guardar(SITE.chaves.favoritos, estado.favoritos);
    atualizarContadores();
    if (estado.soFavoritos) renderJogos();
    atualizarBotoesFavorito();
    renderFavoritos();
    renderPerfil();
    if (origem === "painel") $("favoritos-titulo").focus();
    mostrarToast(guardado ? `${jogo.titulo} ${ativo ? "removido dos" : "adicionado aos"} favoritos` : "Favorito aplicado só nesta visita: o navegador não permite guardar.");
  }

  function verNoCatalogo(id) {
    const jogo = JOGOS.find((item) => item.id === id);
    if (!jogo) return;
    estado.texto = jogo.titulo;
    estado.genero = "";
    estado.plataforma = "";
    estado.soFavoritos = false;
    pesquisa.value = jogo.titulo;
    plataformaSelect.value = "";
    soFavoritosInput.checked = false;
    renderGeneros();
    renderJogos();
    $("catalogo").scrollIntoView();
    pesquisa.focus();
  }

  function limparFiltros() {
    Object.assign(estado, { texto: "", genero: "", plataforma: "", soFavoritos: false });
    pesquisa.value = "";
    plataformaSelect.value = "";
    soFavoritosInput.checked = false;
    renderGeneros();
    renderJogos();
    pesquisa.focus();
  }

  function mostrarPerfil(id) {
    estado.perfil = id;
    $("perfil-select").value = id;
    renderRanking();
    renderPerfil();
  }

  function iniciarNavegacao() {
    const links = document.querySelectorAll(".main-nav a");
    if (!("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        const link = document.querySelector(`.main-nav a[href="#${entrada.target.id}"]`);
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main > section[id]").forEach((seccao) => observador.observe(seccao));
  }

  // Preenchimento inicial
  PLATAFORMAS.forEach((plataforma) => plataformaSelect.insertAdjacentHTML("beforeend", `<option value="${esc(plataforma)}">${esc(plataforma)}</option>`));
  $("perfil-select").innerHTML = `<option value="eu">O meu perfil</option>${JOGADORES.map((jogador) => `<option value="${jogador.id}">${esc(jogador.nick)} · ${esc(jogador.cidade)}</option>`).join("")}`;
  $("aviso-armazenamento").hidden = armazenamentoOk;
  renderGeneros();
  renderJogos();
  renderDestaques();
  renderNoticias();
  renderRanking();
  renderFavoritos();
  renderPerfil();
  atualizarContadores();
  iniciarNavegacao();

  // Eventos
  pesquisa.addEventListener("input", () => {
    estado.texto = pesquisa.value;
    renderJogos();
  });
  plataformaSelect.addEventListener("change", () => {
    estado.plataforma = plataformaSelect.value;
    renderJogos();
  });
  ordemSelect.addEventListener("change", () => {
    estado.ordem = ordemSelect.value;
    renderJogos();
  });
  soFavoritosInput.addEventListener("change", () => {
    estado.soFavoritos = soFavoritosInput.checked;
    renderJogos();
  });
  $("limpar-filtros").addEventListener("click", limparFiltros);
  $("generos").addEventListener("click", (evento) => {
    const chip = evento.target.closest("[data-genero]");
    if (!chip) return;
    estado.genero = chip.dataset.genero;
    renderGeneros();
    renderJogos();
  });

  document.addEventListener("click", (evento) => {
    const alvo = evento.target.closest("[data-fav], [data-ver], [data-dot], [data-noticia], [data-categoria], [data-perfil]");
    if (!alvo) return;
    if (alvo.dataset.fav) alternarFavorito(alvo.dataset.fav, alvo.closest(".panel") ? "painel" : "cartao");
    else if (alvo.dataset.ver) verNoCatalogo(alvo.dataset.ver);
    else if (alvo.dataset.dot) mostrarDestaque(Number(alvo.dataset.dot));
    else if (alvo.dataset.noticia) abrirNoticia(alvo.dataset.noticia);
    else if (alvo.dataset.categoria !== undefined) {
      estado.categoria = alvo.dataset.categoria;
      renderNoticias();
    } else if (alvo.dataset.perfil) {
      mostrarPerfil(alvo.dataset.perfil);
      $("perfil").scrollIntoView();
      $("perfil-titulo").focus();
    }
  });

  $("prev").addEventListener("click", () => mostrarDestaque(estado.slide - 1));
  $("next").addEventListener("click", () => mostrarDestaque(estado.slide + 1));
  $("carrossel").addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrarDestaque(estado.slide - 1);
    if (evento.key === "ArrowRight") mostrarDestaque(estado.slide + 1);
  });

  const separadores = $("ranking-tabs");
  separadores.addEventListener("click", (evento) => {
    const tab = evento.target.closest("[role=tab]");
    if (!tab) return;
    estado.ranking = tab.dataset.key;
    renderRanking();
  });
  separadores.addEventListener("keydown", (evento) => {
    const tabs = [...separadores.querySelectorAll("[role=tab]")];
    const atual = tabs.indexOf(document.activeElement);
    if (atual === -1) return;
    const destino = { ArrowRight: (atual + 1) % tabs.length, ArrowLeft: (atual - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    tabs[destino].focus();
    estado.ranking = tabs[destino].dataset.key;
    renderRanking();
  });

  $("perfil-select").addEventListener("change", (evento) => {
    estado.perfil = evento.target.value;
    renderRanking();
    renderPerfil();
  });

  $("nick-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const entrada = $("nick-input");
    const erro = $("nick-erro");
    const resultado = validarNick(entrada.value);
    if (!resultado.ok) {
      erro.textContent = resultado.erro;
      erro.hidden = false;
      entrada.setAttribute("aria-invalid", "true");
      entrada.setAttribute("aria-describedby", "nick-erro");
      entrada.focus();
      return;
    }
    erro.hidden = true;
    entrada.removeAttribute("aria-invalid");
    entrada.removeAttribute("aria-describedby");
    estado.nick = resultado.valor;
    entrada.value = resultado.valor;
    const guardado = guardar(SITE.chaves.nick, resultado.valor);
    renderPerfil();
    mostrarToast(guardado ? `Nome guardado: ${resultado.valor}` : "Nome aplicado só nesta visita.");
  });

  $("perfil-reset").addEventListener("click", () => mostrarPerfil("eu"));

  const dialogo = $("noticia-dialog");
  dialogo.addEventListener("close", () => {
    const id = noticiaAberta;
    noticiaAberta = null;
    if (!id) return;
    if (!estado.lidas.includes(id)) {
      estado.lidas = [...estado.lidas, id];
      guardar(SITE.chaves.lidas, estado.lidas);
      mostrarToast("Notícia marcada como lida");
    }
    renderNoticias();
    renderPerfil();
    document.querySelector(`[data-noticia="${id}"]`)?.focus();
  });
}

if (typeof module === "undefined" && typeof document !== "undefined") {
  iniciar();
}
