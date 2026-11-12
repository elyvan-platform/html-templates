'use strict';
(() => {
  const O = window.Oportuna;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
  const bullets = items => `<ul class="bullets">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const BOOKMARK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></svg>';
  const KEY = 'oportuna-saved';
  const FIELDS = {name:'apply-name', email:'apply-email', phone:'apply-phone', cv:'apply-cv', motivation:'apply-motivation', consent:'apply-consent'};
  const narrow = matchMedia('(max-width: 1099px)');
  const state = {query:'', area:'', location:'', remote:'all', sort:'recent', savedOnly:false, saved:[], applied:[], selected:null};
  const dialog = $('#apply-dialog');
  const form = $('#apply-form');
  let attempted = false, opener = null, noticeTimer;

  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(stored)) state.saved = stored.filter(id => O.jobs.some(job => job.id === id));
  } catch {}

  const job = id => O.jobs.find(item => item.id === id);
  const isSaved = id => state.saved.includes(id);
  const isApplied = id => state.applied.includes(id);
  const unique = key => [...new Set(O.jobs.map(item => item[key]))].sort((a, b) => a.localeCompare(b, 'pt'));

  function notify(message) {
    const notice = $('#notice');
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { notice.hidden = true; }, 4000);
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.saved));
    } catch {
      notify('O armazenamento do navegador não está disponível. As vagas guardadas ficam só nesta sessão.');
    }
  }

  function visibleJobs() {
    return O.filterJobs({
      query: state.query, area: state.area, location: state.location, remote: state.remote, sort: state.sort,
      saved: state.savedOnly ? state.saved : null
    });
  }

  function rowTemplate(item) {
    const current = item.id === state.selected;
    const applied = isApplied(item.id) ? ' · <b class="badge">Candidatura simulada</b>' : '';
    return `<li class="job-row${current ? ' is-current' : ''}">
      <a class="job-link" href="?vaga=${encodeURIComponent(item.id)}" data-open="${item.id}"${current ? ' aria-current="true"' : ''}>
        <span class="logo tone-${item.tone}" aria-hidden="true">${esc(item.initials)}</span>
        <span class="job-main">
          <span class="job-title">${esc(item.title)}</span>
          <span class="job-company">${esc(item.company)} · ${esc(item.location)}</span>
          <span class="job-meta">${esc(item.modality)} · ${esc(O.formatSalary(item.salary))}${applied}</span>
        </span>
      </a>
      <button type="button" class="save" data-save="${item.id}" aria-pressed="${isSaved(item.id)}" aria-label="Guardar ${esc(item.title)}">${BOOKMARK}</button>
    </li>`;
  }

  function renderList() {
    const list = visibleJobs();
    const count = list.length;
    const noun = count === 1 ? 'vaga' : 'vagas';
    const adjective = state.savedOnly ? (count === 1 ? 'guardada' : 'guardadas') : (count === 1 ? 'disponível' : 'disponíveis');
    $('#results-count').textContent = `${count} ${noun} ${adjective}`;
    $('#job-list').innerHTML = list.map(rowTemplate).join('');
    $('#job-list').hidden = count === 0;
    $('#list-empty').hidden = count > 0;
    if (count === 0) {
      const noneSaved = state.savedOnly && state.saved.length === 0;
      $('#list-empty-title').textContent = noneSaved ? 'Ainda não guardou vagas' : 'Nenhuma vaga corresponde à pesquisa';
      $('#list-empty-copy').textContent = noneSaved ? 'Use o marcador numa vaga para a encontrar aqui.' : 'Experimente outra palavra-chave, área ou localização.';
      $('#list-reset').textContent = noneSaved ? 'Ver todas as vagas' : 'Limpar filtros';
    }
    $('#saved-toggle').setAttribute('aria-pressed', String(state.savedOnly));
    $('#saved-count').textContent = state.saved.length;
  }

  function markCurrent() {
    $$('.job-row [data-open]').forEach(link => {
      const current = link.dataset.open === state.selected;
      link.closest('.job-row').classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function renderDetail() {
    const id = state.selected;
    const item = id && job(id);
    const body = $('#detail-body');
    $('#vagas').dataset.view = id ? 'detail' : 'list';

    if (!id) {
      body.innerHTML = `<div class="state-panel"><h2 class="state-title">Escolha uma vaga</h2><p>Selecione uma vaga na lista para ver as funções, os requisitos e os benefícios.</p></div>`;
      return;
    }
    if (!item) {
      body.innerHTML = `<div class="state-panel" role="alert"><h2 class="state-title">Esta vaga já não está disponível</h2><p>O endereço pode estar incompleto ou a vaga pode ter sido fechada.</p><button type="button" class="btn" data-clear>Ver todas as vagas</button></div>`;
      return;
    }
    const saved = isSaved(item.id);
    body.innerHTML = `
      <header class="detail-head">
        <span class="logo logo-lg tone-${item.tone}" aria-hidden="true">${esc(item.initials)}</span>
        <div>
          <p class="detail-company">${esc(item.company)} · ${esc(item.area)}</p>
          <h2 class="detail-title" id="detail-title" tabindex="-1">${esc(item.title)}</h2>
        </div>
      </header>
      <p class="detail-salary">${esc(O.formatSalary(item.salary))}</p>
      <dl class="facts">
        <div><dt>Local</dt><dd>${esc(item.location)}</dd></div>
        <div><dt>Modalidade</dt><dd>${esc(item.modality)}</dd></div>
        <div><dt>Contrato</dt><dd>${esc(item.contract)}</dd></div>
        <div><dt>Horário</dt><dd>${esc(item.schedule)}</dd></div>
        <div><dt>Publicada</dt><dd><time datetime="${item.publishedAt}">${esc(O.formatDate(item.publishedAt))}</time></dd></div>
      </dl>
      <div class="detail-actions">
        <button type="button" class="btn primary" data-apply>${isApplied(item.id) ? 'Candidatar-me de novo' : 'Candidatar-me'}</button>
        <button type="button" class="btn" data-save="${item.id}" aria-pressed="${saved}">${saved ? 'Guardada' : 'Guardar vaga'}</button>
      </div>
      ${isApplied(item.id) ? '<p class="applied-note">Candidatura simulada registada nesta sessão. Nada foi enviado.</p>' : ''}
      <section class="detail-section"><h3>Sobre a função</h3><p>${esc(item.summary)}</p></section>
      <section class="detail-section"><h3>Responsabilidades</h3>${bullets(item.responsibilities)}</section>
      <section class="detail-section"><h3>Requisitos</h3>${bullets(item.requirements)}</section>
      <section class="detail-section"><h3>Benefícios</h3>${bullets(item.benefits)}</section>
      <ul class="skills" aria-label="Competências">${item.skills.map(skill => `<li>${esc(skill)}</li>`).join('')}</ul>
      <p class="fine">Vaga fictícia para demonstração. A candidatura é simulada e não é enviada a nenhuma empresa.</p>`;
  }

  function select(id, {focus = false} = {}) {
    state.selected = id;
    history.pushState(null, '', id ? `?vaga=${encodeURIComponent(id)}` : location.pathname);
    markCurrent();
    renderDetail();
    if (focus) $('#detail-title')?.focus();
  }

  function toggleSaved(id) {
    const on = !isSaved(id);
    state.saved = on ? [...state.saved, id] : state.saved.filter(item => item !== id);
    persist();
    notify(on ? `«${job(id).title}» guardada.` : `«${job(id).title}» removida das guardadas.`);
    if (state.savedOnly && !on) {
      renderList();
      $('#board-title').focus();
      return;
    }
    $$(`[data-save="${id}"]`).forEach(button => {
      button.setAttribute('aria-pressed', String(on));
      if (button.classList.contains('btn')) button.textContent = on ? 'Guardada' : 'Guardar vaga';
    });
    $('#saved-count').textContent = state.saved.length;
  }

  function resetFilters() {
    Object.assign(state, {query:'', area:'', location:'', remote:'all', sort:'recent', savedOnly:false});
    $('#query').value = '';
    $('#area').value = '';
    $('#location').value = '';
    $('#sort').value = 'recent';
    $('input[name="remote"][value="all"]').checked = true;
    renderList();
  }

  function readForm() {
    const file = $('#apply-cv').files[0];
    return {
      name: $('#apply-name').value,
      email: $('#apply-email').value,
      phone: $('#apply-phone').value,
      cv: file ? {name: file.name, size: file.size} : null,
      motivation: $('#apply-motivation').value,
      consent: $('#apply-consent').checked
    };
  }

  function showErrors(errors, focusSummary) {
    for (const id of Object.values(FIELDS)) {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      const key = Object.keys(FIELDS).find(k => FIELDS[k] === id);
      error.textContent = errors[key] || '';
      error.hidden = !errors[key];
      input.setAttribute('aria-invalid', String(Boolean(errors[key])));
    }
    const keys = Object.keys(errors);
    const summary = $('#form-errors');
    summary.hidden = keys.length === 0;
    $('#form-errors-list').innerHTML = keys.map(key => `<li><a href="#${FIELDS[key]}" data-focus="${FIELDS[key]}">${esc(errors[key])}</a></li>`).join('');
    if (keys.length && focusSummary) summary.focus();
  }

  function resetForm() {
    form.reset();
    attempted = false;
    showErrors({}, false);
    form.hidden = false;
    $('#apply-success').hidden = true;
    $('#cv-name').textContent = 'Nenhum ficheiro selecionado';
    $('#motivation-count').textContent = `0 / ${O.limits.motivationMax} caracteres · mínimo de ${O.limits.motivationMin}`;
  }

  function openApply() {
    const item = job(state.selected);
    if (!item) return;
    opener = document.activeElement;
    $('#apply-title').textContent = item.title;
    $('#apply-job').textContent = `${item.company} · ${item.location}`;
    resetForm();
    dialog.showModal();
    $('#apply-name').focus();
  }

  function closeApply() {
    dialog.close();
  }

  document.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    if (open) {
      event.preventDefault();
      select(open.dataset.open, {focus: narrow.matches});
      return;
    }
    const save = event.target.closest('[data-save]');
    if (save) return toggleSaved(save.dataset.save);
    if (event.target.closest('[data-apply]')) return openApply();
    if (event.target.closest('[data-clear]')) select(null);
  });

  $('#query').addEventListener('input', event => { state.query = event.target.value; renderList(); });
  $('#area').addEventListener('change', event => { state.area = event.target.value; renderList(); });
  $('#location').addEventListener('change', event => { state.location = event.target.value; renderList(); });
  $$('input[name="remote"]').forEach(radio => radio.addEventListener('change', event => { state.remote = event.target.value; renderList(); }));
  $('#sort').addEventListener('change', event => { state.sort = event.target.value; renderList(); });
  $('#saved-toggle').addEventListener('click', () => { state.savedOnly = !state.savedOnly; renderList(); });
  $('#clear-filters').addEventListener('click', resetFilters);
  $('#list-reset').addEventListener('click', resetFilters);
  $('#back-to-list').addEventListener('click', () => {
    const previous = state.selected;
    select(null);
    $(`[data-open="${previous}"]`)?.focus();
  });
  window.addEventListener('popstate', () => {
    state.selected = new URLSearchParams(location.search).get('vaga');
    markCurrent();
    renderDetail();
  });

  $('#apply-cv').addEventListener('change', event => {
    $('#cv-name').textContent = event.target.files[0]?.name || 'Nenhum ficheiro selecionado';
  });
  $('#apply-motivation').addEventListener('input', event => {
    $('#motivation-count').textContent = `${event.target.value.trim().length} / ${O.limits.motivationMax} caracteres · mínimo de ${O.limits.motivationMin}`;
  });
  ['input', 'change'].forEach(type => form.addEventListener(type, () => {
    if (attempted) showErrors(O.validateApplication(readForm()), false);
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    const errors = O.validateApplication(readForm());
    showErrors(errors, true);
    if (Object.keys(errors).length) return;
    if (!isApplied(state.selected)) state.applied = [...state.applied, state.selected];
    form.hidden = true;
    $('#apply-success').hidden = false;
    $('#apply-success').focus();
    renderList();
    renderDetail();
  });
  $('#form-errors-list').addEventListener('click', event => {
    const link = event.target.closest('[data-focus]');
    if (!link) return;
    event.preventDefault();
    document.getElementById(link.dataset.focus).focus();
  });
  $('#cancel-apply').addEventListener('click', closeApply);
  $('#close-apply').addEventListener('click', closeApply);
  $('#success-close').addEventListener('click', closeApply);
  dialog.addEventListener('close', () => {
    resetForm();
    const target = opener?.isConnected ? opener : $('[data-apply]');
    target?.focus();
  });

  function init() {
    $('#area').insertAdjacentHTML('beforeend', unique('area').map(value => `<option>${esc(value)}</option>`).join(''));
    $('#location').insertAdjacentHTML('beforeend', unique('location').map(value => `<option>${esc(value)}</option>`).join(''));
    state.selected = new URLSearchParams(location.search).get('vaga');
    resetForm();
    renderList();
    renderDetail();
  }

  init();
})();
