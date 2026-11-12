const CASES = [
  { id: 'maresia', nome: 'Maresia', cat: 'Identidade', ano: 2024, cliente: 'Conserveira Maresia', texto: 'Reposicionámos uma conserveira familiar de Matosinhos com uma identidade tipográfica que se lê de longe, na lota ou na prateleira.', servicos: 'Estratégia, logótipo, sistema visual', bg: '#ff4d1a', fg: '#0e0e0e' },
  { id: 'tinta-fresca', nome: 'Tinta Fresca', cat: 'Editorial', ano: 2023, cliente: 'Revista Tinta Fresca', texto: 'Redesenho completo de uma revista trimestral de ilustração, com grelha modular e uma capa diferente por edição.', servicos: 'Direção de arte, grelha, paginação', bg: '#0e0e0e', fg: '#f2ede4' },
  { id: 'lume', nome: 'Lume', cat: 'Packaging', ano: 2024, cliente: 'Velas Lume', texto: 'Embalagens em cartão reciclado com serigrafia a duas cores, pensadas para serem reutilizadas como porta-lápis.', servicos: 'Packaging, rótulos, acompanhamento em gráfica', bg: '#e8d9b5', fg: '#a82800' },
  { id: 'norte-sul', nome: 'Norte/Sul', cat: 'Digital', ano: 2025, cliente: 'Cooperativa Norte/Sul', texto: 'Site e sistema de design para uma cooperativa de transportes, com acessibilidade AA e performance como requisito.', servicos: 'Web design, desenvolvimento, motion', bg: '#2a2a8c', fg: '#f2ede4' },
  { id: 'ruido', nome: 'Ruído', cat: 'Identidade', ano: 2022, cliente: 'Festival Ruído', texto: 'Identidade generativa para um festival de música experimental: cada cartaz é único, a regra é sempre a mesma.', servicos: 'Identidade, cartazes, sinalética', bg: '#f2ede4', fg: '#0e0e0e' },
  { id: 'cais', nome: 'Cais', cat: 'Editorial', ano: 2022, cliente: 'Editora Cais', texto: 'Coleção de poesia com capas tipográficas e um miolo que respira: margens generosas, papel quente.', servicos: 'Design de coleção, capas, paginação', bg: '#ff4d1a', fg: '#f2ede4' },
];

const $ = (s, r = document) => r.querySelector(s);
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');

// Menu móvel
const toggle = $('.menu-toggle'), nav = $('#navegacao');
function setMenu(open) { toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); }
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });

// Portefólio
const list = $('#lista-casos'), empty = $('#casos-vazio'), count = $('#casos-estado');
let filter = 'todos', current = -1, visible = CASES;

function art(c) {
  const el = document.createElement('div');
  el.className = 'art';
  el.style.background = c.bg; el.style.color = c.fg;
  el.textContent = c.nome.slice(0, 2);
  return el;
}

// Usa View Transitions quando existem e o utilizador não pediu menos movimento
function transition(fn) {
  if (document.startViewTransition && !prefersReduced.matches) document.startViewTransition(fn); else fn();
}

function renderCases() {
  visible = CASES.filter((c) => filter === 'todos' || c.cat === filter);
  list.replaceChildren(...visible.map((c, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${i * 60}ms`;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'case-card';
    b.setAttribute('aria-label', `Abrir caso ${c.nome}, ${c.cat}, ${c.ano}`);
    b.dataset.id = c.id;
    const info = document.createElement('span');
    info.className = 'info';
    info.innerHTML = '<strong></strong><span></span>';
    info.firstChild.textContent = c.nome; info.lastChild.textContent = `${c.cat} · ${c.ano}`;
    b.append(art(c), info);
    li.append(b);
    return li;
  }));
  empty.hidden = visible.length > 0;
  count.textContent = visible.length ? `A mostrar ${visible.length} de ${CASES.length} casos.` : 'Sem casos para este filtro.';
}

function setFilter(value) {
  filter = value;
  document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
  transition(renderCases);
}
document.addEventListener('click', (e) => {
  const f = e.target.closest('button[data-filter]');
  if (f) setFilter(f.dataset.filter);
  if (e.target.closest('[data-filter-reset]')) setFilter('todos');
});

// Detalhe do caso
const dialog = $('#caso');
let opener = null;
function fillCase(c) {
  $('#caso-visual').replaceChildren(art(c));
  $('#caso-meta').textContent = `${c.cat} · ${c.ano}`;
  $('#caso-titulo').textContent = c.nome;
  $('#caso-texto').textContent = c.texto;
  const dl = $('#caso-factos');
  dl.replaceChildren();
  [['Cliente', c.cliente], ['Serviços', c.servicos]].forEach(([k, v]) => {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = k; dd.textContent = v; dl.append(dt, dd);
  });
}
list.addEventListener('click', (e) => {
  const b = e.target.closest('.case-card');
  if (!b) return;
  opener = b;
  current = visible.findIndex((c) => c.id === b.dataset.id);
  fillCase(visible[current]);
  dialog.showModal();
});
dialog.addEventListener('click', (e) => {
  const step = e.target.closest('[data-case-step]');
  if (step) {
    current = (current + Number(step.dataset.caseStep) + visible.length) % visible.length;
    transition(() => fillCase(visible[current]));
  }
  if (e.target.closest('[data-case-close]') || e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => { if (opener && opener.isConnected) opener.focus(); });

// Briefing
const form = $('#form-briefing'), status = $('#estado-briefing');
const STORE = 'agencia-criativa:briefings';
const rules = {
  nome: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  tipo: (v) => v !== '',
  mensagem: (v) => v.trim().length >= 20,
};
function load() {
  try { const d = JSON.parse(localStorage.getItem(STORE) || '[]'); return Array.isArray(d) ? d : []; } catch { return []; }
}
function renderSaved() {
  const items = load();
  $('#briefings').replaceChildren(...items.map((b) => {
    const li = document.createElement('li');
    li.textContent = `${b.tipo} — ${b.nome} (${b.orcamento}) · ${new Date(b.data).toLocaleDateString('pt-PT')}`;
    return li;
  }));
  $('#briefings-vazio').hidden = items.length > 0;
  $('#limpar').hidden = items.length === 0;
}
function check(field) {
  const ok = rules[field.name](field.value);
  field.setAttribute('aria-invalid', String(!ok));
  $(`#erro-${field.name}`).hidden = ok;
  return ok;
}
Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', (e) => { if (e.target.value) check(e.target); }));
form.elements.mensagem.addEventListener('input', (e) => {
  $('#contador').textContent = `${e.target.value.length} caracteres`;
  if (e.target.getAttribute('aria-invalid') === 'true') check(e.target);
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.className = 'form-status';
  const fields = Object.keys(rules).map((n) => form.elements[n]);
  const results = fields.map(check);
  if (!results.every(Boolean)) {
    status.classList.add('bad');
    status.textContent = `Falta corrigir ${results.filter((r) => !r).length} campo(s).`;
    fields[results.indexOf(false)].focus();
    return;
  }
  const entry = { data: new Date().toISOString(), orcamento: form.elements.orcamento.value };
  Object.keys(rules).forEach((n) => { entry[n] = form.elements[n].value.trim(); });
  try {
    localStorage.setItem(STORE, JSON.stringify([entry, ...load()].slice(0, 10)));
  } catch {
    status.classList.add('bad');
    status.textContent = 'Não foi possível guardar: o browser bloqueou o armazenamento local. Nada foi enviado.';
    return;
  }
  form.reset();
  $('#contador').textContent = '0 caracteres';
  status.classList.add('ok');
  status.textContent = 'Briefing guardado neste browser. Esta demonstração não envia nada nem contacta ninguém.';
  renderSaved();
});
$('#limpar').addEventListener('click', () => {
  try { localStorage.removeItem(STORE); } catch {}
  renderSaved();
  status.className = 'form-status';
  status.textContent = 'Briefings guardados apagados.';
});

renderCases();
renderSaved();
