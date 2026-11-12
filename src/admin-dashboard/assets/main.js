(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const ROLES = ['Administrador', 'Gestor', 'Analista', 'Suporte', 'Leitor'];
  const STATUSES = ['Ativo', 'Pendente', 'Suspenso', 'Inativo'];
  const DEPTS = ['Operações', 'Finanças', 'Logística', 'Apoio ao Cliente', 'Recursos Humanos', 'Tecnologia'];
  const KEY = 'meridiano-users-v1';
  const SEED = [
    ['Marta Figueiredo', 'Administrador', 'Tecnologia', 'Ativo', '2026-11-12'],
    ['Rui Albuquerque', 'Gestor', 'Operações', 'Ativo', '2026-11-12'],
    ['Inês Carvalho', 'Analista', 'Finanças', 'Ativo', '2026-11-11'],
    ['Tiago Nogueira', 'Suporte', 'Apoio ao Cliente', 'Ativo', '2026-11-11'],
    ['Beatriz Matos', 'Gestor', 'Recursos Humanos', 'Pendente', '2026-11-05'],
    ['Duarte Pinheiro', 'Leitor', 'Logística', 'Inativo', '2026-09-28'],
    ['Catarina Sampaio', 'Analista', 'Operações', 'Ativo', '2026-11-10'],
    ['Henrique Lacerda', 'Suporte', 'Apoio ao Cliente', 'Suspenso', '2026-10-14'],
    ['Joana Teixeira', 'Gestor', 'Logística', 'Ativo', '2026-11-09'],
    ['Sérgio Monteiro', 'Analista', 'Tecnologia', 'Ativo', '2026-11-12'],
    ['Leonor Azevedo', 'Leitor', 'Finanças', 'Pendente', '2026-11-03'],
    ['Pedro Vasconcelos', 'Suporte', 'Apoio ao Cliente', 'Ativo', '2026-11-08'],
    ['Filipa Cardoso', 'Administrador', 'Operações', 'Ativo', '2026-11-12'],
    ['Nuno Brandão', 'Leitor', 'Recursos Humanos', 'Inativo', '2026-08-19'],
    ['Sofia Rebelo', 'Analista', 'Finanças', 'Ativo', '2026-11-11'],
    ['André Quintela', 'Gestor', 'Tecnologia', 'Suspenso', '2026-10-30'],
    ['Margarida Sá', 'Suporte', 'Apoio ao Cliente', 'Ativo', '2026-11-12'],
    ['Gonçalo Ferraz', 'Leitor', 'Logística', 'Ativo', '2026-11-06'],
  ].map((r, i) => ({ id: i + 1, name: r[0], email: mail(r[0]), role: r[1], dept: r[2], status: r[3], last: r[4] }));
  const WEEKLY = [212, 231, 224, 248, 267, 259, 281, 296, 288, 310, 327, 342];

  function mail(name) {
    const clean = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/\s+/);
    return `${clean[0]}.${clean[clean.length - 1]}@meridiano.example`;
  }
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = v => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fmtDate = iso => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const today = () => new Date().toISOString().slice(0, 10);
  const initials = n => n.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#2f5d9e', '#475569', '#7c4a1d', '#3f6b4f', '#6b4a8a', '#8a3f4f'];
  const color = n => colors[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];

  const load = () => {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(d)) return d; } catch (e) { /* ignore */ }
    return SEED.map(u => ({ ...u }));
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(users)); } catch (e) { /* ignore */ } };
  let users = load();
  const st = { q: '', role: '', status: '', sort: 'name', dir: 1, page: 1, size: 8, loading: false, error: false };
  const logEntries = [];
  let toastTimer, loadTimer;

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function log(msg) {
    const time = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    logEntries.unshift({ time, msg }); logEntries.length = Math.min(logEntries.length, 30);
    renderLog();
  }
  function renderLog() {
    $('#log').innerHTML = logEntries.length
      ? logEntries.map(e => `<li><time>${e.time}</time><span>${esc(e.msg)}</span></li>`).join('')
      : '<li><span>Ainda sem operações nesta sessão. Crie, edite ou suspenda um utilizador para ver o registo.</span></li>';
  }

  function renderKpis() {
    const active = users.filter(u => u.status === 'Ativo').length;
    const pending = users.filter(u => u.status === 'Pendente').length;
    const rate = users.length ? Math.round(active / users.length * 100) : 0;
    const items = [
      ['Utilizadores totais', users.length, '+4 este mês', 'up'],
      ['Contas ativas', active, `${rate}% do total`, 'up'],
      ['Convites pendentes', pending, pending > 2 ? 'Requer atenção' : 'Dentro do normal', pending > 2 ? 'down' : 'up'],
      ['Tempo médio de resposta', '3h 12m', '−18 min vs. mês anterior', 'up'],
    ];
    $('#kpis').innerHTML = items.map(i => `<li class="kpi"><span class="label">${i[0]}</span><span class="value">${i[1]}</span><span class="delta ${i[3]}">${i[2]}</span></li>`).join('');
  }

  function renderCharts() {
    const W = 560, H = 220, p = { l: 34, r: 12, t: 14, b: 26 }, max = 400;
    const x = i => p.l + i * (W - p.l - p.r) / (WEEKLY.length - 1);
    const y = v => p.t + (1 - v / max) * (H - p.t - p.b);
    const pts = WEEKLY.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    let g = '';
    for (let v = 0; v <= max; v += 100) g += `<line class="grid" x1="${p.l}" x2="${W - p.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${p.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    const labels = WEEKLY.map((_, i) => i % 2 === 0 ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">S${i + 1}</text>` : '').join('');
    $('#line-chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${g}${labels}<polygon class="area" points="${p.l},${y(0)} ${pts.join(' ')} ${x(WEEKLY.length - 1)},${y(0)}"/><polyline class="line" points="${pts.join(' ')}"/><circle class="dot" cx="${x(WEEKLY.length - 1)}" cy="${y(WEEKLY.at(-1))}" r="4"/></svg>`;
    $('#line-table').innerHTML = '<caption class="sr-only">Pedidos por semana</caption><tr><th scope="col">Semana</th><th scope="col">Pedidos</th></tr>' + WEEKLY.map((v, i) => `<tr><td>S${i + 1}</td><td>${v}</td></tr>`).join('');

    const counts = DEPTS.map(d => [d, users.filter(u => u.dept === d).length]).sort((a, b) => b[1] - a[1]);
    const bh = 26, gap = 12, lw = 120, bw = 560 - lw - 40, bmax = Math.max(1, ...counts.map(c => c[1]));
    $('#bar-chart').innerHTML = `<svg viewBox="0 0 560 ${counts.length * (bh + gap)}" aria-hidden="true">` + counts.map((c, i) => {
      const w = Math.max(2, c[1] / bmax * bw), yy = i * (bh + gap);
      return `<text x="0" y="${yy + 17}">${esc(c[0])}</text><rect class="bar${i === 0 ? ' top' : ''}" x="${lw}" y="${yy}" width="${w}" height="${bh}" rx="4" style="animation-delay:${i * 60}ms"/><text class="val" x="${lw + w + 6}" y="${yy + 17}">${c[1]}</text>`;
    }).join('') + '</svg>';
    $('#bar-table').innerHTML = '<caption class="sr-only">Utilizadores por departamento</caption><tr><th scope="col">Departamento</th><th scope="col">Utilizadores</th></tr>' + counts.map(c => `<tr><td>${esc(c[0])}</td><td>${c[1]}</td></tr>`).join('');
  }

  function filtered() {
    const q = slug(st.q.trim());
    const list = users.filter(u => (!st.role || u.role === st.role) && (!st.status || u.status === st.status)
      && (!q || slug(`${u.name} ${u.email} ${u.dept}`).includes(q)));
    const k = st.sort;
    return list.sort((a, b) => st.dir * String(a[k]).localeCompare(String(b[k]), 'pt') || a.id - b.id);
  }

  function showState(html) { const s = $('#state'); s.hidden = !html; s.innerHTML = html || ''; }

  function renderTable() {
    const rows = $('#rows');
    document.querySelectorAll('#users-table th[aria-sort]').forEach(th => {
      const k = th.querySelector('.sort').dataset.sort;
      th.setAttribute('aria-sort', k === st.sort ? (st.dir > 0 ? 'ascending' : 'descending') : 'none');
    });
    $('#users-table').setAttribute('aria-busy', st.loading);
    if (st.loading) {
      rows.innerHTML = Array.from({ length: Math.min(st.size, 6) }, () => '<tr class="skeleton" aria-hidden="true">' + '<td><div style="width:160px"></div></td>'.repeat(1) + '<td><div style="width:90px"></div></td>'.repeat(3) + '<td><div style="width:80px"></div></td><td><div style="width:70px"></div></td></tr>').join('');
      showState('<span>A carregar utilizadores…</span>'); $('#range').textContent = ''; setPager(0, 1); return;
    }
    if (st.error) {
      rows.innerHTML = '';
      showState('<strong>Não foi possível carregar os utilizadores</strong><span>Ocorreu um erro simulado. Os dados locais continuam intactos.</span><button type="button" class="btn primary" id="retry">Tentar novamente</button>');
      $('#range').textContent = ''; setPager(0, 1); return;
    }
    const list = filtered(), pages = Math.max(1, Math.ceil(list.length / st.size));
    st.page = Math.min(st.page, pages);
    const start = (st.page - 1) * st.size, view = list.slice(start, start + st.size);
    $('#count-chip').textContent = `${list.length} de ${users.length}`;
    if (!view.length) {
      rows.innerHTML = '';
      const filtering = st.q || st.role || st.status;
      showState(filtering
        ? '<strong>Nenhum utilizador corresponde à pesquisa</strong><span>Experimente outros termos ou remova os filtros.</span><button type="button" class="btn" id="empty-clear">Limpar filtros</button>'
        : '<strong>Ainda não existem utilizadores</strong><span>Crie o primeiro utilizador ou reponha os dados de demonstração.</span><button type="button" class="btn primary" id="empty-new">+ Novo utilizador</button>');
      $('#range').textContent = '0 resultados'; setPager(0, 1); return;
    }
    showState('');
    rows.innerHTML = view.map(u => `<tr data-id="${u.id}">
      <td><div class="person"><span class="avatar" style="background:${color(u.name)}" aria-hidden="true">${esc(initials(u.name))}</span><div><strong>${esc(u.name)}</strong><span class="mail">${esc(u.email)}</span></div></div></td>
      <td>${esc(u.role)}</td><td>${esc(u.dept)}</td><td><span class="badge ${slug(u.status)}">${esc(u.status)}</span></td><td>${fmtDate(u.last)}</td>
      <td><div class="actions"><button type="button" class="btn" data-act="edit" aria-label="Editar ${esc(u.name)}">Editar</button>
      <button type="button" class="btn" data-act="toggle" aria-label="${u.status === 'Suspenso' ? 'Reativar' : 'Suspender'} ${esc(u.name)}">${u.status === 'Suspenso' ? 'Reativar' : 'Suspender'}</button>
      <button type="button" class="btn" data-act="delete" aria-label="Remover ${esc(u.name)}">Remover</button></div></td></tr>`).join('');
    $('#range').textContent = `${start + 1}–${start + view.length} de ${list.length}`;
    setPager(list.length, pages);
  }
  function setPager(n, pages) {
    $('#page-label').textContent = `Página ${st.page} de ${pages}`;
    $('#prev').disabled = st.loading || st.error || st.page <= 1;
    $('#next').disabled = st.loading || st.error || st.page >= pages;
  }

  // Simulated async load with skeleton
  function reload(fail) {
    clearTimeout(loadTimer);
    st.loading = true; st.error = false; renderTable();
    loadTimer = setTimeout(() => { st.loading = false; st.error = !!fail; renderTable(); }, 700);
  }
  function refresh() { renderKpis(); renderCharts(); renderTable(); }

  // Filters
  function fillSelect(sel, items, all) {
    sel.innerHTML = (all ? '<option value="">' + all + '</option>' : '') + items.map(i => `<option>${i}</option>`).join('');
  }
  fillSelect($('#f-role'), ROLES, 'Todas'); fillSelect($('#f-status'), STATUSES, 'Todos');
  const form = $('#user-form');
  fillSelect(form.role, ROLES); fillSelect(form.dept, DEPTS); fillSelect(form.status, STATUSES);

  let searchTimer;
  $('#q').addEventListener('input', e => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { st.q = e.target.value; st.page = 1; renderTable(); }, 150); });
  $('#f-role').addEventListener('change', e => { st.role = e.target.value; st.page = 1; renderTable(); });
  $('#f-status').addEventListener('change', e => { st.status = e.target.value; st.page = 1; renderTable(); });
  $('#page-size').addEventListener('change', e => { st.size = +e.target.value; st.page = 1; renderTable(); });
  $('#filters').addEventListener('submit', e => e.preventDefault());
  function clearFilters() { st.q = st.role = st.status = ''; st.page = 1; $('#q').value = ''; $('#f-role').value = ''; $('#f-status').value = ''; renderTable(); }
  $('#clear-filters').addEventListener('click', clearFilters);
  $('#simulate-error').addEventListener('click', () => reload(true));
  $('#prev').addEventListener('click', () => { st.page--; renderTable(); });
  $('#next').addEventListener('click', () => { st.page++; renderTable(); });
  document.querySelectorAll('.sort').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.sort; st.dir = st.sort === k ? -st.dir : 1; st.sort = k; st.page = 1; renderTable();
  }));
  $('#state').addEventListener('click', e => {
    const id = e.target.id;
    if (id === 'retry') reload(false);
    if (id === 'empty-clear') clearFilters();
    if (id === 'empty-new') openForm();
  });

  // Row actions
  const find = id => users.find(u => u.id === id);
  $('#rows').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const u = find(+b.closest('tr').dataset.id); if (!u) return;
    if (b.dataset.act === 'edit') openForm(u, b);
    if (b.dataset.act === 'toggle') {
      u.status = u.status === 'Suspenso' ? 'Ativo' : 'Suspenso';
      save(); refresh(); log(`${u.name} ${u.status === 'Ativo' ? 'reativado(a)' : 'suspenso(a)'}.`);
      toast(`${u.name}: estado alterado para ${u.status}.`);
    }
    if (b.dataset.act === 'delete') confirmDelete(u);
  });

  // Dialogs
  const dlg = $('#user-dialog'), cdlg = $('#confirm-dialog');
  let editing = null, opener = null;
  function openForm(u, from) {
    editing = u || null; opener = from || $('#new-user');
    form.reset(); form.querySelectorAll('.err').forEach(s => s.textContent = '');
    form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
    $('#dialog-title').textContent = u ? 'Editar utilizador' : 'Novo utilizador';
    if (u) { form.name.value = u.name; form.email.value = u.email; form.role.value = u.role; form.dept.value = u.dept; form.status.value = u.status; }
    else form.status.value = 'Pendente';
    dlg.showModal(); form.name.focus();
  }
  $('#new-user').addEventListener('click', () => openForm());
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (opener && opener.isConnected) opener.focus(); else $('#new-user').focus(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim().toLowerCase();
    const errs = {};
    if (name.length < 3) errs.name = 'Indique o nome completo (mínimo 3 caracteres).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Indique um email válido.';
    else if (users.some(u => u.email === email && u !== editing)) errs.email = 'Este email já está registado.';
    for (const f of ['name', 'email']) {
      $('#e-' + f).textContent = errs[f] || '';
      if (errs[f]) form[f].setAttribute('aria-invalid', 'true'); else form[f].removeAttribute('aria-invalid');
    }
    const first = ['name', 'email'].find(f => errs[f]);
    if (first) { form[first].focus(); return; }
    const data = { name, email, role: form.role.value, dept: form.dept.value, status: form.status.value };
    if (editing) { Object.assign(editing, data); log(`Dados de ${name} atualizados.`); toast('Utilizador atualizado.'); }
    else { users.push({ id: Math.max(0, ...users.map(u => u.id)) + 1, ...data, last: '' }); log(`Utilizador ${name} criado (${data.role}).`); toast('Utilizador criado.'); }
    save(); dlg.close(); refresh();
  });
  function confirmDelete(u) {
    $('#confirm-text').textContent = `Tem a certeza de que pretende remover ${u.name}? Esta ação é simulada e pode ser anulada com "Repor dados".`;
    cdlg.returnValue = ''; cdlg.dataset.id = u.id; cdlg.showModal(); $('#confirm-ok').focus();
  }
  cdlg.addEventListener('close', () => {
    if (cdlg.returnValue !== 'ok') return;
    const u = find(+cdlg.dataset.id); if (!u) return;
    users = users.filter(x => x !== u); save(); refresh(); log(`Utilizador ${u.name} removido.`); toast('Utilizador removido.');
    $('#q').focus();
  });

  $('#reset-data').addEventListener('click', () => {
    users = SEED.map(u => ({ ...u })); save(); clearFilters(); refresh(); log('Dados de demonstração repostos.'); toast('Dados repostos.');
  });

  // Mobile sidebar and active nav
  const side = $('#sidebar'), scrim = $('#scrim'), menu = $('#menu-btn');
  function setMenu(open) {
    side.classList.toggle('open', open); scrim.hidden = !open;
    menu.setAttribute('aria-expanded', open); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) side.querySelector('a').focus();
  }
  menu.addEventListener('click', () => setMenu(!side.classList.contains('open')));
  scrim.addEventListener('click', () => { setMenu(false); menu.focus(); });
  side.addEventListener('click', e => { if (e.target.closest('nav a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && side.classList.contains('open')) { setMenu(false); menu.focus(); } });
  const links = [...side.querySelectorAll('nav a')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.setAttribute('aria-current', String(l.hash === '#' + en.target.id)));
    }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(l => { const t = document.querySelector(l.hash); if (t) io.observe(t); });
  }

  renderLog(); renderKpis(); renderCharts(); reload(false);
})();
