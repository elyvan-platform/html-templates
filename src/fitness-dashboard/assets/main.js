/* Dados fictícios e determinísticos. Sem pedidos de rede ou persistência. */
const periods = {
  week: { label: '9–15 novembro 2026', labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], minutes: [35, 30, 0, 45, 25, 50, 0], workouts: 5, calories: 1240, distance: 12.4, targets: [6, 210, 15] },
  previous: { label: '2–8 novembro 2026', labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], minutes: [30, 0, 40, 20, 0, 45, 0], workouts: 4, calories: 930, distance: 9.2, targets: [6, 210, 15] },
  month: { label: '1–30 novembro 2026', labels: ['1–7', '8–14', '15–21', '22–28', '29–30'], minutes: [135, 185, 0, 0, 0], workouts: 9, calories: 2170, distance: 21.6, targets: [24, 840, 60] }
};
const activities = [
  { type: 'Corrida', name: 'Corrida no parque', date: '2026-11-14', display: '14 nov', minutes: 50, detail: '7,2 km · Ao ar livre' },
  { type: 'Mobilidade', name: 'Mobilidade e alongamentos', date: '2026-11-13', display: '13 nov', minutes: 25, detail: 'Recuperação ativa' },
  { type: 'Força', name: 'Força de corpo inteiro', date: '2026-11-12', display: '12 nov', minutes: 45, detail: 'Circuito · 5 exercícios' },
  { type: 'Corrida', name: 'Corrida leve', date: '2026-11-10', display: '10 nov', minutes: 30, detail: '5,2 km · Ao ar livre' },
  { type: 'Força', name: 'Força e estabilidade', date: '2026-11-09', display: '9 nov', minutes: 35, detail: 'Circuito · 4 exercícios' },
  { type: 'Corrida', name: 'Corrida de resistência', date: '2026-11-07', display: '7 nov', minutes: 45, detail: '6,1 km · Ao ar livre' },
  { type: 'Força', name: 'Zona central', date: '2026-11-05', display: '5 nov', minutes: 20, detail: 'Circuito · 3 exercícios' },
  { type: 'Corrida', name: 'Corrida progressiva', date: '2026-11-04', display: '4 nov', minutes: 40, detail: '3,1 km · Ao ar livre' },
  { type: 'Força', name: 'Força de pernas', date: '2026-11-02', display: '2 nov', minutes: 30, detail: 'Circuito · 4 exercícios' }
];
const exercises = [
  { name: 'Agachamento', detail: '3 séries × 12 repetições · 60 s de pausa' },
  { name: 'Flexões', detail: '3 séries × 10 repetições · 60 s de pausa' },
  { name: 'Remada com halteres', detail: '3 séries × 12 repetições · 60 s de pausa' },
  { name: 'Prancha', detail: '3 séries × 30 segundos · 30 s de pausa' }
];
const totalMinutes = key => periods[key].minutes.reduce((sum, value) => sum + value, 0);
function historyFor(period, type = 'all') {
  return activities.filter(activity => {
    const inPeriod = period === 'month' || (period === 'previous' ? activity.date < '2026-11-09' : activity.date >= '2026-11-09');
    return inPeriod && (type === 'all' || activity.type === type);
  });
}
function init() {
  const $ = id => document.getElementById(id);
  const number = value => value.toLocaleString('pt-PT');
  function renderHistory() {
    const rows = historyFor($('period').value, $('history-filter').value);
    $('history-rows').innerHTML = rows.map(row => `<tr><td><strong>${row.name}</strong><small>${row.detail}</small></td><td><time datetime="${row.date}">${row.display}</time></td><td>${row.minutes} min</td></tr>`).join('');
    $('empty-history').hidden = rows.length > 0;
    $('history-count').textContent = `${rows.length} ${rows.length === 1 ? 'atividade de exemplo' : 'atividades de exemplo'}`;
  }
  function renderPeriod() {
    const key = $('period').value;
    const data = periods[key];
    const minutes = totalMinutes(key);
    $('date-range').textContent = data.label;
    $('activity-total').textContent = number(minutes);
    $('stats').innerHTML = [
      ['Treinos realizados', data.workouts, 'treinos', 'Cada sessão faz a diferença', '↗'],
      ['Tempo em movimento', minutes, 'min', 'Tempo total de atividade', '◷'],
      ['Energia em atividade', number(data.calories), 'kcal', 'Estimativa demonstrativa', 'ϟ'],
      ['Distância percorrida', number(data.distance), 'km', 'Corridas do período', '↗']
    ].map(([label, value, unit, note, icon]) => `<article class="stat"><div class="stat-top"><span>${label}</span><span aria-hidden="true">${icon}</span></div><div class="stat-value">${value} <small>${unit}</small></div><p>${note}</p></article>`).join('');
    const maximum = Math.max(...data.minutes, 60);
    $('chart').innerHTML = data.minutes.map((value, i) => `<div class="chart-column"><span class="chart-value">${value}<span class="sr-only"> minutos</span></span><div class="bar" style="height:${value / maximum * 120}px" aria-hidden="true"></div><span class="chart-label">${data.labels[i]}</span></div>`).join('');
    $('goals').innerHTML = [['Treinar com consistência', data.workouts, data.targets[0], 'treinos'], ['Manter o movimento', minutes, data.targets[1], 'min'], ['Ir mais longe', data.distance, data.targets[2], 'km']].map(([name, value, target, unit]) => `<div class="goal"><div class="goal-line"><span>${name}</span><span>${number(value)} / ${target} ${unit}</span></div><progress max="${target}" value="${Math.min(value, target)}" aria-label="${name}">${Math.round(value / target * 100)}%</progress></div>`).join('');
    renderHistory();
  }
  $('exercises').innerHTML = exercises.map((exercise, index) => `<label class="exercise"><input type="checkbox" name="exercise" value="${index}"><span class="exercise-name">${exercise.name}<small>${exercise.detail}</small></span><span class="exercise-number" aria-hidden="true">0${index + 1}</span></label>`).join('');
  function updateWorkout() {
    const count = document.querySelectorAll('input[name="exercise"]:checked').length;
    $('plan-progress').textContent = count === exercises.length ? 'Treino concluído. Bom trabalho!' : `${count} de ${exercises.length} concluídos`;
    $('workout-progress').value = count;
  }
  $('exercises').addEventListener('change', updateWorkout);
  $('reset-plan').addEventListener('click', () => {
    document.querySelectorAll('input[name="exercise"]').forEach(input => { input.checked = false; });
    updateWorkout();
  });
  $('period').addEventListener('change', renderPeriod);
  $('history-filter').addEventListener('change', renderHistory);
  $('clear-filter').addEventListener('click', () => {
    $('history-filter').value = 'all';
    renderHistory();
    $('history-filter').focus();
  });
  const links = document.querySelectorAll('nav a');
  links.forEach(link => link.addEventListener('click', () => {
    links.forEach(item => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
    link.classList.add('active');
    link.setAttribute('aria-current', 'location');
  }));
  links[0].setAttribute('aria-current', 'location');
  renderPeriod();
}
if (typeof document !== 'undefined') init();
if (typeof module !== 'undefined') module.exports = { periods, activities, exercises, totalMinutes, historyFor };
