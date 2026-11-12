(function () {
  var root = document.documentElement;
  var themeBtn = document.querySelector('#theme-toggle');
  function syncTheme() {
    var dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    document.querySelector('#theme-label').textContent = dark ? 'Escuro' : 'Claro';
  }
  themeBtn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  var menu = document.querySelector('.menu-toggle');
  var nav = document.querySelector('#nav');
  function setMenu(open) { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
  });

  // Filtros de projetos
  var items = Array.prototype.slice.call(document.querySelectorAll('.project'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  function applyFilter(value) {
    var shown = 0;
    items.forEach(function (li) {
      var match = value === 'todos' || li.dataset.cat.split(' ').indexOf(value) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });
    filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === value)); });
    document.querySelector('#count').textContent = shown + ' de ' + items.length + ' projetos';
    document.querySelector('#empty').hidden = shown !== 0;
  }
  filters.forEach(function (b) { b.addEventListener('click', function () { applyFilter(b.dataset.filter); }); });
  document.querySelector('#reset').addEventListener('click', function () { applyFilter('todos'); });

  // Detalhe do projeto
  var dialog = document.querySelector('#dialog');
  var opener = null;
  items.forEach(function (li) {
    li.querySelector('[data-open]').addEventListener('click', function (e) {
      opener = e.currentTarget;
      document.querySelector('#d-title').textContent = li.querySelector('.ptitle').textContent;
      document.querySelector('#d-body').innerHTML = li.querySelector('.detail').innerHTML;
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    });
  });
  document.querySelector('#d-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { if (opener) opener.focus(); });

  // Copiar email
  var status = document.querySelector('#copy-status');
  var copyBtn = document.querySelector('#copy');
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    return ok;
  }
  copyBtn.addEventListener('click', function () {
    var text = document.querySelector('#email').textContent;
    function done(ok) {
      status.textContent = ok ? 'Email copiado.' : 'Não foi possível copiar. Selecione o email manualmente.';
      copyBtn.textContent = ok ? 'Copiado ✓' : 'Copiar email';
      setTimeout(function () { copyBtn.textContent = 'Copiar email'; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else done(fallbackCopy(text));
  });

  // Formulário
  var form = document.querySelector('#form');
  var rules = [
    ['name', function (v) { return v.trim().length < 2 ? 'Indique o seu nome.' : ''; }],
    ['mail', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Indique um email válido, por exemplo nome@dominio.pt.'; }],
    ['msg', function (v) { return v.trim().length < 20 ? 'A mensagem deve ter pelo menos 20 caracteres.' : ''; }]
  ];
  function check(id, rule) {
    var input = document.getElementById(id), err = document.getElementById(id + '-err');
    var message = rule(input.value);
    err.textContent = message; err.hidden = !message;
    input.setAttribute('aria-invalid', String(!!message));
    return !message;
  }
  rules.forEach(function (r) { document.getElementById(r[0]).addEventListener('blur', function () { check(r[0], r[1]); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    rules.forEach(function (r) { if (!check(r[0], r[1]) && !firstBad) firstBad = r[0]; });
    var ok = document.querySelector('#form-ok');
    ok.hidden = !!firstBad;
    if (firstBad) document.getElementById(firstBad).focus(); else form.reset();
  });
})();
