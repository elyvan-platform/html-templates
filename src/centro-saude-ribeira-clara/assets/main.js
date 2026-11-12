const button = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
const mobile = window.matchMedia('(max-width: 800px)');

function updateMenu() {
  button.hidden = !mobile.matches;
  navigation.hidden = mobile.matches && button.getAttribute('aria-expanded') !== 'true';
  if (!mobile.matches) button.setAttribute('aria-expanded', 'false');
}
button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
  updateMenu();
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobile.matches) {
    button.setAttribute('aria-expanded', 'false');
    updateMenu();
  }
});
mobile.addEventListener('change', updateMenu);
updateMenu();
