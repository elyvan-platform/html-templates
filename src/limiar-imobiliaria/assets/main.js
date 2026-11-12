'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const {properties, filterProperties} = Limiar;
  const money = n => new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', maximumFractionDigits:0}).format(n);
  const key = 'limiar-favorites';
  let saved = [], onlyFavorites = false, active = null, photoIndex = 0, returnFocus = null, timer;
  try { const stored = JSON.parse(localStorage.getItem(key)); if (Array.isArray(stored)) saved = stored.filter(id => properties.some(p => p.id === id)); } catch {}
  const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
  function images() {
    document.querySelectorAll('img:not([data-fallback])').forEach(img => {
      img.dataset.fallback = 'ready';
      const fallback = () => { img.src = 'assets/architecture.svg'; img.alt = 'Ilustração de arquitetura — fotografia indisponível'; };
      img.addEventListener('error', fallback, {once:true});
      if (img.complete && !img.naturalWidth) fallback();
    });
  }
  function notify(message) {
    $('#notice').textContent = message; $('#notice').hidden = false;
    clearTimeout(timer); timer = setTimeout(() => { $('#notice').hidden = true; }, 4500);
  }
  function render() {
    const list = filterProperties({location:$('#location').value, type:$('#type').value, price:$('#price').value, sort:$('#sort').value, favorites:onlyFavorites ? saved : null});
    $('#favorite-count').textContent = saved.length;
    $('#favorites').setAttribute('aria-pressed', String(onlyFavorites));
    $('#collection-title').innerHTML = onlyFavorites ? 'Os seus <em>lugares favoritos.</em>' : 'Um lugar para <em>chamar seu.</em>';
    $('#results').textContent = `${list.length} ${list.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}${onlyFavorites ? ' nos favoritos' : ''}`;
    $('#empty').hidden = list.length > 0;
    $('#empty-copy').textContent = onlyFavorites ? 'Guarde imóveis com o botão de coração. Pode também limpar os filtros para rever os seus favoritos.' : 'Experimente outra localização ou alargue o orçamento.';
    $('#properties').innerHTML = list.map(p => `<article class="card"><div class="card-media"><a href="?imovel=${p.id}" data-detail="${p.id}" aria-label="Ver ${p.title}"><img src="${photo(p.photo)}" alt="Interior do imóvel em ${p.neighborhood}" width="900" height="720" loading="lazy"></a><span class="tag">${p.tag}</span><button class="heart" data-save="${p.id}" aria-label="${saved.includes(p.id) ? 'Remover dos' : 'Guardar nos'} favoritos: ${p.title}" aria-pressed="${saved.includes(p.id)}">${saved.includes(p.id) ? '♥' : '♡'}</button></div><p class="card-location">${p.neighborhood} · ${p.location}</p><h3><a href="?imovel=${p.id}" data-detail="${p.id}">${p.title}</a></h3><div class="specs"><span>${p.type}</span><span>${p.area} m²</span><span>${p.baths} casas de banho</span></div><div class="card-bottom"><strong>${money(p.price)}</strong><a href="?imovel=${p.id}" data-detail="${p.id}">Descobrir ↗</a></div></article>`).join('');
    images();
  }
  function reset() { $('#search').reset(); $('#sort').value = 'selection'; onlyFavorites = false; render(); }
  $('#search').addEventListener('submit', e => { e.preventDefault(); render(); $('#imoveis').scrollIntoView(); });
  ['location','type','price','sort'].forEach(id => $('#'+id).addEventListener('change', render));
  $('#clear').addEventListener('click', reset); $('#reset-empty').addEventListener('click', reset);
  $('#favorites').addEventListener('click', () => { onlyFavorites = !onlyFavorites; render(); $('#imoveis').scrollIntoView(); });
  document.addEventListener('click', e => {
    const save = e.target.closest('[data-save]');
    if (save) {
      const id = save.dataset.save;
      saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
      let message = saved.includes(id) ? 'Imóvel guardado nos favoritos.' : 'Imóvel removido dos favoritos.';
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch { message += ' O armazenamento está indisponível; a seleção mantém-se nesta sessão.'; }
      render();
      (document.querySelector(`[data-save="${id}"]`) || $('#favorites')).focus(); notify(message);
    }
    const link = e.target.closest('[data-detail]');
    if (link) { e.preventDefault(); returnFocus = link; openDetail(link.dataset.detail); }
  });
  const dialog = $('#detail');
  function gallery() {
    const ids = [active.photo, ...properties.filter(p => p.id !== active.id).slice(0,2).map(p => p.photo)];
    $('#gallery-photo').src = photo(ids[photoIndex]);
    $('#gallery-photo').alt = photoIndex === 0 ? `Interior do imóvel: ${active.title}` : 'Imagem de ambiente ilustrativa; não representa outra divisão deste imóvel';
    $('#gallery-status').textContent = `${photoIndex + 1} / 3${photoIndex ? ' · Ambiente ilustrativo' : ' · Fotografia principal'}`;
    $('#gallery-photo').removeAttribute('data-fallback'); images();
  }
  function openDetail(id) {
    active = properties.find(p => p.id === id); photoIndex = 0;
    if (!active) {
      $('#detail-content').innerHTML = '<h2 id="detail-title">Imóvel não encontrado</h2><p>Esta referência não faz parte da coleção. Feche esta janela e explore os imóveis disponíveis.</p>';
    } else {
      const p = active;
      $('#detail-content').innerHTML = `<img id="gallery-photo" class="gallery-img" width="1200" height="700" alt=""><div class="gallery-controls"><button id="previous" aria-label="Fotografia anterior">← Anterior</button><span id="gallery-status" aria-live="polite"></span><button id="next" aria-label="Fotografia seguinte">Seguinte →</button></div><div class="detail-columns"><section><p class="eyebrow">${p.neighborhood} · ${p.location} / REF. LM0${properties.indexOf(p)+1}</p><h2 id="detail-title">${p.title}</h2><p class="detail-price">${money(p.price)}</p><div class="detail-specs"><span>${p.type} · ${p.area} m²</span><span>${p.baths} casas de banho</span><span>Energia ${p.energy}</span></div><p>${p.description}</p><h3>O lugar à sua volta</h3><div class="map" role="img" aria-label="Mapa ilustrativo do bairro ${p.neighborhood}, em ${p.location}; sem localização exata"><span>⌖ ${p.neighborhood}</span></div><p class="small">Mapa ilustrativo. A localização exata não é apresentada nesta demo.</p></section><section class="visit"><p class="eyebrow">IMAGINE-SE AQUI</p><h3>Venha conhecer.</h3><p>Experimente um pedido de visita. Os dados ficam apenas nesta janela e não são enviados.</p><form id="visit-form"><label>Nome<input name="name" autocomplete="name" required maxlength="100"></label><label>Email<input name="email" type="email" autocomplete="email" required maxlength="160"></label><label>Dia preferido<input id="visit-date" name="date" type="date" required></label><label>Horário<select name="time"><option>Manhã · 10h–13h</option><option>Tarde · 14h–18h</option></select></label><label class="check"><input type="checkbox" required>Compreendo que este é um pedido de demonstração, sem marcação real.</label><button class="solid" type="submit">Experimentar pedido de visita ↗</button><p id="visit-status" role="status" tabindex="-1"></p></form></section></div>`;
      gallery();
      $('#previous').addEventListener('click', () => { photoIndex = (photoIndex+2)%3; gallery(); });
      $('#next').addEventListener('click', () => { photoIndex = (photoIndex+1)%3; gallery(); });
      const date = new Date(); date.setMinutes(date.getMinutes()-date.getTimezoneOffset());
      $('#visit-date').min = date.toISOString().slice(0,10);
      $('#visit-form').addEventListener('submit', e => {
        e.preventDefault();
        if ($('#visit-date').value < $('#visit-date').min) { $('#visit-date').setCustomValidity('Escolha hoje ou uma data futura.'); $('#visit-date').reportValidity(); return; }
        const chosen = new Date($('#visit-date').value+'T12:00:00').toLocaleDateString('pt-PT');
        e.target.reset(); $('#visit-status').textContent = `Pedido demonstrativo concluído para ${chosen}. Não foi enviada qualquer mensagem nem marcada uma visita.`; $('#visit-status').focus();
      });
      $('#visit-date').addEventListener('input', e => e.target.setCustomValidity(''));
    }
    const url = new URL(location.href); url.searchParams.set('imovel', id); history.replaceState(null, '', url);
    if (!dialog.open) dialog.showModal();
  }
  $('#close-detail').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { const url = new URL(location.href); url.searchParams.delete('imovel'); history.replaceState(null, '', url); $('#detail-content').replaceChildren(); if (returnFocus?.isConnected) returnFocus.focus(); else $('#favorites').focus(); });
  render();
  const initial = new URLSearchParams(location.search).get('imovel'); if (initial) openDetail(initial);
})();
