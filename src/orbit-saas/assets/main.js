const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});
document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
  const annual = button.dataset.billing === 'yearly';
  document.querySelectorAll('[data-billing]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  document.querySelectorAll('[data-price]').forEach(price => { price.textContent = annual ? price.dataset.annual : price.dataset.price; });
  document.querySelectorAll('[data-note]').forEach(note => { note.textContent = annual ? 'Por pessoa/mês, faturado anualmente.' : 'Faturado mensalmente.'; });
}));
const dialog = document.querySelector('#signup');
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  const annual = document.querySelector('[data-billing="yearly"]').getAttribute('aria-pressed') === 'true';
  document.querySelector('#signup-copy').textContent = `Escolheu o plano ${button.dataset.plan}${button.dataset.plan === 'Free' ? '.' : ` com faturação ${annual ? 'anual' : 'mensal'}.`}`;
  dialog.showModal();
}));
dialog.querySelectorAll('.close, .close-dialog').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
