'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 700px)');
function syncMenu() {
  menuButton.hidden = !mobile.matches;
  navigation.hidden = mobile.matches;
  menuButton.setAttribute('aria-expanded', 'false');
}
syncMenu();
mobile.addEventListener('change', syncMenu);
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobile.matches) {
    navigation.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobile.matches) {
    navigation.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});

const materials = {
  madeira: { region: 'MADEIRA / GRANDE PORTO', title: 'Uma nova vida para cada fibra.', quantity: '2,4 t', matches: '03', distance: '28 km', source: 'Oficina do Vale', type: 'Aparas de madeira não tratada', destination: 'Coletivo Raiz', use: 'Painéis para mobiliário', note: 'Compatibilidade indicativa. A qualidade e a viabilidade exigem validação entre as empresas.' },
  textil: { region: 'TÊXTIL / VALE DO AVE', title: 'O próximo capítulo de um tecido.', quantity: '850 kg', matches: '02', distance: '16 km', source: 'Trama do Norte', type: 'Sobras de corte de algodão', destination: 'Linha Circular', use: 'Acessórios têxteis', note: 'Compatibilidade indicativa. A composição e a qualidade exigem validação entre as empresas.' },
  embalagens: { region: 'EMBALAGENS / MINHO', title: 'À espera da ligação certa.', quantity: '320 un.', matches: '00', distance: '—', source: 'Armazém da Serra', type: 'Caixas de transporte reutilizáveis', destination: 'Sem ligação neste cenário', use: 'Experimente outro material', note: 'Ainda não existem destinos compatíveis nesta demonstração. Selecione Madeira ou Têxtil para explorar oportunidades.' },
};
const materialButtons = document.querySelectorAll('[data-material]');
materialButtons.forEach(button => button.addEventListener('click', () => {
  const material = materials[button.dataset.material];
  if (!material) return;
  materialButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  Object.entries(material).forEach(([key, value]) => {
    document.getElementById(`material-${key}`).textContent = value;
  });
}));

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
// Keep the static template inert without JavaScript too: only this listener enables submission.
const submit = form.querySelector('button[type="submit"]');
submit.disabled = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = form.elements.namedItem('name');
  const message = form.elements.namedItem('message');
  for (const field of [name, message]) {
    field.setCustomValidity(field.value.trim() ? '' : 'Escreva algum texto além de espaços.');
  }
  if (!form.reportValidity()) return;
  form.reset();
  status.textContent = 'Simulação concluída. O seu pedido não foi enviado nem guardado. Pode experimentar novamente.';
  status.focus();
});
form.addEventListener('input', event => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  status.textContent = '';
});
