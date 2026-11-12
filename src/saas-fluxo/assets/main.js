const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
const header = document.querySelector('.header');

root.classList.add('js-ready');

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

const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Entradas escalonadas: cada cartão entra ao aparecer no ecrã.
const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${(index % 3) * 0.1}s`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

// Contagem animada dos números.
function animateCount(element) {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const suffix = element.dataset.suffix || '';
  const format = (value) => `${value.toFixed(decimals)}${suffix}`;

  if (reduceMotion) {
    element.textContent = format(target);
    return;
  }

  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = format(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach((element) => {
  // Mantém o valor final no HTML para quem não tem JavaScript.
  countObserver.observe(element);
});

// Alternância mensal / anual nos preços.
const billingButtons = document.querySelectorAll('[data-billing]');
const priceElements = document.querySelectorAll('[data-price-monthly]');

function setBilling(period) {
  billingButtons.forEach((button) => {
    const isActive = button.dataset.billing === period;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  priceElements.forEach((element) => {
    const value = element.dataset[period === 'yearly' ? 'priceYearly' : 'priceMonthly'];
    element.textContent = value;
  });
}

billingButtons.forEach((button) => {
  button.addEventListener('click', () => setBilling(button.dataset.billing));
});
