(function () {
  'use strict';
  const statuses = { todo: 'Por fazer', doing: 'Em curso', review: 'Em revisão', done: 'Concluído' };
  const people = ['Mariana Silva', 'Tiago Costa', 'Inês Rocha'];
  const priorities = ['Alta', 'Média', 'Baixa'];
  const tags = ['Design', 'Conteúdo', 'Desenvolvimento'];
  const seed = [
    ['Mapear a jornada do utilizador', 'Identificar os momentos que fazem a diferença na experiência.', 'todo', 'Alta', 'Mariana Silva', 'Design', '2026-11-18'],
    ['Escrever os textos da página Sobre', 'Dar voz à história e às pessoas do Atelier.', 'todo', 'Média', 'Inês Rocha', 'Conteúdo', '2026-11-20'],
    ['Preparar biblioteca de componentes', 'Botões, campos e pequenos detalhes consistentes.', 'todo', 'Baixa', 'Tiago Costa', 'Desenvolvimento', '2026-11-23'],
    ['Desenhar a página inicial', 'Uma primeira impressão à altura das nossas ideias.', 'doing', 'Alta', 'Mariana Silva', 'Design', '2026-11-16'],
    ['Desenvolver a navegação', 'Uma estrutura simples, acessível e adaptável.', 'doing', 'Média', 'Tiago Costa', 'Desenvolvimento', '2026-11-19'],
    ['Rever a direção visual', 'Validar tipografia, cores e o novo ritmo da marca.', 'review', 'Alta', 'Inês Rocha', 'Design', '2026-11-13'],
    ['Definir objetivos do projeto', 'Alinhar expectativas e critérios de sucesso com a equipa.', 'done', 'Média', 'Mariana Silva', 'Conteúdo', '2026-11-09'],
    ['Organizar referências visuais', 'Um ponto de partida partilhado para explorar.', 'done', 'Baixa', 'Inês Rocha', 'Design', '2026-11-10']
  ].map((row, i) => ({ id: `task-${i + 1}`, title: row[0], description: row[1], status: row[2], priority: row[3], person: row[4], tag: row[5], date: row[6] }));
  function validTask(t) {
    return t && typeof t.id === 'string' && t.id.length > 0 && typeof t.title === 'string' && t.title.trim().length > 0 && t.title.length <= 120 && typeof t.description === 'string' && t.description.length <= 1000 && Object.hasOwn(statuses, t.status) && people.includes(t.person) && priorities.includes(t.priority) && tags.includes(t.tag) && typeof t.date === 'string' && (t.date === '' || (/^20\d{2}-\d{2}-\d{2}$/.test(t.date) && !Number.isNaN(Date.parse(t.date))));
  }
  function filterTasks(tasks, filters = {}) {
    const q = (filters.search || '').trim().toLocaleLowerCase('pt-PT');
    return tasks.filter(t => (!filters.person || t.person === filters.person) && (!filters.priority || t.priority === filters.priority) && (!filters.tag || t.tag === filters.tag) && (!q || `${t.title} ${t.description}`.toLocaleLowerCase('pt-PT').includes(q)));
  }
  function moveTask(tasks, id, status) {
    if (!Object.hasOwn(statuses, status)) return tasks;
    return tasks.map(t => t.id === id ? { ...t, status } : t);
  }
  if (typeof module !== 'undefined') module.exports = { seed, statuses, validTask, filterTasks, moveTask };
  if (typeof document === 'undefined') return;
  const $ = id => document.getElementById(id);
  const key = 'compasso-tasks-v1';
  let tasks = structuredClone(seed), view = 'board', editing = null, dragged = null, initialNotice = '';
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const saved = JSON.parse(raw);
      if (!Array.isArray(saved) || !saved.every(validTask) || new Set(saved.map(t => t.id)).size !== saved.length) throw new Error('invalid');
      tasks = saved;
    }
  } catch { initialNotice = 'Não foi possível recuperar os dados locais. Apresentamos as tarefas de exemplo.'; }
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const options = status => Object.entries(statuses).map(([id, title]) => `<option value="${id}"${status === id ? ' selected' : ''}>${title}</option>`).join('');
  const dateLabel = date => date ? new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)) : 'Sem data';
  function card(t) {
    const initials = t.person.split(' ').map(p => p[0]).join('');
    return `<article class="card" draggable="true" data-id="${escape(t.id)}" aria-label="${escape(t.title)}"><div class="card-top"><span class="tag ${escape(t.tag)}">${escape(t.tag)}</span><span class="priority ${t.priority}">${t.priority === 'Alta' ? '↑' : t.priority === 'Baixa' ? '↓' : '−'} ${t.priority}</span></div><button class="card-title" data-edit="${escape(t.id)}" aria-label="Editar: ${escape(t.title)}">${escape(t.title)}</button><p>${escape(t.description)}</p><div class="card-bottom">${t.date ? `<time datetime="${t.date}">${dateLabel(t.date)}</time>` : '<span>Sem data</span>'}<span class="avatar ${t.person === people[1] ? 'blue' : t.person === people[2] ? 'peach' : ''}" title="${escape(t.person)}" aria-label="${escape(t.person)}">${initials}</span></div><label class="move-label">Mover para<span class="sr-only">: ${escape(t.title)}</span><select data-move="${escape(t.id)}">${options(t.status)}</select></label></article>`;
  }
  function render() {
    const shown = filterTasks(tasks, { search: $('search').value, person: $('person-filter').value, priority: $('priority-filter').value, tag: $('tag-filter').value });
    $('task-total').textContent = `${shown.length} de ${tasks.length} tarefas`;
    const percent = tasks.length ? Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100) : 0;
    $('progress').value = percent; $('progress').textContent = `${percent}%`; $('progress-text').textContent = `${percent}%`;
    $('tasks').className = view;
    $('tasks').innerHTML = view === 'list' ? shown.map(card).join('') : Object.entries(statuses).map(([id, title]) => {
      const rows = shown.filter(t => t.status === id);
      return `<section class="column ${id}" data-status="${id}" aria-label="${title}"><h2 class="column-heading"><span class="status-dot"></span>${title}<span class="column-count">${rows.length}</span><button class="column-add" data-add="${id}" aria-label="Adicionar tarefa: ${title}">+</button></h2>${rows.map(card).join('') || '<p class="column-empty">Espaço para o próximo passo.</p>'}</section>`;
    }).join('');
    $('empty').hidden = shown.length > 0;
    $('board-view').setAttribute('aria-pressed', String(view === 'board'));
    $('list-view').setAttribute('aria-pressed', String(view === 'list'));
  }
  function persist(message) {
    try { localStorage.setItem(key, JSON.stringify(tasks)); $('notice').textContent = message; }
    catch { $('notice').textContent = `${message} O armazenamento está indisponível; as alterações duram apenas nesta visita.`; }
    render();
  }
  function openTask(id = null, status = 'todo') {
    editing = id;
    const form = $('task-form'); form.reset(); $('form-error').textContent = '';
    $('dialog-title').textContent = id ? 'Editar tarefa' : 'Nova tarefa';
    const task = tasks.find(t => t.id === id);
    if (task) for (const field of ['title', 'description', 'status', 'priority', 'person', 'tag', 'date']) form.elements[field].value = task[field];
    else form.elements.status.value = status;
    $('task-dialog').showModal(); form.elements.title.focus();
  }
  $('new-task').addEventListener('click', () => openTask());
  for (const id of ['close-dialog', 'cancel-dialog']) $(id).addEventListener('click', () => $('task-dialog').close());
  $('task-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const task = { ...values, title: values.title.trim(), description: values.description.trim(), id: editing || `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
    if (!validTask(task)) { $('form-error').textContent = 'Verifique o título e os dados da tarefa.'; return; }
    tasks = editing ? tasks.map(t => t.id === editing ? task : t) : [...tasks, task];
    $('task-dialog').close(); persist(editing ? 'Tarefa atualizada.' : 'Tarefa criada.');
    const target = Array.from(document.querySelectorAll('[data-edit]')).find(el => el.dataset.edit === task.id);
    (target || $('new-task')).focus();
  });
  for (const id of ['search', 'person-filter', 'priority-filter', 'tag-filter']) $(id).addEventListener(id === 'search' ? 'input' : 'change', render);
  function clearFilters() { for (const id of ['search', 'person-filter', 'priority-filter', 'tag-filter']) $(id).value = ''; render(); }
  $('clear-filters').addEventListener('click', clearFilters); $('empty-reset').addEventListener('click', clearFilters);
  for (const mode of ['board', 'list']) $(`${mode}-view`).addEventListener('click', () => { view = mode; render(); });
  $('tasks').addEventListener('click', event => { const edit = event.target.closest('[data-edit]'); const add = event.target.closest('[data-add]'); if (edit) openTask(edit.dataset.edit); if (add) openTask(null, add.dataset.add); });
  $('tasks').addEventListener('change', event => {
    if (!event.target.matches('[data-move]')) return;
    const id = event.target.dataset.move;
    tasks = moveTask(tasks, id, event.target.value); persist('Tarefa movida.');
    Array.from(document.querySelectorAll('[data-move]')).find(el => el.dataset.move === id)?.focus();
  });
  $('tasks').addEventListener('dragstart', event => { const card = event.target.closest('[data-id]'); if (!card || event.target.closest('select')) { event.preventDefault(); return; } dragged = card.dataset.id; event.dataTransfer.setData('text/plain', dragged); event.dataTransfer.effectAllowed = 'move'; });
  $('tasks').addEventListener('dragover', event => { const col = event.target.closest('[data-status]'); if (col && dragged) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; col.classList.add('drop-target'); } });
  $('tasks').addEventListener('dragleave', event => { const col = event.target.closest('[data-status]'); if (col && !col.contains(event.relatedTarget)) col.classList.remove('drop-target'); });
  $('tasks').addEventListener('drop', event => { event.preventDefault(); const col = event.target.closest('[data-status]'); if (col && dragged) { tasks = moveTask(tasks, dragged, col.dataset.status); persist(`Tarefa movida para ${statuses[col.dataset.status]}.`); } dragged = null; });
  $('tasks').addEventListener('dragend', () => { dragged = null; document.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target')); });
  render(); $('notice').textContent = initialNotice;
})();
