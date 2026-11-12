(function () {
  'use strict';

  function validate(values) {
    var errors = {};
    if (!values.nome || values.nome.trim().length < 2) errors.nome = 'Indique o seu nome (mínimo 2 caracteres).';
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Indique um e-mail válido, por exemplo nome@empresa.pt.';
    if (!values.servico) errors.servico = 'Escolha o serviço de interesse.';
    if (!values.mensagem || values.mensagem.trim().length < 20) errors.mensagem = 'Descreva o pedido com pelo menos 20 caracteres.';
    return errors;
  }

  if (typeof module !== 'undefined') module.exports = { validate: validate };
  if (typeof document === 'undefined' || !document.querySelector) return;

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('#nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        toggle.focus();
      }
    });
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length]);
    });
  });

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-faq] details'));
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) items.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  var form = document.getElementById('contact-form');
  if (form) {
    var fields = ['nome', 'email', 'servico', 'mensagem'];
    var state = document.getElementById('form-estado');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var values = {};
      fields.forEach(function (f) { values[f] = form.elements[f].value; });
      var errors = validate(values);
      var first = null;
      fields.forEach(function (f) {
        var box = document.getElementById('erro-' + f);
        var input = form.elements[f];
        box.hidden = !errors[f];
        box.textContent = errors[f] || '';
        input.setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
        if (errors[f] && !first) first = input;
      });
      if (first) {
        state.hidden = true;
        first.focus();
        return;
      }
      state.hidden = false;
      state.textContent = 'Obrigado, ' + values.nome.trim() + '. Pedido registado localmente para "' + values.servico + '" (demonstração, nada foi enviado).';
      form.reset();
      state.focus();
    });
  }
})();
