'use strict';
const projects = {
  atlas: { title: 'Atlas — Analytics de produto', meta: 'FRONTEND / 2025 / 6 MESES', intro: 'Uma plataforma de análise que aproxima as equipas dos seus dados.', challenge: 'Consolidar informação dispersa numa interface utilizável por pessoas sem formação em análise de dados.', work: 'Liderei a arquitetura React e TypeScript, desenvolvi gráficos com alternativas textuais e implementei carregamento progressivo e testes dos percursos críticos.', result: 'O protótipo passou de cinco ecrãs dispersos para uma visão geral consistente, com filtros acessíveis por teclado e relatórios legíveis em mobile.' },
  linha: { title: 'Linha — Mobilidade urbana', meta: 'FULL STACK / 2024 / 8 MESES', intro: 'Planear uma viagem deve ser tão simples como escolher um destino.', challenge: 'Unificar percursos, horários e títulos de transporte num fluxo coerente, mesmo em ligações lentas.', work: 'Desenvolvi a aplicação Next.js, modelei dados em PostgreSQL e desenhei APIs Node.js com validação e tratamento explícito de falhas.', result: 'Um percurso de planeamento reduzido a três passos, com estados de indisponibilidade claros e uma interface adaptada à utilização em movimento.' },
  forma: { title: 'Forma — Design system', meta: 'FRONTEND / 2024 / 5 MESES', intro: 'Uma linguagem partilhada entre design e engenharia.', challenge: 'Três equipas mantinham versões diferentes dos mesmos componentes, criando inconsistências e trabalho repetido.', work: 'Criei tokens de design, componentes React documentados em Storybook e orientações de acessibilidade. Facilitei sessões de adoção com as equipas.', result: 'Uma biblioteca demonstrativa de 24 componentes com estados de erro, foco e carregamento documentados, pronta a evoluir com o produto.' },
  kit: { title: 'Kit — Ferramentas para a web', meta: 'OPEN SOURCE / 2023 / PROJETO CONTÍNUO', intro: 'Automatizar o repetitivo para dar espaço ao que merece atenção.', challenge: 'Ajudar pequenos projetos a identificar problemas comuns de estrutura e acessibilidade antes da publicação.', work: 'Desenhei uma CLI em JavaScript com mensagens acionáveis, testes de integração e documentação orientada a quem está a começar.', result: 'Uma prova de conceito local que agrupa verificações de HTML, contraste e navegação. O exemplo visual ilustra a saída prevista da ferramenta.' }
};
const theme = document.querySelector('#theme');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  theme.setAttribute('aria-pressed', String(dark));
  theme.textContent = dark ? 'Modo claro' : 'Modo escuro';
}
let saved;
try { saved = localStorage.getItem('mc-theme'); } catch {}
setTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
theme.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  setTheme(dark);
  try { localStorage.setItem('mc-theme', dark ? 'dark' : 'light'); } catch {}
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  let count = 0;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector('#result').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
  document.querySelector('#empty').hidden = count > 0;
}));
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  for (const key of ['title', 'meta', 'intro', 'challenge', 'work', 'result']) document.querySelector(`#detail-${key}`).textContent = project[key];
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
document.querySelector('#copy').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('ola@miguelcosta.example');
    status.textContent = 'Email copiado.';
  } catch {
    status.textContent = 'Não foi possível copiar. Selecione o email acima para o copiar manualmente.';
  }
});
const form = document.querySelector('#contact-form');
const fields = ['name', 'email', 'message'].map(id => document.getElementById(id));
function validate(field) {
  let message = '';
  const value = field.value.trim();
  if (!value) message = 'Preencha este campo.';
  else if (field.id === 'name' && value.length < 2) message = 'Indique um nome com pelo menos 2 caracteres.';
  else if (field.id === 'email' && field.validity.typeMismatch) message = 'Indique um endereço de email válido.';
  else if (field.id === 'message' && value.length < 20) message = 'Descreva o projeto com pelo menos 20 caracteres.';
  else if (field.validity.tooLong) message = 'O texto excede o limite permitido.';
  field.setAttribute('aria-invalid', String(Boolean(message)));
  document.getElementById(`${field.id}-error`).textContent = message;
  return !message;
}
fields.forEach(field => field.addEventListener('input', () => {
  document.querySelector('#form-status').textContent = '';
  if (field.hasAttribute('aria-invalid')) validate(field);
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = fields.map(validate).every(Boolean);
  const status = document.querySelector('#form-status');
  if (!valid) {
    status.textContent = 'Reveja os campos assinalados.';
    fields.find(field => field.getAttribute('aria-invalid') === 'true').focus();
    return;
  }
  status.textContent = 'Mensagem validada com sucesso. Esta demonstração não envia nem guarda dados. Para contactar, utilize o email indicado.';
});
