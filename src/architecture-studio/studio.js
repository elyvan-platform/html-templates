'use strict';
const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'Todos' && project.dataset.category !== button.dataset.filter;
    if (!project.hidden) count++;
  });
  document.querySelector('#result').textContent = `${count} ${count === 1 ? 'projeto apresentado' : 'projetos apresentados'}`;
  document.querySelector('#empty').hidden = count !== 0;
}));
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.name;
    const message = form.elements.message;
    name.setCustomValidity(name.value.trim() ? '' : 'Indique o seu nome.');
    message.setCustomValidity(message.value.trim().length >= 20 ? '' : 'Descreva o projeto com pelo menos 20 caracteres.');
    if (!form.reportValidity()) return;
    const status = document.querySelector('#form-status');
    status.textContent = 'Mensagem validada. Esta é uma demonstração: os dados não foram enviados nem guardados.';
    form.reset();
  });
  form.addEventListener('input', event => {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    document.querySelector('#form-status').textContent = '';
  });
}
