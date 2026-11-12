(() => {
'use strict';
const $ = s => document.querySelector(s);
const KEY = 'lume-chat-v1';
const ASSISTANTS = [
  {id:'redator', name:'Redator', tone:'Claro e direto. Ajudo a escrever e a reformular textos.', starters:['Reescreve este parágrafo de forma mais clara','Sugere um título para um artigo sobre trabalho remoto','Resume uma reunião em três pontos']},
  {id:'analista', name:'Analista', tone:'Estruturo dados e decisões em passos verificáveis.', starters:['Compara duas opções de alojamento web','Como organizo um plano de trimestre?','Que métricas acompanhar numa loja online?']},
  {id:'tutor', name:'Tutor', tone:'Explico conceitos com exemplos simples.', starters:['Explica o que é uma API como se tivesse 12 anos','Dá-me um plano de estudo de inglês em 4 semanas','Qual a diferença entre var, let e const?']}
];
const MODELS = [
  {id:'aurora-1', name:'Aurora 1 (demo)', speed:14},
  {id:'zefiro-mini', name:'Zéfiro Mini (demo)', speed:7},
  {id:'brisa-pro', name:'Brisa Pro (demo)', speed:24}
];
const REPLIES = {
  redator:[
    'Aqui fica uma proposta mais enxuta:\n\n«Menos ruído, mais clareza: cada frase deve ter uma única ideia e um verbo forte.»\n\nSe quiser, ajusto o tom (mais formal ou mais próximo) e o tamanho.',
    'Três ideias de abertura:\n\n1. Comece pelo resultado, não pelo contexto.\n2. Use um exemplo concreto nas primeiras duas linhas.\n3. Termine com uma ação clara para o leitor.'
  ],
  analista:[
    'Sugiro avaliar em três passos:\n\n1. Definir o critério principal (custo, prazo ou risco).\n2. Pontuar cada opção de 1 a 5.\n3. Validar a opção vencedora com um pequeno teste.\n\nPosso montar a tabela comparativa se me indicar as opções.',
    'Para acompanhar o progresso, comece por poucas métricas: taxa de conversão, valor médio por encomenda e tempo até à primeira compra. Reveja-as semanalmente.'
  ],
  tutor:[
    'Pense numa API como o empregado de mesa de um restaurante: o cliente (a sua aplicação) faz o pedido, o empregado leva-o à cozinha (o servidor) e traz o prato de volta. Não precisa de saber cozinhar — só de pedir bem.',
    'Plano simples: semana 1 — vocabulário do dia a dia; semana 2 — compreensão oral com pequenos vídeos; semana 3 — escrita de mensagens curtas; semana 4 — conversação com revisão de erros.'
  ]
};
const FALLBACK = 'Esta é uma resposta simulada: não consulto nenhum modelo real. Em produção, aqui apareceria a resposta do modelo escolhido.';
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();
const seed = () => {
  const t = now();
  return {active:'c1', theme:null, chats:[
    {id:'c1', title:'Ideias para o boletim de novembro', assistant:'redator', model:'aurora-1', updated:t, messages:[
      {role:'user', text:'Preciso de três ideias para o boletim de novembro da associação.'},
      {role:'assistant', text:'Três propostas:\n\n1. «Um ano de voluntariado em números» — um balanço visual.\n2. Perfil de um voluntário do mês.\n3. Calendário de ações até ao Natal.\n\nQuer que desenvolva alguma delas?', model:'aurora-1'}]},
    {id:'c2', title:'Plano de estudo de inglês', assistant:'tutor', model:'zefiro-mini', updated:t-86400000, messages:[]}
  ]};
};
let state;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch { state = null; }
if (!state || !Array.isArray(state.chats)) state = seed();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* armazenamento indisponível: continua em memória */ } };
let streaming = null, pendingId = null, query = '';
const chat = () => state.chats.find(c => c.id === state.active);
const asst = id => ASSISTANTS.find(a => a.id === id) || ASSISTANTS[0];
const model = id => MODELS.find(m => m.id === id) || MODELS[0];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function fmtDate(t) {
  const d = new Date(t), today = new Date();
  return d.toDateString() === today.toDateString() ? d.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'}) : d.toLocaleDateString('pt-PT', {day:'numeric', month:'short'});
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 1800); }

function renderPickers() {
  $('#assistant').replaceChildren(...ASSISTANTS.map(a => Object.assign(el('option', '', a.name), {value:a.id})));
  $('#model').replaceChildren(...MODELS.map(m => Object.assign(el('option', '', m.name), {value:m.id})));
}
function renderList() {
  const list = $('#chat-list'), q = query.trim().toLowerCase();
  const items = state.chats.filter(c => !q || c.title.toLowerCase().includes(q)).sort((a, b) => b.updated - a.updated);
  list.replaceChildren(...items.map(c => {
    const li = el('li', 'chat-item' + (c.id === state.active ? ' active' : ''));
    const open = el('button', 'chat-open'); open.type = 'button'; open.dataset.id = c.id;
    if (c.id === state.active) open.setAttribute('aria-current', 'true');
    open.append(el('b', '', c.title), el('small', '', `${asst(c.assistant).name} · ${fmtDate(c.updated)}`));
    const act = el('div', 'chat-actions');
    for (const [a, label, icon] of [['rename', 'Renomear', '✎'], ['delete', 'Apagar', '🗑']]) {
      const b = el('button', '', icon); b.type = 'button'; b.dataset.act = a; b.dataset.id = c.id; b.setAttribute('aria-label', `${label} conversa ${c.title}`); act.append(b);
    }
    li.append(open, act); return li;
  }));
  const empty = $('#list-empty');
  empty.hidden = items.length > 0;
  empty.textContent = q ? `Nenhuma conversa corresponde a «${query.trim()}».` : 'Ainda não tem conversas. Crie a primeira.';
}
function msgNode(m, i, last) {
  const n = el('article', 'msg ' + (m.role === 'user' ? 'user' : 'assistant') + (m.error ? ' error' : ''));
  n.dataset.i = i;
  const who = el('div', 'who');
  if (m.role === 'user') who.append('Você');
  else { who.append(el('span', 'tag', 'DEMO'), `${asst(chat().assistant).name} · ${model(m.model).name}`); }
  n.append(who, el('div', 'body', m.text));
  if (m.role !== 'user') {
    const act = el('div', 'msg-actions');
    const mk = (a, t) => { const b = el('button', '', t); b.type = 'button'; b.dataset.act = a; b.dataset.i = i; return b; };
    if (!m.error) act.append(mk('copy', '⧉ Copiar'));
    if (last || m.error) act.append(mk('retry', m.error ? '↻ Tentar de novo' : '↻ Regenerar'));
    n.append(act);
  }
  return n;
}
function renderThread() {
  const c = chat(), th = $('#thread');
  th.replaceChildren();
  if (!c) { $('#empty').hidden = false; $('#empty-title').textContent = 'Sem conversa aberta'; $('#empty-text').textContent = 'Crie uma nova conversa para começar.'; $('#suggestions').replaceChildren(); return; }
  const empty = !c.messages.length && !streaming;
  $('#empty').hidden = !empty;
  if (empty) {
    $('#empty-title').textContent = 'Por onde começamos?';
    $('#empty-text').textContent = asst(c.assistant).tone;
    $('#suggestions').replaceChildren(...asst(c.assistant).starters.map(s => { const li = el('li'), b = el('button', '', s); b.type = 'button'; b.dataset.s = s; li.append(b); return li; }));
  }
  c.messages.forEach((m, i) => th.append(msgNode(m, i, i === c.messages.length - 1)));
  if (streaming) {
    const n = el('article', 'msg assistant'); n.id = 'live';
    const who = el('div', 'who'); who.append(el('span', 'tag', 'DEMO'), `${asst(c.assistant).name} · ${model(c.model).name}`);
    const body = el('div', 'body'); body.id = 'live-body';
    body.innerHTML = '<span class="typing" role="img" aria-label="A escrever"><i></i><i></i><i></i></span>';
    n.append(who, body); th.append(n);
  }
  scrollEnd();
}
function renderHead() {
  const c = chat();
  $('#chat-title').textContent = c ? c.title : 'Lume Chat';
  $('#assistant').value = c ? c.assistant : ASSISTANTS[0].id;
  $('#model').value = c ? c.model : MODELS[0].id;
  $('#assistant').disabled = $('#model').disabled = !c;
  $('#composer-input').disabled = !c;
  $('#send').disabled = !c || !!streaming;
  $('#stop').hidden = !streaming;
  $('#send').hidden = !!streaming;
  document.title = (c ? c.title + ' | ' : '') + 'Lume Chat (demo)';
}
function renderAll() { renderList(); renderHead(); renderThread(); }
function scrollEnd() { const m = $('#main'); m.scrollTop = m.scrollHeight; }

function newChat() {
  const c = {id:uid(), title:'Nova conversa', assistant:ASSISTANTS[0].id, model:MODELS[0].id, updated:now(), messages:[]};
  state.chats.unshift(c); state.active = c.id; stopStream(); save(); closeSidebar(); renderAll(); $('#composer-input').focus();
}
function setActive(id) { if (id === state.active) { closeSidebar(); return; } stopStream(); state.active = id; save(); hideError(); closeSidebar(); renderAll(); }
function showError(t) { const e = $('#error'); e.textContent = t; e.hidden = false; }
function hideError() { $('#error').hidden = true; }

function stopStream(commit) {
  if (!streaming) return;
  clearTimeout(streaming.timer);
  const s = streaming; streaming = null;
  const c = state.chats.find(x => x.id === s.chatId);
  if (c && commit && s.shown) { c.messages.push({role:'assistant', text:s.shown + ' …(interrompida)', model:c.model}); save(); }
  renderAll();
}
function replyFor(c, text) {
  const pool = REPLIES[c.assistant] || [];
  const base = pool.length ? pool[(c.messages.filter(m => m.role === 'assistant').length) % pool.length] : FALLBACK;
  return /[?]|explica|sugere|compara|resume/i.test(text) ? base : `Percebi: «${text.slice(0, 80)}${text.length > 80 ? '…' : ''}».\n\n${base}`;
}
function respond(c, text) {
  hideError();
  streaming = {chatId:c.id, shown:'', timer:null};
  renderAll();
  const failing = /^\/erro\b/i.test(text);
  const full = replyFor(c, text), step = model(c.model).speed;
  const live = () => $('#live-body');
  streaming.timer = setTimeout(() => {
    if (failing) {
      streaming = null;
      c.messages.push({role:'assistant', text:'Não foi possível gerar a resposta (erro simulado). Tente novamente.', model:c.model, error:true});
      save(); renderAll(); showError('Falha simulada. Use «Tentar de novo» ou envie outra mensagem.'); return;
    }
    let i = 0;
    const tick = () => {
      if (!streaming) return;
      i = reduced.matches ? full.length : Math.min(full.length, i + 2);
      streaming.shown = full.slice(0, i);
      const b = live(); if (b) { b.textContent = streaming.shown; b.classList.toggle('caret', i < full.length); }
      scrollEnd();
      if (i >= full.length) {
        streaming = null;
        c.messages.push({role:'assistant', text:full, model:c.model}); c.updated = now(); save(); renderAll();
      } else streaming.timer = setTimeout(tick, 1000 / step * 2);
    };
    tick();
  }, reduced.matches ? 0 : 600);
}
function send(text) {
  const c = chat(); text = text.trim();
  if (!c || !text || streaming) return;
  if (c.messages.length === 0 && c.title === 'Nova conversa') c.title = text.replace(/\s+/g, ' ').slice(0, 40);
  c.messages.push({role:'user', text}); c.updated = now(); save();
  const input = $('#composer-input'); input.value = ''; autosize();
  respond(c, text);
}
function retry(i) {
  const c = chat(); if (!c || streaming) return;
  c.messages = c.messages.slice(0, i);
  const lastUser = [...c.messages].reverse().find(m => m.role === 'user');
  if (!lastUser) { save(); renderAll(); return; }
  respond(c, lastUser.text.replace(/^\/erro\b\s*/i, '') || 'Tenta outra vez');
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('Resposta copiada'); }
  catch {
    const ta = el('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0'; document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { /* sem suporte */ }
    ta.remove(); toast(ok ? 'Resposta copiada' : 'Não foi possível copiar');
  }
}
function autosize() {
  const t = $('#composer-input'); t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 200) + 'px';
  $('#counter').textContent = `${t.value.length}/2000`;
}

const app = $('#app');
function openSidebar() { app.classList.add('open'); $('#open-sidebar').setAttribute('aria-expanded', 'true'); }
function closeSidebar() { app.classList.remove('open'); $('#open-sidebar').setAttribute('aria-expanded', 'false'); }
function toggleSidebar() {
  if (matchMedia('(max-width:820px)').matches) app.classList.contains('open') ? closeSidebar() : openSidebar();
  else app.classList.toggle('collapsed');
}
function applyTheme(t) { document.documentElement.dataset.theme = t; $('#theme').setAttribute('aria-pressed', String(t === 'dark')); }

function askRename(id) {
  const c = state.chats.find(x => x.id === id); if (!c) return;
  pendingId = id; $('#rename-input').value = c.title; $('#rename-dialog').showModal(); $('#rename-input').select();
}
function askDelete(id) {
  const c = state.chats.find(x => x.id === id); if (!c) return;
  pendingId = id; $('#delete-text').textContent = `A conversa «${c.title}» será apagada deste navegador. Esta ação não pode ser anulada.`; $('#delete-dialog').showModal();
}

document.addEventListener('DOMContentLoaded', () => {
  renderPickers();
  applyTheme(document.documentElement.dataset.theme);
  if (!state.chats.some(c => c.id === state.active)) state.active = state.chats[0]?.id || null;
  renderAll();
  $('#new-chat').onclick = newChat;
  $('#open-sidebar').onclick = openSidebar; $('#close-sidebar').onclick = closeSidebar; $('#scrim').onclick = closeSidebar;
  $('#search').oninput = e => { query = e.target.value; renderList(); };
  $('#chat-list').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'rename') askRename(b.dataset.id);
    else if (b.dataset.act === 'delete') askDelete(b.dataset.id);
    else setActive(b.dataset.id);
  });
  $('#thread').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const i = +b.dataset.i;
    if (b.dataset.act === 'copy') copyText(chat().messages[i].text); else retry(i);
  });
  $('#suggestions').addEventListener('click', e => { const b = e.target.closest('button'); if (b) send(b.dataset.s); });
  $('#assistant').onchange = e => { const c = chat(); c.assistant = e.target.value; save(); renderAll(); };
  $('#model').onchange = e => { const c = chat(); c.model = e.target.value; save(); toast(`Modelo: ${model(c.model).name}`); };
  $('#theme').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); try { localStorage.setItem('lume-theme', t); } catch { /* ignora */ } };
  $('#composer').onsubmit = e => { e.preventDefault(); send($('#composer-input').value); };
  $('#stop').onclick = () => stopStream(true);
  $('#composer-input').addEventListener('input', autosize);
  $('#composer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(e.target.value); }
  });
  for (const d of document.querySelectorAll('dialog')) d.addEventListener('click', e => { if (e.target.matches('[data-close]') || e.target === d) d.close(); });
  $('#rename-form').onsubmit = () => {
    const c = state.chats.find(x => x.id === pendingId), v = $('#rename-input').value.trim();
    if (c && v) { c.title = v; save(); renderAll(); toast('Conversa renomeada'); }
  };
  $('#delete-form').onsubmit = () => {
    if (pendingId === state.active) stopStream();
    state.chats = state.chats.filter(c => c.id !== pendingId);
    if (!chat()) state.active = state.chats[0]?.id || null;
    save(); renderAll(); toast('Conversa apagada');
  };
  $('#show-help').onclick = () => $('#help-dialog').showModal();
  $('#reset-data').onclick = () => { stopStream(); state = seed(); save(); hideError(); renderAll(); toast('Dados de demonstração repostos'); };
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); newChat(); }
    else if (e.altKey && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleSidebar(); }
    else if (e.key === 'Escape') { if (streaming) stopStream(true); else closeSidebar(); }
    else if (!typing && !document.querySelector('dialog[open]') && e.key === '/') { e.preventDefault(); $('#composer-input').focus(); }
    else if (!typing && !document.querySelector('dialog[open]') && e.key === '?') { $('#help-dialog').showModal(); }
  });
});
})();
