(() => {
  'use strict';

  const STORAGE_KEY = 'alvorada-painel-demo';
  const WINDOW_DAYS = 3;
  const SLOTS = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const TYPES = ['Consulta de rotina', 'Enfermagem', 'Análises', 'Acompanhamento', 'Primeira consulta'];
  const PROFESSIONALS = ['Dra. Sofia Almeida', 'Dr. Tiago Ferreira', 'Enf.ª Rita Monteiro', 'Enf. Bruno Lopes'];
  const NOTES = ['', 'Trazer exames anteriores.', 'Consulta de seguimento.', '', 'Confirmar disponibilidade para transporte.', ''];
  const STATUS_LABEL = { pendente: 'Por confirmar', confirmada: 'Confirmada', cancelada: 'Cancelada' };
  const ESTADO_CLASS = { Acompanhamento: 'chip-blue', Ativo: 'chip-green', Novo: 'chip-sand' };
  const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const PATIENTS = [
    { id: 'p01', name: 'Inês Carvalho', processo: 'PT-24018', idade: 34, estado: 'Acompanhamento', profissional: 0, nota: 'Plano de acompanhamento trimestral. Ficha fictícia.' },
    { id: 'p02', name: 'Duarte Machado', processo: 'PT-24102', idade: 58, estado: 'Acompanhamento', profissional: 1, nota: 'Revisão do plano a cada seis semanas.' },
    { id: 'p03', name: 'Beatriz Sousa Lopes', processo: 'PT-24133', idade: 27, estado: 'Ativo', profissional: 2, nota: 'Sem notas adicionais nesta ficha.' },
    { id: 'p04', name: 'Afonso Pinheiro', processo: 'PT-24077', idade: 71, estado: 'Acompanhamento', profissional: 3, nota: 'Prefere marcações ao início da manhã.' },
    { id: 'p05', name: 'Mariana Viegas', processo: 'PT-24190', idade: 45, estado: 'Ativo', profissional: 0, nota: 'Contacto por mensagem, sempre que possível.' },
    { id: 'p06', name: 'Tomás Rebelo', processo: 'PT-24215', idade: 16, estado: 'Novo', profissional: 1, nota: 'Primeira visita registada neste mês.' },
    { id: 'p07', name: 'Leonor Batista', processo: 'PT-24044', idade: 62, estado: 'Acompanhamento', profissional: 2, nota: 'Acompanhamento com enfermagem às terças-feiras.' },
    { id: 'p08', name: 'Gonçalo Ramalho', processo: 'PT-24228', idade: 39, estado: 'Ativo', profissional: 3, nota: 'Sem notas adicionais nesta ficha.' },
    { id: 'p09', name: 'Carolina Teixeira', processo: 'PT-24251', idade: 30, estado: 'Novo', profissional: 0, nota: 'Ficha criada para fins de demonstração.' },
    { id: 'p10', name: 'Rui Matos', processo: 'PT-24009', idade: 52, estado: 'Ativo', profissional: 1, nota: 'Análises de rotina com periodicidade anual.' },
    { id: 'p11', name: 'Helena Nunes', processo: 'PT-24163', idade: 83, estado: 'Acompanhamento', profissional: 2, nota: 'Familiar de contacto indicado na ficha real, não nesta demonstração.' },
    { id: 'p12', name: 'Simão Correia', processo: 'PT-24270', idade: 24, estado: 'Novo', profissional: 3, nota: 'Primeira consulta agendada para este período.' },
  ];

  const storageAvailable = canUseStorage();
  let storageMessage = '';
  let store = loadStore();
  const generatedCache = new Map();
  const view = { day: '', status: 'all', type: '', query: '', patientStatus: '', patientId: null };
  let pendingUndo = null;
  let toastTimer = 0;

  const el = (id) => document.getElementById(id);
  const dom = {
    today: el('today-label'),
    banner: el('banner'),
    bannerText: el('banner-text'),
    bannerAction: el('banner-action'),
    kpis: el('kpi-list'),
    dayTitle: el('agenda-title'),
    dayStrip: el('day-strip'),
    typeFilter: el('type-filter'),
    statusFilters: el('status-filters'),
    summary: el('agenda-summary'),
    timeline: el('timeline'),
    agendaEmpty: el('agenda-empty'),
    patientSearch: el('patient-search'),
    patientStatus: el('patient-status'),
    patientCount: el('patient-count'),
    patientList: el('patient-list'),
    patientEmpty: el('patient-empty'),
    file: el('file-content'),
    ficha: el('ficha'),
    dialog: el('booking'),
    form: el('booking-form'),
    bPatient: el('b-patient'),
    bDate: el('b-date'),
    bTime: el('b-time'),
    bType: el('b-type'),
    bNote: el('b-note'),
    formStatus: el('booking-status'),
    toast: el('toast'),
    agenda: el('agenda'),
  };
  const fieldErrors = { patient: [dom.bPatient, el('e-patient')], date: [dom.bDate, el('e-date')], time: [dom.bTime, el('e-time')] };

  function canUseStorage() {
    try {
      localStorage.setItem('__alvorada_teste__', '1');
      localStorage.removeItem('__alvorada_teste__');
      return true;
    } catch {
      return false;
    }
  }

  function emptyStore() {
    return { statuses: {}, booked: [] };
  }

  function loadStore() {
    if (!storageAvailable) {
      storageMessage = 'Este navegador não permite guardar dados. As alterações ficam só nesta página e perdem-se ao recarregar.';
      return emptyStore();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyStore();
      const data = JSON.parse(raw);
      if (!data || !data.statuses || typeof data.statuses !== 'object' || !Array.isArray(data.booked)) {
        throw new Error('Formato inválido');
      }
      return data;
    } catch {
      storageMessage = 'Não foi possível ler os dados guardados neste navegador. Pode repô-los para o exemplo inicial.';
      return emptyStore();
    }
  }

  function persist() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      storageMessage = '';
    } catch {
      storageMessage = 'Não foi possível guardar a alteração neste navegador. Ela fica disponível apenas nesta página.';
    }
    renderBanner();
  }

  function hash(text) {
    let value = 2166136261;
    for (const char of text) {
      value ^= char.charCodeAt(0);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function toKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function parseKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function todayKey() {
    return toKey(new Date());
  }

  function shiftKey(key, days) {
    const date = parseKey(key);
    date.setDate(date.getDate() + days);
    return toKey(date);
  }

  function isClosed(key) {
    const weekday = parseKey(key).getDay();
    return weekday === 0 || weekday === 6;
  }

  function nextOpenDay(key) {
    let current = key;
    while (isClosed(current)) current = shiftKey(current, 1);
    return current;
  }

  const dayFormat = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
  const longFormat = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  const dayLabel = (key) => cap(dayFormat.format(parseKey(key)));
  const shortDay = (key) => {
    const date = parseKey(key);
    return `${WEEKDAY_SHORT[date.getDay()]} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };
  const norm = (text) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function icon(name) {
    return `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  }

  function initials(name) {
    const words = name.split(' ').filter(Boolean);
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  function patientById(id) {
    return PATIENTS.find((patient) => patient.id === id);
  }

  // Marcações geradas de forma determinística por data, para que a demo seja sempre igual.
  function buildGenerated(key) {
    if (isClosed(key)) return [];
    return SLOTS.flatMap((time) => {
      const seed = `${key} ${time}`;
      if (hash(seed) % 10 >= 6) return [];
      const patient = PATIENTS[hash(`${seed}p`) % PATIENTS.length];
      return [{
        key: seed,
        dateKey: key,
        time,
        patientId: patient.id,
        type: TYPES[hash(`${seed}t`) % TYPES.length],
        professional: PROFESSIONALS[hash(`${seed}d`) % PROFESSIONALS.length],
        note: NOTES[hash(`${seed}n`) % NOTES.length],
        status: hash(`${seed}s`) % 10 < 3 ? 'pendente' : 'confirmada',
      }];
    });
  }

  function generatedFor(key) {
    if (!generatedCache.has(key)) generatedCache.set(key, buildGenerated(key));
    return generatedCache.get(key);
  }

  function appointmentsFor(key) {
    const booked = store.booked.filter((item) => item.dateKey === key);
    return [...generatedFor(key), ...booked]
      .map((item) => ({ ...item, status: store.statuses[item.key] ?? item.status }))
      .sort((left, right) => left.time.localeCompare(right.time));
  }

  function findAppointment(key) {
    return appointmentsFor(key.slice(0, 10)).find((item) => item.key === key);
  }

  function freeSlots(key) {
    const taken = new Set([
      ...generatedFor(key).map((item) => item.time),
      ...store.booked.filter((item) => item.dateKey === key).map((item) => item.time),
    ]);
    return SLOTS.filter((time) => !taken.has(time));
  }

  // Última consulta nos 30 dias anteriores e próxima nos 30 seguintes (canceladas não contam).
  function patientTimeline(patientId) {
    const today = todayKey();
    let last = null;
    let next = null;
    for (let offset = -30; offset <= 30; offset += 1) {
      const key = shiftKey(today, offset);
      for (const item of appointmentsFor(key)) {
        if (item.patientId !== patientId || item.status === 'cancelada') continue;
        if (key < today) last = item;
        else if (!next) next = item;
      }
    }
    return { last, next };
  }

  function renderKpis() {
    const items = appointmentsFor(todayKey());
    const cancelled = items.filter((item) => item.status === 'cancelada').length;
    const pending = items.filter((item) => item.status === 'pendente').length;
    const confirmed = items.filter((item) => item.status === 'confirmada').length;
    const active = items.length - cancelled;
    const followUp = PATIENTS.filter((patient) => patient.estado === 'Acompanhamento').length;
    let todayNote = `${cancelled} cancelada${cancelled === 1 ? '' : 's'}`;
    if (isClosed(todayKey())) todayNote = 'Fim de semana, sem consultas';
    const cards = [
      { tone: 'blue', icon: 'calendar', label: 'Consultas hoje', value: items.length, note: todayNote },
      { tone: 'amber', icon: 'clock', label: 'Por confirmar', value: pending, note: 'Aguardam resposta do utente' },
      { tone: 'green', icon: 'check', label: 'Taxa de confirmação', value: active ? `${Math.round((confirmed / active) * 100)} %` : '—', note: 'Sobre marcações ativas' },
      { tone: 'blue', icon: 'users', label: 'Em acompanhamento', value: followUp, note: 'Utentes com plano ativo' },
    ];
    dom.kpis.innerHTML = cards.map((card) => `
      <li class="kpi kpi-${card.tone}">
        <span class="kpi-icon">${icon(card.icon)}</span>
        <div>
          <p class="kpi-label">${card.label}</p>
          <p class="kpi-value">${card.value}</p>
          <p class="kpi-note">${card.note}</p>
        </div>
      </li>`).join('');
  }

  function renderAgenda() {
    const { day } = view;
    const today = todayKey();
    dom.dayTitle.textContent = dayLabel(day);

    const strip = [];
    for (let offset = -WINDOW_DAYS; offset <= WINDOW_DAYS; offset += 1) {
      const key = shiftKey(day, offset);
      const date = parseKey(key);
      const closed = isClosed(key);
      const classes = ['day-chip'];
      if (closed) classes.push('is-closed');
      if (key === today) classes.push('is-today');
      strip.push(`<button type="button" class="${classes.join(' ')}" data-action="day" data-value="${key}" aria-pressed="${key === day}" aria-label="${esc(dayLabel(key))}${closed ? ', encerrado' : ''}${key === today ? ', hoje' : ''}">
        <span class="day-name" aria-hidden="true">${WEEKDAY_SHORT[date.getDay()]}</span>
        <strong aria-hidden="true">${date.getDate()}</strong>
      </button>`);
    }
    dom.dayStrip.innerHTML = strip.join('');

    if (dom.typeFilter.options.length === 1) {
      dom.typeFilter.insertAdjacentHTML('beforeend', TYPES.map((type) => `<option value="${esc(type)}">${esc(type)}</option>`).join(''));
    }
    dom.typeFilter.value = view.type;
    dom.statusFilters.querySelectorAll('[data-value]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === view.status));
    });

    const all = appointmentsFor(day);
    const closed = isClosed(day);
    const list = all.filter((item) => (view.status === 'all' || item.status === view.status) && (!view.type || item.type === view.type));
    const pending = all.filter((item) => item.status === 'pendente').length;

    if (closed) {
      dom.summary.textContent = 'Consultório encerrado ao fim de semana.';
    } else {
      dom.summary.textContent = `${list.length} de ${all.length} marcações exibidas · ${pending} por confirmar`;
    }

    dom.timeline.innerHTML = list.map(renderAppointment).join('');
    dom.timeline.hidden = list.length === 0;
    dom.agendaEmpty.hidden = list.length > 0;
    if (closed) {
      dom.agendaEmpty.innerHTML = `
        <h3>Consultório encerrado</h3>
        <p>Não há consultas ao fim de semana. Escolha um dia útil para ver a agenda.</p>
        <button type="button" class="btn small" data-action="next-open-day">Ir para o próximo dia útil</button>`;
    } else if (all.length) {
      dom.agendaEmpty.innerHTML = `
        <h3>Nenhuma marcação com este filtro</h3>
        <p>Altere o estado ou o tipo de consulta para ver outras marcações.</p>
        <button type="button" class="btn small" data-action="clear-agenda">Limpar filtros</button>`;
    } else {
      dom.agendaEmpty.innerHTML = `
        <h3>Sem marcações neste dia</h3>
        <p>Pode criar uma marcação demonstrativa para este dia.</p>
        <button type="button" class="btn small primary" data-action="new-booking">Nova marcação</button>`;
    }
  }

  function actionButton(action, item, label, extraClass, patient) {
    return `<button type="button" class="btn small ${extraClass}" data-action="${action}" data-value="${item.key}" aria-label="${label} consulta de ${esc(patient.name)} às ${item.time}">${label}</button>`;
  }

  function renderAppointment(item) {
    const patient = patientById(item.patientId);
    const actions = [];
    if (item.status === 'pendente') actions.push(actionButton('confirm', item, 'Confirmar', 'primary', patient));
    if (item.status === 'cancelada') {
      actions.push(actionButton('reopen', item, 'Reabrir', '', patient));
    } else {
      actions.push(actionButton('cancel', item, 'Cancelar', 'ghost', patient));
    }
    return `
      <li class="slot">
        <time class="slot-time" datetime="${item.dateKey}T${item.time}">${item.time}</time>
        <article class="appt is-${item.status}">
          <div class="appt-main">
            <span class="avatar" aria-hidden="true">${initials(patient.name)}</span>
            <div class="appt-info">
              <h3><button type="button" class="name-link" data-action="open-file" data-value="${patient.id}">${esc(patient.name)}</button></h3>
              <p class="appt-meta">${esc(item.type)} · ${esc(item.professional)}</p>
              ${item.note ? `<p class="appt-note">${esc(item.note)}</p>` : ''}
            </div>
          </div>
          <div class="appt-side">
            <span class="badge badge-${item.status}">${STATUS_LABEL[item.status]}</span>
            <div class="appt-actions">${actions.join('')}</div>
          </div>
        </article>
      </li>`;
  }

  function renderPatients() {
    const query = norm(view.query.trim());
    const list = PATIENTS.filter((patient) => {
      if (view.patientStatus && patient.estado !== view.patientStatus) return false;
      if (!query) return true;
      return norm(patient.name).includes(query) || norm(patient.processo).includes(query);
    });
    dom.patientCount.textContent = `${list.length} de ${PATIENTS.length}`;
    const timelines = new Map(list.map((patient) => [patient.id, patientTimeline(patient.id)]));
    dom.patientList.innerHTML = list.map((patient) => {
      const { next } = timelines.get(patient.id);
      const nextText = next ? `Próxima: ${shortDay(next.dateKey)} às ${next.time}` : 'Sem consulta marcada';
      return `
        <li>
          <button type="button" class="patient-item" data-action="select-patient" data-value="${patient.id}" aria-pressed="${patient.id === view.patientId}">
            <span class="avatar" aria-hidden="true">${initials(patient.name)}</span>
            <span class="patient-text"><strong>${esc(patient.name)}</strong><span>${esc(patient.processo)} · ${patient.idade} anos</span></span>
            <span class="chip ${ESTADO_CLASS[patient.estado]}">${esc(patient.estado)}</span>
            <span class="patient-next">${nextText}</span>
          </button>
        </li>`;
    }).join('');
    dom.patientEmpty.hidden = list.length > 0;
  }

  function renderFile() {
    const patient = patientById(view.patientId);
    if (!patient) {
      dom.file.innerHTML = '<div class="empty-state"><h3>Nenhum utente selecionado</h3><p>Escolha um utente na lista para ver a ficha demonstrativa.</p></div>';
      return;
    }
    const { last, next } = patientTimeline(patient.id);
    dom.file.innerHTML = `
      <div class="file-head">
        <span class="avatar avatar-lg" aria-hidden="true">${initials(patient.name)}</span>
        <div>
          <h3>${esc(patient.name)}</h3>
          <p class="muted">${esc(patient.processo)} · ${patient.idade} anos</p>
        </div>
      </div>
      <dl class="file-grid">
        <div><dt>Estado</dt><dd><span class="chip ${ESTADO_CLASS[patient.estado]}">${esc(patient.estado)}</span></dd></div>
        <div><dt>Profissional de referência</dt><dd>${esc(PROFESSIONALS[patient.profissional])}</dd></div>
        <div><dt>Próxima consulta</dt><dd>${next ? `${shortDay(next.dateKey)}, ${next.time}` : 'Sem consulta marcada'}</dd></div>
        <div><dt>Última consulta</dt><dd>${last ? `${shortDay(last.dateKey)}, ${last.time}` : 'Sem registo nos últimos 30 dias'}</dd></div>
      </dl>
      <section class="file-notes" aria-labelledby="notes-title">
        <h4 id="notes-title">Notas demonstrativas</h4>
        <p>${esc(patient.nota)}</p>
      </section>
      <p class="file-disclaimer">${icon('shield')}<span>Ficha fictícia. Não contém dados pessoais reais nem constitui aconselhamento médico.</span></p>
      <div class="file-actions">
        <button type="button" class="btn primary" data-action="new-booking" data-value="${patient.id}">${icon('plus')}<span>Marcar consulta</span></button>
      </div>`;
  }

  function renderBanner() {
    dom.banner.hidden = !storageMessage;
    dom.banner.dataset.tone = storageAvailable && storageMessage ? 'error' : 'info';
    dom.bannerText.textContent = storageMessage;
    dom.bannerAction.hidden = !storageAvailable;
  }

  function renderAll() {
    renderKpis();
    renderAgenda();
    renderPatients();
    renderFile();
  }

  function restoreFocus(action, value) {
    const target = document.querySelector(`[data-action="${action}"][data-value="${CSS.escape(value)}"]`);
    if (target) target.focus();
  }

  // Se a marcação saiu da lista filtrada, o foco passa para a secção da agenda.
  function focusAppointment(key) {
    const target = dom.timeline.querySelector(`[data-value="${CSS.escape(key)}"]`);
    (target || dom.agenda).focus();
  }

  function showToast(message, undo) {
    clearTimeout(toastTimer);
    pendingUndo = undo || null;
    dom.toast.innerHTML = `<p>${esc(message)}</p>${undo ? '<button type="button" class="btn small" data-action="undo">' + icon('undo') + '<span>Desfazer</span></button>' : ''}`;
    dom.toast.classList.add('is-visible');
    toastTimer = setTimeout(() => {
      dom.toast.classList.remove('is-visible');
      pendingUndo = null;
    }, undo ? 8000 : 4500);
  }

  function setStatus(key, status) {
    store.statuses[key] = status;
    persist();
    renderAll();
  }

  function openFile(patientId, focusPanel) {
    view.patientId = patientId;
    renderAll();
    if (focusPanel) {
      dom.ficha.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
      dom.ficha.focus({ preventScroll: true });
    }
  }

  function openBooking(patientId) {
    const today = todayKey();
    const start = view.day >= today ? view.day : today;
    dom.bPatient.innerHTML = '<option value="">Escolha um utente</option>' + PATIENTS.map((patient) => `<option value="${patient.id}">${esc(patient.name)} · ${esc(patient.processo)}</option>`).join('');
    dom.bType.innerHTML = TYPES.map((type) => `<option value="${esc(type)}">${esc(type)}</option>`).join('');
    dom.bPatient.value = patientId || '';
    dom.bDate.min = today;
    dom.bDate.value = nextOpenDay(start);
    dom.bNote.value = '';
    showFormErrors({});
    fillTimes();
    dom.dialog.showModal();
  }

  function fillTimes() {
    const key = dom.bDate.value;
    const previous = dom.bTime.value;
    const free = key && !isClosed(key) ? freeSlots(key) : [];
    dom.bTime.innerHTML = free.length
      ? free.map((time) => `<option value="${time}">${time}</option>`).join('')
      : '<option value="">Sem horários livres</option>';
    if (free.includes(previous)) dom.bTime.value = previous;
  }

  function validateBooking() {
    const errors = {};
    const key = dom.bDate.value;
    if (!dom.bPatient.value) errors.patient = 'Escolha o utente da marcação.';
    if (!key) {
      errors.date = 'Indique a data da consulta.';
    } else if (key < todayKey()) {
      errors.date = 'Escolha hoje ou uma data futura.';
    } else if (isClosed(key)) {
      errors.date = 'O consultório não tem marcações ao fim de semana.';
    }
    if (!errors.date && !dom.bTime.value) {
      errors.time = 'Não há horários livres neste dia. Escolha outra data.';
    }
    return errors;
  }

  function showFormErrors(errors) {
    let firstInvalid = null;
    Object.entries(fieldErrors).forEach(([field, [input, message]]) => {
      const text = errors[field] || '';
      message.textContent = text;
      input.setAttribute('aria-invalid', String(Boolean(text)));
      input.classList.toggle('is-invalid', Boolean(text));
      if (text && !firstInvalid) firstInvalid = input;
    });
    dom.formStatus.textContent = firstInvalid ? 'Corrija os campos assinalados para continuar.' : '';
    return firstInvalid;
  }

  function resetDemo() {
    if (!window.confirm('Repor os dados demonstrativos? As marcações criadas neste navegador serão removidas.')) return;
    store = emptyStore();
    storageMessage = '';
    if (storageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        storageMessage = 'Não foi possível limpar os dados guardados neste navegador.';
      }
    }
    Object.assign(view, { day: todayKey(), status: 'all', type: '', query: '', patientStatus: '', patientId: null });
    dom.typeFilter.value = '';
    dom.patientSearch.value = '';
    dom.patientStatus.value = '';
    renderBanner();
    renderAll();
    showToast('Dados demonstrativos repostos.');
  }

  document.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const { action, value } = control.dataset;
    switch (action) {
      case 'day':
        view.day = value;
        renderAll();
        restoreFocus('day', value);
        break;
      case 'shift-day':
        view.day = shiftKey(view.day, Number(value));
        renderAll();
        break;
      case 'today':
        view.day = todayKey();
        renderAll();
        break;
      case 'next-open-day':
        view.day = nextOpenDay(view.day);
        renderAll();
        break;
      case 'status':
        view.status = value;
        renderAll();
        break;
      case 'clear-agenda':
        Object.assign(view, { status: 'all', type: '' });
        renderAll();
        break;
      case 'confirm': {
        const item = findAppointment(value);
        setStatus(value, 'confirmada');
        showToast(`Consulta confirmada: ${patientById(item.patientId).name}, ${item.time}.`);
        focusAppointment(value);
        break;
      }
      case 'cancel': {
        const item = findAppointment(value);
        const previous = item.status;
        setStatus(value, 'cancelada');
        showToast(`Consulta cancelada: ${patientById(item.patientId).name}, ${item.time}.`, () => {
          setStatus(value, previous);
          focusAppointment(value);
        });
        focusAppointment(value);
        break;
      }
      case 'reopen': {
        setStatus(value, 'pendente');
        focusAppointment(value);
        break;
      }
      case 'undo':
        if (pendingUndo) pendingUndo();
        pendingUndo = null;
        dom.toast.classList.remove('is-visible');
        break;
      case 'open-file':
        openFile(value, true);
        break;
      case 'select-patient':
        openFile(value, false);
        restoreFocus('select-patient', value);
        break;
      case 'clear-patients':
        Object.assign(view, { query: '', patientStatus: '' });
        dom.patientSearch.value = '';
        dom.patientStatus.value = '';
        renderAll();
        dom.patientSearch.focus();
        break;
      case 'new-booking':
        openBooking(value || view.patientId);
        break;
      case 'close-booking':
        dom.dialog.close();
        break;
      case 'reset':
        resetDemo();
        break;
      default:
        break;
    }
  });

  dom.typeFilter.addEventListener('change', () => {
    view.type = dom.typeFilter.value;
    renderAgenda();
  });

  dom.patientSearch.addEventListener('input', () => {
    view.query = dom.patientSearch.value;
    renderPatients();
  });

  dom.patientStatus.addEventListener('change', () => {
    view.patientStatus = dom.patientStatus.value;
    renderPatients();
  });

  dom.bDate.addEventListener('change', () => {
    fillTimes();
    showFormErrors({});
  });

  dom.bPatient.addEventListener('change', () => showFormErrors({}));

  dom.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const errors = validateBooking();
    const firstInvalid = showFormErrors(errors);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const key = dom.bDate.value;
    const time = dom.bTime.value;
    const patient = patientById(dom.bPatient.value);
    store.booked.push({
      key: `${key} ${time}`,
      dateKey: key,
      time,
      patientId: patient.id,
      type: dom.bType.value,
      professional: PROFESSIONALS[hash(`${key} ${time}d`) % PROFESSIONALS.length],
      note: dom.bNote.value.trim(),
      status: 'pendente',
    });
    persist();
    Object.assign(view, { day: key, status: 'all', type: '', patientId: patient.id });
    dom.typeFilter.value = '';
    dom.dialog.close();
    renderAll();
    showToast(`Marcação criada para ${patient.name}, ${dayLabel(key).toLowerCase()} às ${time}. Estado: por confirmar.`);
  });

  dom.dialog.addEventListener('close', () => {
    dom.formStatus.textContent = '';
  });

  dom.today.textContent = cap(longFormat.format(new Date()));
  view.day = todayKey();
  renderBanner();
  renderAll();
})();
