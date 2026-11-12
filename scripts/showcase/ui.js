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
// Thumbnails are static <img> elements lazy-loaded natively; a broken file reveals the name placeholder.
function markMissing(image) {
  image.closest('.thumb-frame')?.classList.add('is-missing');
}
document.querySelectorAll('.thumbnail').forEach(image => {
  image.addEventListener('error', () => markMissing(image));
  if (image.complete && image.naturalWidth === 0) markMissing(image);
});
let area = 'all';
let favoritesOnly = false;
let favorites = new Set();
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
function filterCards() {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const query = normalize(search?.value.trim() || '');
  let count = 0;
  for (const card of cards) {
    card.hidden = (favoritesOnly && !favorites.has(card.dataset.slug)) || (area !== 'all' && card.dataset.area !== area) || !normalize(card.dataset.search).includes(query);
    if (!card.hidden) count++;
  }
  document.querySelector('#result-count').textContent = `${count} de ${cards.length} templates`;
  document.querySelector('#no-results').hidden = count !== 0;
  for (const id of ['featured', 'catalogue']) {
    const section = document.querySelector(`#${id}-section`);
    const grid = document.querySelector(`#${id}-grid`);
    const sorted = [...grid.children].sort((a, b) => {
      const byName = a.dataset.name.localeCompare(b.dataset.name, 'pt');
      return (sort.value === 'za' ? -byName : byName) || a.dataset.slug.localeCompare(b.dataset.slug, 'en');
    });
    sorted.forEach(card => grid.appendChild(card));
    section.hidden = !sorted.some(card => !card.hidden);
  }
}
const areaSelect = document.querySelector('#area-select');
function setArea(value) {
  area = value;
  if (areaSelect) areaSelect.value = value;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === value)));
  filterCards();
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => setArea(button.dataset.filter)));
areaSelect?.addEventListener('change', () => setArea(areaSelect.value));
search?.addEventListener('input', filterCards);
sort?.addEventListener('change', filterCards);
document.querySelector('#reset-filters')?.addEventListener('click', () => {
  search.value = '';
  setArea('all');
});
// Store only catalogue identifiers; unavailable storage leaves this session usable.
if (document.querySelector('#favorites-view')) {
  const valid = new Map(cards.map(card => [card.dataset.slug, card]));
  const read = key => {
    try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && valid.has(id)))] : []; } catch { return []; }
  };
  favorites = new Set(read('showcase-favorites'));
  let selected = read('showcase-comparison').slice(0, 3);
  const save = () => { try { localStorage.setItem('showcase-favorites', JSON.stringify([...favorites])); localStorage.setItem('showcase-comparison', JSON.stringify(selected)); } catch {} };
  const favoriteView = document.querySelector('#favorites-view');
  const open = document.querySelector('#open-comparison');
  const status = document.querySelector('#selection-status');
  const panel = document.querySelector('#comparison');
  const items = document.querySelector('#comparison-items');
  const controls = document.querySelector('#catalogue-controls');
  function render() {
    for (const card of cards) {
      const fav = card.querySelector('[data-favorite]');
      const compare = card.querySelector('[data-compare]');
      const isFav = favorites.has(card.dataset.slug), isSelected = selected.includes(card.dataset.slug);
      fav.setAttribute('aria-pressed', String(isFav));
      fav.textContent = isFav ? '♥ Favorito' : '♡ Favorito';
      fav.setAttribute('aria-label', `${isFav ? 'Remover dos' : 'Adicionar aos'} favoritos: ${card.dataset.name}`);
      compare.setAttribute('aria-pressed', String(isSelected));
      compare.textContent = isSelected ? '✓ Comparar' : 'Comparar';
      compare.setAttribute('aria-label', `Comparar: ${card.dataset.name}`);
    }
    favoriteView.textContent = `Favoritos (${favorites.size})`;
    favoriteView.setAttribute('aria-pressed', String(favoritesOnly));
    open.textContent = `Comparar (${selected.length}/3)`;
    open.disabled = selected.length < 2;
    items.replaceChildren();
    for (const id of selected) {
      const card = valid.get(id), column = document.createElement('article');
      column.className = 'comparison-item';
      const heading = document.createElement('h3'); heading.textContent = card.dataset.name;
      const area = document.createElement('p'); area.textContent = `Área: ${card.dataset.area}`;
      const description = document.createElement('p'); description.textContent = card.querySelector('.template-copy').textContent;
      const badge = card.querySelector('.featured-badge');
      const label = document.createElement('p'); label.textContent = badge ? `Label: ${badge.textContent}` : 'Label: —';
      const link = card.querySelector('.card-actions a').cloneNode(true);
      const preview = card.querySelector('.preview-action').cloneNode(true);
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remover'; remove.setAttribute('aria-label', `Remover ${card.dataset.name} da comparação`);
      remove.addEventListener('click', () => { selected = selected.filter(item => item !== id); save(); render(); document.querySelector('#comparison-title').focus(); });
      column.append(heading, area, description, label, link, preview, remove); items.append(column);
    }
    if (!selected.length) { const empty = document.createElement('p'); empty.textContent = 'Ainda não há templates para comparar.'; items.append(empty); }
    filterCards();
    const emptyTitle = document.querySelector('#no-results h2');
    const emptyCopy = document.querySelector('#no-results p');
    emptyTitle.textContent = favoritesOnly && !favorites.size ? 'Ainda não tem favoritos' : 'Nenhum template encontrado';
    emptyCopy.textContent = favoritesOnly && !favorites.size ? 'Marque templates com ♡ para os guardar aqui.' : 'Experimente outra pesquisa ou explore todas as áreas.';
  }
  for (const card of cards) {
    const id = card.dataset.slug;
    card.querySelector('[data-favorite]').addEventListener('click', () => { const removing = favorites.has(id); removing ? favorites.delete(id) : favorites.add(id); save(); render(); if (removing && favoritesOnly) favoriteView.focus(); });
    card.querySelector('[data-compare]').addEventListener('click', () => {
      if (selected.includes(id)) selected = selected.filter(item => item !== id);
      else if (selected.length < 3) selected.push(id);
      else { status.textContent = 'Limite de 3 templates. Remova um para adicionar outro.'; return; }
      status.textContent = 'Selecione 2 ou 3 templates para comparar.'; save(); render();
    });
  }
  favoriteView.addEventListener('click', () => { favoritesOnly = !favoritesOnly; render(); });
  open.addEventListener('click', () => { controls.hidden = true; panel.hidden = false; render(); document.querySelector('#comparison-title').focus(); });
  document.querySelector('#back-catalogue').addEventListener('click', () => { panel.hidden = true; controls.hidden = false; open.focus(); });
  document.querySelector('#clear-comparison').addEventListener('click', () => { selected = []; save(); render(); status.textContent = 'Comparação limpa.'; });
  save(); render();
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
document.addEventListener?.('click', event => {
  const button = event.target.closest('[data-preview]');
  if (!button) return;
  frame.src = button.dataset.href;
  frame.title = `Preview de ${button.dataset.name}`;
  document.querySelector('#preview-title').textContent = button.dataset.name;
  document.querySelector('#preview-direct').href = button.dataset.href;
  dialog.showModal();
  resizeDevice();
});
document.querySelector('#close-preview')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => { frame.src = 'about:blank'; });
window.addEventListener('resize', resizeDevice);
resizeDevice();
