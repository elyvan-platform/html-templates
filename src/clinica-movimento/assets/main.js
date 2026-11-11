const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'Esta é uma demonstração. Nenhum pedido foi enviado.';
});
