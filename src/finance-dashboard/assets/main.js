'use strict';
const MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
const DEFAULT_MONTH = '2026-11';
const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SHORT_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const categories = [
  {id:'salario',name:'Salário',type:'receita'},
  {id:'freelance',name:'Freelance',type:'receita'},
  {id:'outras-receitas',name:'Outras receitas',type:'receita'},
  {id:'habitacao',name:'Habitação',type:'despesa',budget:85000},
  {id:'alimentacao',name:'Alimentação',type:'despesa',budget:42000},
  {id:'contas',name:'Contas da casa',type:'despesa',budget:14000},
  {id:'transportes',name:'Transportes',type:'despesa',budget:16000},
  {id:'saude',name:'Saúde',type:'despesa',budget:9000},
  {id:'lazer',name:'Lazer',type:'despesa',budget:15000},
  {id:'compras',name:'Compras',type:'despesa',budget:20000},
  {id:'subscricoes',name:'Subscrições',type:'despesa',budget:6000}
];
// Movimentos recorrentes de cada mês: [dia, descrição, categoria, cêntimos].
const recurring = [
  [1,'Salário','salario',215000],
  [1,'Renda do apartamento','habitacao',82000],
  [2,'Passe mensal','transportes',3800],
  [3,'Subscrição de streaming','subscricoes',1299],
  [7,'Internet e telemóvel','contas',4900],
  [9,'Eletricidade e água','contas',6200]
];
// Movimentos variáveis de cada mês, nos mesmos formatos.
const variable = {
  '2026-06': [
    [4,'Supermercado','alimentacao',14870],[9,'Restaurante','lazer',4650],[13,'Consultoria de design','freelance',38000],
    [16,'Farmácia','saude',2475],[19,'Supermercado','alimentacao',11240],[24,'Roupa de verão','compras',9850],
    [27,'Combustível','transportes',7420],[29,'Supermercado','alimentacao',8730]
  ],
  '2026-07': [
    [5,'Supermercado','alimentacao',13990],[11,'Cinema e jantar','lazer',6350],[14,'Reembolso do seguro','outras-receitas',12000],
    [18,'Consulta de dentista','saude',8500],[22,'Supermercado','alimentacao',12610],[26,'Manutenção do carro','transportes',21500],
    [28,'Consultoria de design','freelance',25000],[30,'Presente de aniversário','compras',3500]
  ],
  '2026-08': [
    [3,'Férias: alojamento','lazer',38000],[8,'Supermercado','alimentacao',10980],[17,'Combustível','transportes',8150],
    [21,'Supermercado','alimentacao',12340],[25,'Consultoria de design','freelance',30000],[29,'Material escolar','compras',6480]
  ],
  '2026-09': [
    [6,'Supermercado','alimentacao',13760],[10,'Restaurante','lazer',5420],[12,'Farmácia','saude',3190],
    [15,'Consultoria de design','freelance',42000],[20,'Supermercado','alimentacao',11890],[23,'Revisão do carro','transportes',14200],
    [28,'Roupa de outono','compras',12990]
  ],
  '2026-10': [
    [4,'Supermercado','alimentacao',15330],[7,'Jantar de aniversário','lazer',9800],[13,'Supermercado','alimentacao',10460],
    [16,'Reembolso de despesas','outras-receitas',4500],[19,'Ginásio','saude',3500],[22,'Combustível','transportes',7960],
    [26,'Consultoria de design','freelance',27000],[30,'Supermercado','alimentacao',9870]
  ],
  '2026-11': [
    [2,'Supermercado','alimentacao',12780],[5,'Farmácia','saude',2990],[6,'Jantar com amigos','lazer',6400],
    [9,'Combustível','transportes',8230],[10,'Livros','compras',4590],[11,'Consultoria de design','freelance',19500],
    [11,'Supermercado','alimentacao',7410]
  ]
};
const initialMovements = MONTHS.flatMap(month => [...recurring, ...variable[month]].map(([day, description, categoryId, amount], index) => ({
  id: `${month}-${String(index + 1).padStart(2, '0')}`,
  date: `${month}-${String(day).padStart(2, '0')}`,
  description,
  categoryId,
  amount
})));

const categoryById = id => categories.find(category => category.id === id);
const expenseCategories = categories.filter(category => category.type === 'despesa');
const isIncome = movement => categoryById(movement.categoryId).type === 'receita';
const monthOf = movement => movement.date.slice(0, 7);
const sum = values => values.reduce((total, value) => total + value, 0);
const money = (cents, options = {}) => new Intl.NumberFormat('pt-PT', {style: 'currency', currency: 'EUR', ...options}).format(cents / 100);
const percent = (value, options = {}) => new Intl.NumberFormat('pt-PT', {style: 'percent', maximumFractionDigits: 1, ...options}).format(value);
const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
const monthLabel = key => {
  const [year, month] = key.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} de ${year}`;
};
const shortDate = iso => {
  const [, month, day] = iso.split('-');
  return `${Number(day)} ${SHORT_NAMES[Number(month) - 1]}`;
};
const daysInMonth = key => {
  const [year, month] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

function totalsFor(movements, month) {
  const rows = movements.filter(movement => monthOf(movement) === month);
  const income = sum(rows.filter(isIncome).map(movement => movement.amount));
  const expenses = sum(rows.filter(movement => !isIncome(movement)).map(movement => movement.amount));
  return {month, income, expenses, balance: income - expenses, savingsRate: income ? (income - expenses) / income : null};
}

function monthlySeries(movements, months = MONTHS) {
  return months.map(month => totalsFor(movements, month));
}

// Variação face ao mês anterior da série; null quando não há mês anterior ou base zero.
function comparison(movements, month) {
  const index = MONTHS.indexOf(month);
  const current = totalsFor(movements, month);
  const previous = index > 0 ? totalsFor(movements, MONTHS[index - 1]) : null;
  const change = key => (previous && previous[key] ? (current[key] - previous[key]) / previous[key] : null);
  return {income: change('income'), expenses: change('expenses')};
}

function budgetStatus(movements, month) {
  const rows = movements.filter(movement => monthOf(movement) === month);
  return expenseCategories.filter(category => category.budget).map(category => {
    const spent = sum(rows.filter(movement => movement.categoryId === category.id).map(movement => movement.amount));
    return {id: category.id, name: category.name, budget: category.budget, spent, remaining: category.budget - spent, ratio: spent / category.budget};
  });
}

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const SORTS = {
  recent: (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  oldest: (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  amount: (a, b) => b.amount - a.amount || b.date.localeCompare(a.date)
};

function filterMovements(movements, {month, query = '', type = 'all', categoryId = 'all', sort = 'recent'} = {}) {
  const term = normalize(query);
  return movements
    .filter(movement => monthOf(movement) === month
      && (type === 'all' || categoryById(movement.categoryId).type === type)
      && (categoryId === 'all' || movement.categoryId === categoryId)
      && (!term || normalize(`${movement.description} ${categoryById(movement.categoryId).name}`).includes(term)))
    .sort(SORTS[sort] || SORTS.recent);
}

// Células com fórmulas são neutralizadas para não serem executadas no Excel ou Folhas de cálculo.
function csvCell(value) {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[";\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows) {
  const header = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (€)'];
  const lines = rows.map(movement => [
    movement.date,
    movement.description,
    categoryById(movement.categoryId).name,
    isIncome(movement) ? 'Receita' : 'Despesa',
    (movement.amount / 100).toFixed(2).replace('.', ',')
  ]);
  return `\uFEFF${[header, ...lines].map(line => line.map(csvCell).join(';')).join('\r\n')}\r\n`;
}

// Aceita "12,5", "12.50" ou "1 200"; devolve cêntimos ou null.
function parseAmount(text) {
  const normalized = String(text).trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return cents > 0 && cents <= 1000000 ? cents : null;
}

function validateMovement(form, month) {
  const errors = {};
  const description = form.description.trim();
  const category = categoryById(form.categoryId);
  const amount = parseAmount(form.amount);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(form.date || '') && form.date.startsWith(`${month}-`)
    && Number(form.date.slice(8)) >= 1 && Number(form.date.slice(8)) <= daysInMonth(month);
  if (description.length < 2 || description.length > 60) errors.description = 'Indique uma descrição com 2 a 60 caracteres.';
  if (!amount) errors.amount = 'Indique um valor positivo, por exemplo 12,50.';
  if (!category || category.type !== form.type) errors.categoryId = 'Escolha uma categoria do mesmo tipo.';
  if (!validDate) errors.date = `Escolha uma data de ${monthLabel(month)}.`;
  return Object.keys(errors).length
    ? {errors}
    : {movement: {description, amount, categoryId: form.categoryId, date: form.date}};
}

if (typeof module !== 'undefined') {
  module.exports = {
    MONTHS, DEFAULT_MONTH, categories, initialMovements, categoryById, money, percent, monthLabel,
    totalsFor, monthlySeries, comparison, budgetStatus, filterMovements, toCsv, parseAmount, validateMovement
  };
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]);
  const state = {month: DEFAULT_MONTH, movements: initialMovements.map(movement => ({...movement})), query: '', type: 'all', categoryId: 'all', sort: 'recent'};
  let nextId = 1;

  const monthsNav = $('months');
  monthsNav.innerHTML = MONTHS.map(key => {
    const [year, month] = key.split('-');
    return `<button type="button" data-month="${key}" aria-pressed="false">${capitalize(MONTH_NAMES[Number(month) - 1])} <span>${year}</span></button>`;
  }).join('');
  $('category').innerHTML = '<option value="all">Todas as categorias</option>' + categories.map(category => `<option value="${category.id}">${esc(category.name)}</option>`).join('');

  function renderMonths() {
    monthsNav.querySelectorAll('[data-month]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.month === state.month)));
  }

  function renderSummary() {
    const totals = totalsFor(state.movements, state.month);
    const change = comparison(state.movements, state.month);
    const previousNote = change.expenses === null ? 'Primeiro mês da série' : `${percent(change.expenses, {signDisplay: 'exceptZero'})} face ao mês anterior`;
    const incomeNote = change.income === null ? 'Primeiro mês da série' : `${percent(change.income, {signDisplay: 'exceptZero'})} face ao mês anterior`;
    $('month-title').textContent = capitalize(monthLabel(state.month));
    $('balance').textContent = money(totals.balance);
    $('balance').classList.toggle('is-negative', totals.balance < 0);
    $('balance-note').textContent = totals.balance >= 0
      ? `Sobram ${money(totals.balance)} de ${money(totals.income)} recebidos.`
      : `As despesas superam as receitas em ${money(-totals.balance)}.`;
    const share = totals.income ? Math.min(totals.expenses / totals.income, 1) : 1;
    $('split-expense').style.width = `${(share * 100).toFixed(1)}%`;
    $('split-legend').textContent = totals.income
      ? `Despesas equivalem a ${percent(totals.expenses / totals.income)} das receitas do mês.`
      : 'Sem receitas registadas neste mês.';
    $('kpi-income').textContent = money(totals.income);
    $('kpi-income-note').textContent = incomeNote;
    $('kpi-expenses').textContent = money(totals.expenses);
    $('kpi-expenses-note').textContent = previousNote;
    $('kpi-rate').textContent = totals.savingsRate === null ? '—' : percent(totals.savingsRate, {maximumFractionDigits: 0});
    $('kpi-rate-note').textContent = totals.savingsRate === null ? 'Sem receitas neste mês' : 'Saldo sobre as receitas';
  }

  function renderChart() {
    const series = monthlySeries(state.movements);
    const max = Math.max(1, ...series.flatMap(item => [item.income, item.expenses]));
    const width = 640, height = 300, top = 20, bottom = 70, side = 12;
    const plot = height - top - bottom;
    const step = (width - side * 2) / series.length;
    const barWidth = Math.min(28, step * 0.3);
    const current = series.find(item => item.month === state.month);
    const columns = series.map((item, index) => {
      const centre = side + step * index + step / 2;
      const incomeHeight = item.income / max * plot;
      const expenseHeight = item.expenses / max * plot;
      const [, month] = item.month.split('-');
      const selected = item.month === state.month;
      return `<g class="column${selected ? ' is-current' : ''}">
<rect class="column-bg" x="${(centre - step / 2 + 4).toFixed(1)}" y="${top - 8}" width="${(step - 8).toFixed(1)}" height="${plot + 16}" rx="14"/>
<rect class="bar income" x="${(centre - barWidth - 2).toFixed(1)}" y="${(top + plot - incomeHeight).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${incomeHeight.toFixed(1)}" rx="6"><title>Receitas de ${capitalize(MONTH_NAMES[Number(month) - 1])}: ${money(item.income)}</title></rect>
<rect class="bar expense" x="${(centre + 2).toFixed(1)}" y="${(top + plot - expenseHeight).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${expenseHeight.toFixed(1)}" rx="6"><title>Despesas de ${capitalize(MONTH_NAMES[Number(month) - 1])}: ${money(item.expenses)}</title></rect>
<text class="axis-label" x="${centre.toFixed(1)}" y="${height - bottom + 24}" text-anchor="middle">${capitalize(SHORT_NAMES[Number(month) - 1])}</text>
<text class="net-label" x="${centre.toFixed(1)}" y="${height - bottom + 46}" text-anchor="middle">${money(item.balance, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</text>
</g>`;
    }).join('');
    $('chart-wrap').innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc">
<title id="chart-title">Receitas e despesas dos últimos seis meses</title>
<desc id="chart-desc">Mês selecionado: ${esc(monthLabel(state.month))}, com receitas de ${esc(money(current.income))} e despesas de ${esc(money(current.expenses))}. Os valores de todos os meses estão na tabela abaixo.</desc>
<line class="baseline" x1="${side}" x2="${width - side}" y1="${top + plot}" y2="${top + plot}"/>
${columns}</svg>`;
    $('series-body').innerHTML = series.map(item => {
      const [, month] = item.month.split('-');
      return `<tr${item.month === state.month ? ' class="is-current"' : ''}><th scope="row">${capitalize(MONTH_NAMES[Number(month) - 1])}</th><td>${money(item.income)}</td><td>${money(item.expenses)}</td><td>${money(item.balance)}</td></tr>`;
    }).join('');
  }

  function renderBudgets() {
    const items = budgetStatus(state.movements, state.month);
    const spentTotal = sum(items.map(item => item.spent));
    const budgetTotal = sum(items.map(item => item.budget));
    $('budget-summary').textContent = `${money(spentTotal)} gastos de ${money(budgetTotal)} previstos`;
    $('budgets').innerHTML = items.map(item => {
      const over = item.remaining < 0;
      const note = over ? `Acima do orçamento em ${money(-item.remaining)}` : `Restam ${money(item.remaining)}`;
      return `<li class="budget${over ? ' is-over' : ''}">
<div class="budget-head"><span>${esc(item.name)}</span><span class="num">${money(item.spent)} <small>de ${money(item.budget)}</small></span></div>
<div class="track" aria-hidden="true"><span style="width:${(Math.min(item.ratio, 1) * 100).toFixed(1)}%"></span></div>
<p class="budget-note">${note}</p></li>`;
    }).join('');
  }

  function renderList() {
    const rows = filterMovements(state.movements, state);
    const monthCount = state.movements.filter(movement => monthOf(movement) === state.month).length;
    $('tx-count').textContent = `${rows.length} ${rows.length === 1 ? 'movimento' : 'movimentos'}`;
    $('tx-list').innerHTML = rows.map(movement => {
      const category = categoryById(movement.categoryId);
      const income = isIncome(movement);
      return `<li class="tx-row">
<time class="tx-time" datetime="${movement.date}">${shortDate(movement.date)}</time>
<span class="tx-desc">${esc(movement.description)}</span>
<span class="tx-cat">${esc(category.name)}</span>
<span class="tx-amount${income ? ' is-income' : ''}"><span class="sr-only">${income ? 'Receita' : 'Despesa'}: </span>${income ? '+' : '−'}${money(movement.amount)}</span></li>`;
    }).join('');
    const empty = rows.length === 0;
    $('tx-list').hidden = empty;
    $('tx-empty').hidden = !empty;
    if (empty) {
      const noMovements = monthCount === 0;
      $('empty-title').textContent = noMovements ? `Ainda não há movimentos em ${monthLabel(state.month)}.` : 'Nenhum movimento corresponde aos filtros.';
      $('empty-text').textContent = noMovements ? 'Adicione um movimento de demonstração para ver o resumo e o orçamento deste mês.' : 'Experimente outra pesquisa ou limpe os filtros.';
      $('empty-action').textContent = noMovements ? 'Adicionar movimento' : 'Limpar filtros';
      $('empty-action').dataset.action = noMovements ? 'add' : 'clear';
    }
  }

  function renderAll() {
    renderMonths();
    renderSummary();
    renderChart();
    renderBudgets();
    renderList();
  }

  function feedback(message) {
    $('feedback').textContent = message;
  }

  function syncControls() {
    $('search').value = state.query;
    $('category').value = state.categoryId;
    $('sort').value = state.sort;
    document.querySelectorAll('[data-type]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.type === state.type)));
  }

  function resetFilters() {
    Object.assign(state, {query: '', type: 'all', categoryId: 'all', sort: 'recent'});
    syncControls();
    renderList();
  }

  monthsNav.addEventListener('click', event => {
    const button = event.target.closest('[data-month]');
    if (!button) return;
    state.month = button.dataset.month;
    renderAll();
  });

  document.querySelector('.segmented').addEventListener('click', event => {
    const button = event.target.closest('[data-type]');
    if (!button) return;
    state.type = button.dataset.type;
    syncControls();
    renderList();
  });
  $('search').addEventListener('input', event => {
    state.query = event.target.value;
    renderList();
  });
  $('category').addEventListener('change', event => {
    state.categoryId = event.target.value;
    renderList();
  });
  $('sort').addEventListener('change', event => {
    state.sort = event.target.value;
    renderList();
  });
  $('empty-action').addEventListener('click', event => {
    if (event.currentTarget.dataset.action === 'add') openDialog();
    else resetFilters();
  });

  $('export').addEventListener('click', () => {
    const rows = filterMovements(state.movements, state);
    if (!rows.length) {
      feedback('Não há movimentos com estes filtros para exportar.');
      return;
    }
    const url = URL.createObjectURL(new Blob([toCsv(rows)], {type: 'text/csv;charset=utf-8'}));
    const link = Object.assign(document.createElement('a'), {href: url, download: `movimentos-${state.month}.csv`});
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback(`CSV preparado com ${rows.length} ${rows.length === 1 ? 'movimento' : 'movimentos'}.`);
  });

  $('reset-demo').addEventListener('click', () => {
    state.movements = initialMovements.map(movement => ({...movement}));
    state.month = DEFAULT_MONTH;
    resetFilters();
    renderAll();
    feedback('Dados de demonstração repostos.');
  });

  const dialog = $('movement-dialog');
  const form = $('movement-form');
  const fields = ['description', 'amount', 'categoryId', 'date'];

  function fillCategories(type, selected) {
    const options = categories.filter(category => category.type === type);
    form.elements.categoryId.innerHTML = options.map(category => `<option value="${category.id}">${esc(category.name)}</option>`).join('');
    if (selected && options.some(category => category.id === selected)) form.elements.categoryId.value = selected;
  }

  function showErrors(errors) {
    for (const name of fields) {
      const input = form.elements[name];
      const error = $(`${name}-error`);
      error.textContent = errors[name] || '';
      input.setAttribute('aria-invalid', String(Boolean(errors[name])));
      if (errors[name]) input.setAttribute('aria-describedby', error.id);
      else input.removeAttribute('aria-describedby');
    }
  }

  function openDialog() {
    form.reset();
    showErrors({});
    fillCategories('despesa');
    form.elements.date.min = `${state.month}-01`;
    form.elements.date.max = `${state.month}-${String(daysInMonth(state.month)).padStart(2, '0')}`;
    form.elements.date.value = `${state.month}-12`;
    dialog.showModal();
    form.elements.description.focus();
  }

  $('open-dialog').addEventListener('click', openDialog);
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  form.addEventListener('change', event => {
    if (event.target.name === 'type') fillCategories(event.target.value);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const result = validateMovement(data, state.month);
    showErrors(result.errors || {});
    if (result.errors) {
      form.elements[fields.find(name => result.errors[name])].focus();
      return;
    }
    state.movements.push({id: `novo-${nextId++}`, ...result.movement});
    dialog.close();
    renderAll();
    feedback(`Movimento adicionado: ${result.movement.description}, ${money(result.movement.amount)}.`);
  });

  renderAll();
  syncControls();
}
