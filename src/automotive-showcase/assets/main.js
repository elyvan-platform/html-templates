(function () {
  'use strict';
  var V = window.VEHICLES || [];
  var $ = function (s) { return document.querySelector(s); };
  var fmtEUR = function (n) { return n.toLocaleString('pt-PT') + ' €'; };
  var state = { filter: 'todos', q: '', sort: 'nome', current: V[0], colors: {}, compare: [], shot: 0 };
  V.forEach(function (v) { state.colors[v.id] = 0; });
  var SHOTS = ['Perfil', 'Traseira', 'Detalhe da jante', 'Ao entardecer'];

  // Ilustração vetorial gerada localmente (sem imagens externas).
  function art(v, color, shot) {
    var s = shot || 0, dark = '#101216', glow = s === 3 ? '#ff7a45' : '#3a4150';
    var bg = '<defs><radialGradient id="g' + s + '" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="' + glow + '" stop-opacity=".5"/><stop offset="1" stop-color="#0a0b0d" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="600" height="300" fill="url(#g' + s + ')"/><rect y="240" width="600" height="60" fill="#0d0e11"/><path d="M0 242H600" stroke="#2a2e36"/>';
    var body;
    if (s === 2) {
      body = '<circle cx="300" cy="150" r="110" fill="' + dark + '" stroke="#555c68" stroke-width="10"/><circle cx="300" cy="150" r="70" fill="none" stroke="' + color + '" stroke-width="8"/>' +
        '<g stroke="#8a919c" stroke-width="6"><path d="M300 90v120M240 150h120M258 108l84 84M342 108l-84 84"/></g><circle cx="300" cy="150" r="14" fill="' + color + '"/>';
    } else if (v.type === 'carro') {
      var rear = s === 1;
      body = rear
        ? '<path d="M150 220V170q0-40 40-60h220q40 20 40 60v50z" fill="' + color + '"/><path d="M200 120h200l22 40H178z" fill="#0b0c0f" opacity=".85"/><rect x="170" y="175" width="70" height="14" rx="4" fill="#ff5a4d"/><rect x="360" y="175" width="70" height="14" rx="4" fill="#ff5a4d"/><rect x="250" y="200" width="100" height="22" rx="3" fill="#dfe3e8"/><rect x="150" y="220" width="300" height="12" fill="' + dark + '"/>'
        : '<path d="M60 205q0-30 30-38l90-20q50-48 120-48h60q40 0 70 40l60 14q40 10 40 40v17H60z" fill="' + color + '"/><path d="M200 150q40-34 90-34h60q25 0 45 34z" fill="#0b0c0f" opacity=".85"/><circle cx="170" cy="222" r="38" fill="' + dark + '" stroke="#555c68" stroke-width="6"/><circle cx="440" cy="222" r="38" fill="' + dark + '" stroke="#555c68" stroke-width="6"/><circle cx="170" cy="222" r="16" fill="#8a919c"/><circle cx="440" cy="222" r="16" fill="#8a919c"/><rect x="500" y="178" width="40" height="8" rx="4" fill="#fff3c4"/>';
    } else {
      var back = s === 1;
      body = (back ? '<g transform="translate(600 0) scale(-1 1)">' : '<g>') +
        '<circle cx="150" cy="210" r="48" fill="none" stroke="#555c68" stroke-width="12"/><circle cx="450" cy="210" r="48" fill="none" stroke="#555c68" stroke-width="12"/><circle cx="150" cy="210" r="10" fill="#8a919c"/><circle cx="450" cy="210" r="10" fill="#8a919c"/>' +
        '<path d="M150 210l90-70h120l90 70M240 140l-20-30h-50M360 140l50-45h50" stroke="#8a919c" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<path d="M230 140q10-40 60-40h80q20 0 30 30l-30 30H260z" fill="' + color + '"/><path d="M270 105q30-25 70-10l-10 20h-60z" fill="#0b0c0f"/><rect x="250" y="150" width="120" height="40" rx="10" fill="' + dark + '"/></g>';
    }
    return '<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + bg + body + '</svg>';
  }
  var label = function (v) { return v.name + ', ' + v.category + ', cor ' + v.colors[state.colors[v.id]].n; };
  var curColor = function (v) { return v.colors[state.colors[v.id]].c; };

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function renderDetail() {
    var v = state.current, c = v.colors[state.colors[v.id]];
    var a = $('#detail-art'); a.innerHTML = art(v, c.c, 0); a.setAttribute('aria-label', 'Ilustração de ' + label(v));
    $('#hero-art').innerHTML = art(v, c.c, 0);
    $('#detail-type').textContent = v.type === 'carro' ? 'Automóvel · ' + v.category : 'Mota · ' + v.category;
    $('#detail-name').textContent = v.name; $('#detail-tagline').textContent = v.tagline;
    $('#color-name').textContent = c.n;
    var sw = $('#swatches'); sw.innerHTML = '';
    v.colors.forEach(function (col, i) {
      var b = el('button', 'swatch'); b.type = 'button'; b.style.setProperty('--sw', col.c);
      b.setAttribute('aria-label', col.n); b.setAttribute('aria-pressed', i === state.colors[v.id]);
      b.addEventListener('click', function () { state.colors[v.id] = i; renderDetail(); renderCards(); });
      sw.appendChild(b);
    });
    var d = $('#detail-specs'); d.innerHTML = '';
    [['Potência', v.power + ' cv'], ['0–100 km/h', v.accel.toLocaleString('pt-PT') + ' s'], ['Vel. máx.', v.top + ' km/h'], ['Peso', v.weight + ' kg']].forEach(function (p) {
      var w = el('div'); w.appendChild(el('dt', null, p[0])); w.appendChild(el('dd', null, p[1])); d.appendChild(w);
    });
    $('#detail-price').textContent = 'Desde ' + fmtEUR(v.price) + ' (preço fictício)';
  }

  function visible() {
    var q = state.q.trim().toLowerCase();
    var list = V.filter(function (v) {
      return (state.filter === 'todos' || v.type === state.filter) && (!q || (v.name + ' ' + v.category).toLowerCase().indexOf(q) !== -1);
    });
    list.sort(function (a, b) {
      return state.sort === 'potencia' ? b.power - a.power : state.sort === 'preco' ? a.price - b.price : a.name.localeCompare(b.name, 'pt');
    });
    return list;
  }

  function renderCards() {
    var list = visible(), box = $('#cards'); box.innerHTML = '';
    list.forEach(function (v) {
      var card = el('article', 'card');
      var a = el('div', 'card-art'); a.innerHTML = art(v, curColor(v), 0); card.appendChild(a);
      var b = el('div', 'card-body');
      b.appendChild(el('p', 'kicker', v.type === 'carro' ? 'Automóvel' : 'Mota'));
      b.appendChild(el('h3', null, v.name));
      b.appendChild(el('p', null, v.category + ' · ' + v.power + ' cv · ' + fmtEUR(v.price)));
      var act = el('div', 'card-actions');
      var see = el('button', 'button ghost', 'Ver detalhe'); see.type = 'button';
      see.setAttribute('aria-label', 'Ver detalhe de ' + v.name);
      see.addEventListener('click', function () { state.current = v; renderDetail(); $('#destaque').scrollIntoView(); });
      var lab = el('label'); var cb = el('input'); cb.type = 'checkbox'; cb.checked = state.compare.indexOf(v.id) !== -1;
      cb.addEventListener('change', function () { toggleCompare(v.id, cb); });
      lab.appendChild(cb); lab.appendChild(document.createTextNode('Comparar'));
      act.appendChild(see); act.appendChild(lab); b.appendChild(act); card.appendChild(b); box.appendChild(card);
    });
    $('#count').textContent = list.length + (list.length === 1 ? ' modelo' : ' modelos');
    $('#empty').hidden = list.length > 0;
  }

  function toggleCompare(id, cb) {
    var i = state.compare.indexOf(id);
    if (i !== -1) state.compare.splice(i, 1);
    else if (state.compare.length >= 3) { cb.checked = false; renderCompare('Máximo de 3 modelos. Remove um para adicionar outro.'); return; }
    else state.compare.push(id);
    renderCompare();
  }

  function renderCompare(msg) {
    var items = state.compare.map(function (id) { return V.filter(function (v) { return v.id === id; })[0]; });
    var empty = $('#compare-empty'), wrap = $('#compare-wrap'), clear = $('#clear-compare');
    var ok = items.length >= 2;
    wrap.hidden = !ok; clear.hidden = items.length === 0;
    empty.hidden = ok && !msg;
    empty.textContent = msg || (items.length === 0 ? 'Ainda não escolheste modelos. Marca “Comparar” em pelo menos 2 modelos do catálogo.' : 'Escolhe mais um modelo para comparar.');
    if (!ok) return;
    var rows = [
      ['Tipo', function (v) { return v.type === 'carro' ? 'Automóvel' : 'Mota'; }],
      ['Motor', function (v) { return v.engine; }],
      ['Transmissão', function (v) { return v.drive; }],
      ['Potência', function (v) { return v.power + ' cv'; }, 'power', 1],
      ['0–100 km/h', function (v) { return v.accel.toLocaleString('pt-PT') + ' s'; }, 'accel', -1],
      ['Velocidade máx.', function (v) { return v.top + ' km/h'; }, 'top', 1],
      ['Peso', function (v) { return v.weight + ' kg'; }, 'weight', -1],
      ['Preço (fictício)', function (v) { return fmtEUR(v.price); }, 'price', -1]
    ];
    var t = $('#compare-table'); t.innerHTML = '';
    var thead = el('thead'), hr = el('tr'); hr.appendChild(el('th', null, 'Ficha técnica (exemplo)')).scope = 'col';
    items.forEach(function (v) { var th = el('th', null, v.name); th.scope = 'col'; hr.appendChild(th); });
    thead.appendChild(hr); t.appendChild(thead);
    var tb = el('tbody');
    rows.forEach(function (r) {
      var tr = el('tr'), th = el('th', null, r[0]); th.scope = 'row'; tr.appendChild(th);
      var best = null;
      if (r[2]) best = items.reduce(function (m, v) { return (v[r[2]] * r[3] > m[r[2]] * r[3]) ? v : m; }, items[0]);
      items.forEach(function (v) {
        var td = el('td', best && v[r[2]] === best[r[2]] ? 'best' : '', r[1](v));
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
  }

  // Galeria fullscreen
  var gal = $('#gallery'), lastFocus = null;
  function renderShot() {
    var v = state.current;
    $('#gallery-art').innerHTML = art(v, curColor(v), state.shot);
    $('#gallery-art').setAttribute('aria-label', v.name + ' — ' + SHOTS[state.shot]);
    $('#gallery-caption').textContent = v.name + ' · ' + SHOTS[state.shot] + ' (' + (state.shot + 1) + '/' + SHOTS.length + ')';
  }
  function step(d) { state.shot = (state.shot + d + SHOTS.length) % SHOTS.length; renderShot(); }
  $('#open-gallery').addEventListener('click', function () {
    lastFocus = document.activeElement; state.shot = 0; renderShot();
    if (typeof gal.showModal === 'function') gal.showModal(); else gal.setAttribute('open', '');
    $('#gallery-close').focus();
  });
  function closeGal() { if (gal.close) gal.close(); else gal.removeAttribute('open'); if (lastFocus) lastFocus.focus(); }
  $('#gallery-close').addEventListener('click', closeGal);
  $('#gallery-prev').addEventListener('click', function () { step(-1); });
  $('#gallery-next').addEventListener('click', function () { step(1); });
  gal.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
  });
  gal.addEventListener('cancel', function () { if (lastFocus) setTimeout(function () { lastFocus.focus(); }); });

  // Filtros
  document.querySelectorAll('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.filter = b.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
      renderCards();
    });
  });
  $('#pesquisa').addEventListener('input', function (e) { state.q = e.target.value; renderCards(); });
  $('#ordem').addEventListener('change', function (e) { state.sort = e.target.value; renderCards(); });
  $('#reset-filters').addEventListener('click', function () {
    state.q = ''; state.filter = 'todos'; $('#pesquisa').value = '';
    document.querySelectorAll('[data-filter]').forEach(function (o) { o.setAttribute('aria-pressed', o.dataset.filter === 'todos'); });
    renderCards(); $('#pesquisa').focus();
  });
  $('#clear-compare').addEventListener('click', function () { state.compare = []; renderCards(); renderCompare(); });

  // Menu móvel
  var toggle = $('.menu-toggle'), nav = $('#navegacao');
  toggle.addEventListener('click', function () { var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });

  // Formulário demonstrativo
  var sel = $('#modelo');
  sel.appendChild(new Option('Escolhe um modelo', ''));
  V.forEach(function (v) { sel.appendChild(new Option(v.name, v.id)); });
  $('#detail-cta').addEventListener('click', function () { sel.value = state.current.id; });
  var form = $('#form');
  function setErr(id, msg) {
    var f = $('#' + id), e = $('#' + id + '-erro');
    e.hidden = !msg; e.textContent = msg || '';
    if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
    return !msg;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okN = setErr('nome', $('#nome').value.trim().length < 2 ? 'Indica o teu nome.' : '');
    var okE = setErr('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#email').value.trim()) ? '' : 'Indica um email válido.');
    var okM = setErr('modelo', sel.value ? '' : 'Escolhe um modelo.');
    var s = $('#success'); s.hidden = true;
    if (!(okN && okE && okM)) { form.querySelector('[aria-invalid=true]').focus(); return; }
    s.textContent = 'Obrigado, ' + $('#nome').value.trim() + '! (Demonstração) O pedido de test-drive do ' + sel.options[sel.selectedIndex].text + ' não foi enviado a lado nenhum.';
    s.hidden = false; s.focus(); form.reset();
  });

  if (!V.length) { $('#cards').textContent = 'Não foi possível carregar o catálogo.'; return; }
  renderDetail(); renderCards(); renderCompare();
})();
