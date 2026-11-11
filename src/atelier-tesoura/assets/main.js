const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }
});

const form = document.querySelector('#form-marcacao');
const status = document.querySelector('#estado-marcacao');

const validators = {
  nome: (value) => value.trim().length >= 2,
  contacto: (value) => /^\+?[\d\s]{9,}$/.test(value.trim()) || /^\S+@\S+\.\S+$/.test(value.trim()),
  servico: (value) => value !== '',
};

function validateField(field) {
  const isValid = validators[field.name](field.value);
  const error = document.querySelector(`#erro-${field.name}`);
  field.setAttribute('aria-invalid', String(!isValid));
  error.hidden = isValid;
  return isValid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = Object.keys(validators).map((name) => form.elements[name]);
  const results = fields.map(validateField);

  if (!results.every(Boolean)) {
    status.textContent = 'Revê os campos assinalados.';
    fields.find((field, index) => !results[index]).focus();
    return;
  }

  // Sem backend: a submissão fica apenas no ecrã. Substitui este bloco por um fetch à tua API.
  form.reset();
  status.textContent = 'Pedido recebido. Entramos em contacto em menos de 24 horas.';
});
