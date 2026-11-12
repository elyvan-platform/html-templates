const themeSelect = document.querySelector('#theme');
let preference = 'system';
try { preference = localStorage.getItem('showcase-theme') || 'system'; } catch {}
if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  document.documentElement.dataset.theme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
}
applyTheme();
if (themeSelect) {
  themeSelect.value = preference;
  themeSelect.addEventListener('change', () => {
    preference = themeSelect.value;
    try { localStorage.setItem('showcase-theme', preference); } catch {}
    applyTheme();
  });
}
systemTheme.addEventListener('change', applyTheme);
const cards = [...document.querySelectorAll('.template-card')];
let area = 'all';
const search = document.querySelector('#search');
function filterCards() {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const query = normalize(search?.value.trim() || '');
  let count = 0;
  for (const card of cards) {
    card.hidden = (area !== 'all' && card.dataset.area !== area) || !normalize(card.textContent).includes(query);
    if (!card.hidden) count++;
  }
  document.querySelector('#result-count').textContent = `${count} de ${cards.length} templates`;
  document.querySelector('#no-results').hidden = count !== 0;
  resizeThumbnails();
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  area = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterCards();
}));
search?.addEventListener('input', filterCards);
document.querySelector('#reset-filters')?.addEventListener('click', () => {
  search.value = '';
  document.querySelector('[data-filter="all"]').click();
});
function resizeThumbnails() {
  for (const card of cards) {
    if (!card.hidden) card.querySelector('.thumbnail').style.transform = `scale(${card.querySelector('.template-preview').clientWidth / 1440})`;
  }
}
const dialog = document.querySelector('#preview-dialog');
const frame = document.querySelector('#device-frame');
let device = 'desktop';
const sizes = {mobile: [390, 844], tablet: [768, 1024], desktop: [1440, 900]};
function resizeDevice() {
  if (!frame || (dialog && !dialog.open)) return;
  const [width, height] = sizes[device];
  const stage = document.querySelector('.preview-stage');
  const available = stage.clientWidth - parseFloat(getComputedStyle(stage).paddingLeft) - parseFloat(getComputedStyle(stage).paddingRight);
  const scale = Math.min(1, Math.max(0.1, available / width));
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
  frame.style.transform = `scale(${scale})`;
  const wrap = frame.parentElement;
  wrap.style.width = `${width * scale}px`;
  wrap.style.height = `${height * scale}px`;
  document.querySelector('#viewport-label').textContent = `${width} × ${height} px · ${Math.round(scale * 100)}%`;
}
document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
  device = button.dataset.device;
  document.querySelectorAll('[data-device]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  resizeDevice();
}));
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  frame.src = button.dataset.href;
  frame.title = `Preview de ${button.dataset.name}`;
  document.querySelector('#preview-title').textContent = button.dataset.name;
  document.querySelector('#preview-direct').href = button.dataset.href;
  dialog.showModal();
  resizeDevice();
}));
document.querySelector('#close-preview')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => { frame.src = 'about:blank'; });
window.addEventListener('resize', () => { resizeThumbnails(); resizeDevice(); });
resizeThumbnails();
resizeDevice();
