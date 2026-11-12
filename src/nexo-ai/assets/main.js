'use strict';
const runs = [
  { id: 'EX-2841', task: 'Análise de tendências de mercado', agent: 'Atlas', status: 'Concluída', duration: '2,1 s', time: '09:42:18', result: 'Relatório de tendências preparado com 12 fontes analisadas.' },
  { id: 'EX-2840', task: 'Classificação de pedido de apoio', agent: 'Luna', status: 'Concluída', duration: '1,8 s', time: '09:41:52', result: 'Pedido classificado e encaminhado para a equipa de apoio.' },
  { id: 'EX-2839', task: 'Processamento de documentos', agent: 'Orion', status: 'Em curso', duration: '—', time: '09:40:36', result: 'A processar 24 documentos na fila.' },
  { id: 'EX-2838', task: 'Validação de dados de clientes', agent: 'Vega', status: 'Com erro', duration: '4,2 s', time: '09:38:11', result: 'Não foi possível validar um campo em falta. Reveja os dados e tente novamente.' },
  { id: 'EX-2837', task: 'Resumo de pesquisa semanal', agent: 'Atlas', status: 'Concluída', duration: '3,4 s', time: '09:35:04', result: 'Resumo semanal gerado com sucesso.' }
];
let queue = [
  { id: 'T-109', task: 'Analisar relatório trimestral', agent: 'Atlas', wait: 'há 2 min' },
  { id: 'T-108', task: 'Atualizar base de conhecimento', agent: 'Luna', wait: 'há 5 min' },
  { id: 'T-107', task: 'Verificar integridade dos dados', agent: 'Vega', wait: 'há 8 min' }
];
const agentFilter = document.querySelector('#agent-filter');
const periodFilter = document.querySelector('#period-filter');
const dialog = document.querySelector('#detail-dialog');
const logs = [ ['09:42:18', 'INFO', 'Atlas concluiu a execução EX-2841'], ['09:41:52', 'INFO', 'Luna concluiu a execução EX-2840'], ['09:38:11', 'ERRO', 'Vega: campo em falta na execução EX-2838'] ];
function render() {
  const selected = agentFilter.value;
  const visibleRuns = runs.filter(run => selected === 'all' || run.agent === selected);
  const visibleQueue = queue.filter(item => selected === 'all' || item.agent === selected);
  document.querySelector('#runs-body').innerHTML = visibleRuns.map(run => `<tr><td>${run.task}<small style="display:block;color:#789097;margin-top:4px">${run.id}</small></td><td>${run.agent}</td><td><span class="status ${run.status === 'Concluída' ? 'online' : 'busy'}">● ${run.status}</span></td><td>${run.duration}</td><td>${run.time}</td><td><button type="button" data-run="${run.id}" aria-label="Ver detalhes de ${run.id}">↗</button></td></tr>`).join('');
  document.querySelector('#runs-empty').hidden = visibleRuns.length > 0;
  document.querySelector('#queue-list').innerHTML = visibleQueue.map(item => `<div class="queue-item"><span class="agent-avatar ${item.agent === 'Atlas' ? 'violet' : item.agent === 'Luna' ? 'blue' : 'pink'}">${item.agent[0]}</span><span>${item.task}<small>${item.agent} · ${item.wait}</small></span><button type="button" data-queue="${item.id}">Detalhes</button></div>`).join('');
  document.querySelector('#queue-empty').hidden = visibleQueue.length > 0;
  document.querySelector('#queue-count').textContent = `${String(visibleQueue.length).padStart(2, '0')} NA FILA`;
  document.querySelector('#log-list').innerHTML = logs.filter(log => selected === 'all' || log[2].includes(selected)).map(log => `<div><time>${log[0]}</time><span class="log-level">${log[1]}</span>${log[2]}</div>`).join('') || '<div>Sem eventos para este agente.</div>';
  const factor = periodFilter.value === '24' ? 1 : periodFilter.value === '7' ? 7 : 30;
  const agentFactor = selected === 'all' ? 1 : .25;
  document.querySelector('#metric-runs').textContent = Math.round(1284 * factor * agentFactor).toLocaleString('pt-PT');
  document.querySelector('#metric-success').innerHTML = '98,2<span>%</span>';
  document.querySelector('#metric-time').innerHTML = '2,4<span>s</span>';
  document.querySelector('#metric-cost').textContent = (18.64 * factor * agentFactor).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  document.querySelector('#chart-times').innerHTML = (factor === 1 ? ['00:00','04:00','08:00','12:00','16:00','20:00','Agora'] : factor === 7 ? ['−7 dias','−6 dias','−5 dias','−4 dias','−3 dias','−2 dias','Hoje'] : ['−30 dias','−25 dias','−20 dias','−15 dias','−10 dias','−5 dias','Hoje']).map(label => `<span>${label}</span>`).join('');
}
function detail(title, description, rows, action, callback) {
  document.querySelector('#detail-title').textContent = title;
  document.querySelector('#detail-description').textContent = description;
  document.querySelector('#detail-content').innerHTML = rows.map(([label, value]) => `<div class="detail-row"><span>${label}</span><span>${value}</span></div>`).join('');
  const button = document.querySelector('#detail-action');
  button.textContent = action;
  button.onclick = () => { if (callback) callback(); dialog.close(); };
  dialog.showModal();
}
document.addEventListener('click', event => {
  const agent = event.target.closest('[data-agent]');
  if (agent) { agentFilter.value = agent.dataset.agent; render(); document.querySelector('#overview').scrollIntoView(); }
  const runButton = event.target.closest('[data-run]');
  if (runButton) {
    const run = runs.find(item => item.id === runButton.dataset.run);
    detail(run.id, run.task, [['Agente', run.agent], ['Estado', run.status], ['Duração', run.duration], ['Resultado', run.result]], 'Fechar');
  }
  const queueButton = event.target.closest('[data-queue]');
  if (queueButton) {
    const item = queue.find(entry => entry.id === queueButton.dataset.queue);
    detail(item.id, item.task, [['Agente', item.agent], ['Estado', 'Em espera'], ['Na fila', item.wait]], 'Processar tarefa', () => {
      queue = queue.filter(entry => entry.id !== item.id);
      runs.unshift({ id: 'EX-' + (2842 + (3 - queue.length)), task: item.task, agent: item.agent, status: 'Concluída', duration: '2,0 s', time: 'Agora', result: 'Tarefa processada com sucesso nesta demonstração.' });
      logs.unshift(['Agora', 'INFO', `${item.agent} processou ${item.id} na demonstração`]);
      render();
    });
  }
});
agentFilter.addEventListener('change', render);
periodFilter.addEventListener('change', render);
render();
