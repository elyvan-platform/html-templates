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
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
function filterCards() {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const query = normalize(search?.value.trim() || '');
  let count = 0;
  for (const card of cards) {
    card.hidden = (document.querySelector('#favorites-view')?.getAttribute('aria-pressed') === 'true' && card.dataset.favorite !== 'true') || (area !== 'all' && card.dataset.area !== area) || !normalize(card.dataset.search).includes(query);
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
window.addEventListener('resize', resizeDevice);
resizeDevice();

// Store only catalogue identifiers; stale or malformed saved data never becomes markup.
if (document.querySelector('#favorites-view')) {
  const bySlug = new Map(cards.map(card => [card.dataset.slug, card]));
  function readSelection(key, maximum = Infinity) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return new Set((Array.isArray(value) ? value : []).filter(slug => typeof slug === 'string' && bySlug.has(slug)).filter((slug, index, list) => list.indexOf(slug) === index).slice(0, maximum));
    } catch { return new Set(); }
  }
  const favorites = readSelection('showcase-favorites');
  const selected = readSelection('showcase-comparison', 3);
  const favoritesView = document.querySelector('#favorites-view');
  const comparison = document.querySelector('#comparison-dialog');
  const columns = document.querySelector('#comparison-columns');
  const selection = document.querySelector('#comparison-selection');
  const open = document.querySelector('#open-comparison');
  const status = document.querySelector('#selection-status');
  function save() {
    try {
      localStorage.setItem('showcase-favorites', JSON.stringify([...favorites]));
      localStorage.setItem('showcase-comparison', JSON.stringify([...selected]));
    } catch { status.textContent = 'Armazenamento indisponível. As escolhas mantêm-se apenas nesta página.'; }
  }
  function remove(slug) {
    selected.delete(slug);
    update();
    save();
    status.textContent = 'Template removido da comparação.';
    // Rebuilt controls no longer own focus. Choose the next useful native control.
    (comparison.open ? document.querySelector('#close-comparison') : open.disabled ? document.querySelector('#clear-comparison') : open).focus();
  }
  function removeButton(slug, name) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `Remover ${name}`;
    button.addEventListener('click', () => remove(slug));
    return button;
  }
  function update() {
    favoritesView.textContent = `Favoritos (${favorites.size})`;
    document.querySelector('#favorites-empty').hidden = favorites.size !== 0 || favoritesView.getAttribute('aria-pressed') !== 'true';
    for (const card of cards) {
      const slug = card.dataset.slug;
      card.dataset.favorite = String(favorites.has(slug));
      const favorite = card.querySelector('[data-favorite]');
      favorite.setAttribute('aria-pressed', String(favorites.has(slug)));
      favorite.textContent = favorites.has(slug) ? '★ Favorito' : '☆ Favorito';
      const compare = card.querySelector('[data-compare]');
      compare.setAttribute('aria-pressed', String(selected.has(slug)));
      compare.textContent = selected.has(slug) ? 'Remover da comparação' : 'Comparar';
      compare.setAttribute('aria-describedby', 'selection-help');
    }
    open.textContent = `Comparar (${selected.size}/3)`;
    open.disabled = selected.size < 2;
    selection.replaceChildren();
    columns.replaceChildren();
    document.querySelector('#comparison-empty').hidden = selected.size >= 2;
    for (const slug of selected) {
      const card = bySlug.get(slug);
      const name = card.dataset.name;
      selection.append(removeButton(slug, name));
      const column = document.createElement('article');
      const title = document.createElement('h3');
      title.textContent = name;
      column.append(title);
      for (const [label, value] of [
        ['Área', card.dataset.area],
        ['Descrição', card.querySelector('.template-copy').textContent],
        ['Labels existentes', card.querySelector('.featured-badge')?.textContent || 'Sem labels adicionais'],
      ]) {
        const paragraph = document.createElement('p');
        const heading = document.createElement('strong');
        heading.textContent = `${label}: `;
        paragraph.append(heading, value);
        column.append(paragraph);
      }
      const link = card.querySelector('.card-actions a').cloneNode(true);
      link.setAttribute('aria-label', `Abrir site: ${name} (nova janela)`);
      column.append(link, removeButton(slug, name));
      columns.append(column);
    }
    filterCards();
  }
  for (const card of cards) {
    const slug = card.dataset.slug;
    card.querySelector('[data-favorite]').addEventListener('click', () => {
      favorites.has(slug) ? favorites.delete(slug) : favorites.add(slug);
      update();
      save();
      status.textContent = favorites.has(slug) ? 'Template guardado nos favoritos.' : 'Template removido dos favoritos.';
      if (card.hidden) favoritesView.focus();
    });
    card.querySelector('[data-compare]').addEventListener('click', () => {
      if (selected.has(slug)) selected.delete(slug);
      else if (selected.size < 3) selected.add(slug);
      else {
        status.textContent = 'Limite de 3 templates. Remova um da seleção para o substituir.';
        return;
      }
      update();
      save();
      status.textContent = `${selected.size} de 3 templates selecionados. Selecione pelo menos 2 para comparar.`;
    });
  }
  favoritesView.addEventListener('click', () => {
    const active = favoritesView.getAttribute('aria-pressed') !== 'true';
    favoritesView.setAttribute('aria-pressed', String(active));
    update();
  });
  open.addEventListener('click', () => { if (selected.size >= 2) comparison.showModal(); });
  document.querySelector('#close-comparison').addEventListener('click', () => comparison.close());
  comparison.addEventListener('close', () => (open.disabled ? document.querySelector('#clear-comparison') : open).focus());
  for (const id of ['clear-comparison', 'clear-comparison-dialog']) {
    document.querySelector(`#${id}`).addEventListener('click', () => {
      selected.clear();
      update();
      save();
      status.textContent = 'Comparação limpa.';
      if (comparison.open) comparison.close();
    });
  }
  update();
}
