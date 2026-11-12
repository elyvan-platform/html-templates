(() => {
  'use strict';
  const opening = Date.parse('2027-10-14T09:00:00+01:00');
  const countdown = document.querySelector('#countdown');
  function updateCountdown() {
    const seconds = Math.max(0, Math.floor((opening - Date.now()) / 1000));
    countdown.hidden = seconds === 0;
    document.querySelector('#countdown-ended').hidden = seconds > 0;
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    countdown.innerHTML = values.map((value, i) => `<span>${String(value).padStart(2, '0')} <small>${['dias', 'horas', 'min', 'seg'][i]}</small></span>`).join('');
    return seconds;
  }
  if (updateCountdown() > 0) {
    const timer = setInterval(() => { if (updateCountdown() === 0) clearInterval(timer); }, 1000);
  }
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const mobile = matchMedia('(max-width: 680px)');
  function syncMenu() { menu.hidden = !mobile.matches; navigation.hidden = mobile.matches && menu.getAttribute('aria-expanded') !== 'true'; }
  menu.addEventListener('click', () => { menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') !== 'true')); syncMenu(); });
  navigation.addEventListener('click', event => { if (event.target.closest('a') && mobile.matches) { menu.setAttribute('aria-expanded', 'false'); syncMenu(); } });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobile.matches && menu.getAttribute('aria-expanded') === 'true') { menu.setAttribute('aria-expanded', 'false'); syncMenu(); menu.focus(); } });
  mobile.addEventListener('change', syncMenu); syncMenu();
  const sessions = [
    { day: '14', stage: 'principal', time: '09:00', title: 'O futuro precisa de perguntas melhores', speaker: 'Inês Carvalho', type: 'Abertura · 45 min' },
    { day: '14', stage: 'principal', time: '11:00', title: 'Desenhar para quem ainda não está na sala', speaker: 'Rui Matos', type: 'Conversa · 50 min' },
    { day: '14', stage: 'lab', time: '14:30', title: 'Código com uma pegada mais leve', speaker: 'Sofia Lopes', type: 'Laboratório · 90 min' },
    { day: '15', stage: 'principal', time: '10:00', title: 'A próxima grande rede é a nossa comunidade', speaker: 'Tiago Almeida', type: 'Conversa · 45 min' },
    { day: '15', stage: 'principal', time: '14:00', title: 'Pessoas primeiro. Algoritmos depois.', speaker: 'Inês Carvalho e Rui Matos', type: 'Mesa-redonda · 60 min' }
  ];
  let day = '14';
  const stage = document.querySelector('#stage');
  function renderAgenda() {
    const visible = sessions.filter(session => session.day === day && (stage.value === 'all' || session.stage === stage.value));
    document.querySelector('#sessions').innerHTML = visible.map(session => `<article class="session"><time datetime="2027-10-${session.day}T${session.time}:00+01:00">${session.time}</time><div><h3>${session.title}</h3><p>${session.speaker} · ${session.type}</p></div><span class="tag">${session.stage === 'principal' ? 'PALCO PULSO' : 'LABORATÓRIO'}</span></article>`).join('');
    document.querySelector('#empty-sessions').hidden = visible.length > 0;
    document.querySelector('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'sessão' : 'sessões'} · ${day} de outubro · ${stage.options[stage.selectedIndex].text}`;
  }
  document.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => {
    day = button.dataset.day;
    document.querySelectorAll('[data-day]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderAgenda();
  }));
  stage.addEventListener('change', renderAgenda); renderAgenda();
  const form = document.querySelector('#interest-form');
  const status = document.querySelector('#form-status');
  document.querySelectorAll('[data-plan]').forEach(link => link.addEventListener('click', () => { form.elements.plan.value = link.dataset.plan; status.textContent = ''; }));
  function error(field, message) {
    document.querySelector(`#${field.id}-error`).textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return Boolean(message);
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const { name, email, consent } = form.elements;
    const invalid = [
      error(name, name.value.trim().length < 2 ? 'Indica um nome com pelo menos dois caracteres.' : ''),
      error(email, !email.value.trim() || !email.validity.valid ? 'Indica um endereço de e-mail válido, por exemplo nome@exemplo.pt.' : ''),
      error(consent, !consent.checked ? 'Confirma que compreendes o carácter demonstrativo do formulário.' : '')
    ];
    if (invalid.some(Boolean)) { status.textContent = 'Revê os campos assinalados para continuar.'; form.querySelector('[aria-invalid="true"]').focus(); return; }
    status.textContent = `Interesse demonstrado no ${form.elements.plan.selectedOptions[0].text.split(' · ')[0].toLowerCase()}. Esta confirmação é apenas local: nenhum dado foi enviado ou guardado e nenhum bilhete foi reservado.`;
    form.reset(); status.focus();
  });
  ['name', 'email', 'consent'].forEach(id => form.elements[id].addEventListener('input', () => { error(form.elements[id], ''); status.textContent = ''; }));
})();
