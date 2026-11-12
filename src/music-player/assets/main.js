(() => {
  'use strict';
  const tracks = [
    { id: 'luz', title: 'Luz suspensa', artist: 'Clara Vale', album: 'Entre o céu e o chão', art: 'noite', duration: 214, tone: 174.61 },
    { id: 'mare', title: 'Maré baixa', artist: 'Maré Interior', album: 'Água de dentro', art: 'mar', duration: 198, tone: 196 },
    { id: 'devagar', title: 'Devagar', artist: 'Tomás Lira', album: 'Dias de sol', art: 'sol', duration: 183, tone: 164.81 },
    { id: 'orbita', title: 'Em órbita', artist: 'Clara Vale', album: 'Entre o céu e o chão', art: 'noite', duration: 236, tone: 220 },
    { id: 'azul', title: 'Tudo o que é azul', artist: 'Maré Interior', album: 'Água de dentro', art: 'mar', duration: 207, tone: 146.83 },
    { id: 'casa', title: 'Voltar a casa', artist: 'Tomás Lira', album: 'Dias de sol', art: 'sol', duration: 192, tone: 130.81 }
  ];
  const playlists = {
    noite: { title: 'Depois das horas', description: 'Eletrónica suave para noites sem pressa.', ids: tracks.map(t => t.id) },
    mar: { title: 'De frente para o mar', description: 'Abre as janelas. Deixa entrar o horizonte.', ids: ['mare', 'azul', 'luz'] },
    calma: { title: 'Devagar, devagar', description: 'Um pequeno intervalo no ruído dos dias.', ids: ['devagar', 'casa', 'mare'] }
  };
  const $ = id => document.getElementById(id);
  const find = id => tracks.find(t => t.id === id);
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let favorites = new Set();
  try { const saved = JSON.parse(localStorage.getItem('onda-favorites') || '[]'); if (Array.isArray(saved)) favorites = new Set(saved.filter(id => find(id))); } catch { /* Storage is optional. */ }
  let queue = tracks.map(t => t.id), current = tracks[0], position = 0, playing = false, view = 'home', selection = '', visible = tracks;
  let audioContext, gain, voices = [], previousVolume = 35, lastTick = 0, playRequest = 0;
  function announce(message) { $('announcement').textContent = message; }
  function stopSound() { voices.forEach(voice => { try { voice.stop(); } catch { /* Already stopped. */ } }); voices = []; }
  async function startSound() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('unsupported');
    audioContext ||= new Audio();
    await audioContext.resume();
    stopSound();
    gain ||= audioContext.createGain();
    gain.disconnect(); gain.connect(audioContext.destination);
    gain.gain.value = Number($('volume').value) / 100 * 0.055;
    [1, 1.5, 2.002].forEach((ratio, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine'; oscillator.frequency.value = current.tone * ratio;
      oscillator.detune.value = index * 2;
      oscillator.connect(gain); oscillator.start(); voices.push(oscillator);
    });
  }
  function updatePlayer() {
    $('now-title').textContent = current.title; $('now-artist').textContent = current.artist;
    $('now-cover').src = `assets/${current.art}.svg`;
    $('toggle').textContent = playing ? 'Ⅱ' : '▶'; $('toggle').setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
    $('now-favorite').textContent = favorites.has(current.id) ? '♥' : '♡';
    $('now-favorite').setAttribute('aria-pressed', String(favorites.has(current.id)));
    $('now-favorite').setAttribute('aria-label', `${favorites.has(current.id) ? 'Remover' : 'Adicionar'} faixa atual ${favorites.has(current.id) ? 'dos' : 'aos'} favoritos`);
    $('progress').max = current.duration; $('progress').value = Math.floor(position);
    $('progress').setAttribute('aria-valuetext', `${time(position)} de ${time(current.duration)}`);
    $('elapsed').textContent = time(position); $('duration').textContent = time(current.duration);
    $('favorite-count').textContent = favorites.size;
  }
  async function setPlaying(value) {
    const request = ++playRequest;
    playing = value;
    if (value) {
      try { await startSound(); if (request !== playRequest) { if (!playing) stopSound(); return; } lastTick = performance.now(); }
      catch { playing = false; stopSound(); announce('Não foi possível iniciar o som neste navegador. Experimente novamente num navegador com suporte de áudio.'); }
    } else stopSound();
    updatePlayer(); renderTracks();
  }
  function selectTrack(id, play = true) {
    if (!find(id)) return;
    current = find(id); position = 0;
    if (!queue.includes(id)) queue.push(id);
    updatePlayer(); render();
    if (play) void setPlaying(true);
    announce(`Selecionada: ${current.title}, ${current.artist}.`);
  }
  function step(direction) {
    if (!queue.length) { void setPlaying(false); announce('A fila está vazia. Escolha uma faixa na biblioteca.'); return; }
    const index = queue.indexOf(current.id);
    selectTrack(queue[(index + direction + queue.length) % queue.length], playing);
  }
  function favorite(id) {
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    try { localStorage.setItem('onda-favorites', JSON.stringify([...favorites])); } catch { /* Session still works without storage. */ }
    announce(favorites.has(id) ? 'Faixa adicionada aos favoritos.' : 'Faixa removida dos favoritos.');
    updatePlayer(); renderTracks();
  }
  function renderTracks() {
    const focused = document.activeElement;
    const focusKey = focused?.dataset?.focus;
    if (view === 'favorites') visible = tracks.filter(t => favorites.has(t.id));
    else if (view === 'queue') visible = queue.map(find);
    else if (view === 'playlist') visible = playlists[selection].ids.map(find);
    else if (view === 'album') visible = tracks.filter(t => t.album === selection);
    else if (view === 'search') { const query = normalize($('search').value.trim()); visible = tracks.filter(t => normalize(`${t.title} ${t.artist} ${t.album}`).includes(query)); }
    else visible = tracks;
    $('tracks').innerHTML = visible.map((t, i) => `<li class="track ${t.id === current.id ? 'active' : ''}"><span class="track-number">${t.id === current.id && playing ? '♫' : String(i + 1).padStart(2, '0')}</span><button class="track-main" data-track="${t.id}" data-focus="play-${t.id}" aria-label="Reproduzir ${t.title}, ${t.artist}"><img src="assets/${t.art}.svg" alt="" width="37" height="37"><span><strong class="track-name">${t.title}</strong><small>${t.artist}</small></span></button><button class="album-link" data-album="${t.id}" data-focus="album-${t.id}" aria-label="Abrir álbum ${t.album}">${t.album}</button><span class="track-time">${time(t.duration)}</span><span class="track-actions"><button class="icon" data-favorite="${t.id}" data-focus="favorite-${t.id}" aria-label="${favorites.has(t.id) ? 'Remover dos' : 'Adicionar aos'} favoritos: ${t.title}" aria-pressed="${favorites.has(t.id)}">${favorites.has(t.id) ? '♥' : '♡'}</button><button class="icon" data-${view === 'queue' ? 'remove' : 'add'}="${t.id}" data-focus="queue-${t.id}" aria-label="${view === 'queue' ? 'Remover da' : 'Adicionar à'} fila: ${t.title}">${view === 'queue' ? '×' : '+'}</button></span></li>`).join('');
    $('empty').hidden = visible.length > 0; $('play-list').hidden = !visible.length;
    $('result-count').textContent = `${visible.length} ${visible.length === 1 ? 'faixa' : 'faixas'}${view === 'queue' ? ' na fila' : ''}`;
    $('empty-title').textContent = view === 'search' ? 'Não encontrámos essa frequência.' : view === 'favorites' ? 'As tuas favoritas começam aqui.' : 'A fila está em silêncio.';
    $('empty-copy').textContent = view === 'search' ? 'Experimenta outro nome de faixa, artista ou álbum.' : view === 'favorites' ? 'Toca no coração de uma faixa para a guardares neste dispositivo.' : 'Adiciona faixas com o botão + na biblioteca.';
    if (focusKey) {
      const replacement = [...$('tracks').querySelectorAll('[data-focus]')].find(button => button.dataset.focus === focusKey);
      if (replacement) replacement.focus(); else if (focused && !focused.isConnected) { const fallback = $('tracks').querySelector('button') || $('reset'); fallback.focus(); }
    }
    $('mini-queue').innerHTML = queue.length ? queue.slice(0, 4).map(id => { const t = find(id); return `<button class="mini-track" data-track="${id}" aria-label="Reproduzir ${t.title}"><img src="assets/${t.art}.svg" alt=""><span><strong>${t.title}</strong><small>${t.artist}</small></span></button>`; }).join('') : '<p class="muted">Sem faixas na fila. Adiciona uma descoberta.</p>';
  }
  function render() {
    $('home-view').hidden = view !== 'home'; $('search-box').hidden = view !== 'search'; $('album-detail').hidden = view !== 'album';
    const titles = { home: 'Na tua frequência', search: 'Encontra o teu próximo som.', favorites: 'As tuas favoritas', queue: 'Fila de reprodução', playlist: playlists[selection]?.title, album: selection };
    $('list-title').textContent = titles[view];
    $('list-kicker').textContent = view === 'playlist' ? 'PLAYLIST / ONDA SELECTS' : view === 'album' ? 'ÁLBUM' : 'A TUA BIBLIOTECA';
    $('list-description').textContent = view === 'home' ? 'Pequenas descobertas que merecem ficar.' : view === 'playlist' ? playlists[selection].description : view === 'queue' ? 'A tua sequência. Remove faixas ou escolhe o que toca a seguir.' : view === 'favorites' ? 'Os sons a que vais querer voltar.' : 'Música para descobrires ao teu ritmo.';
    if (view === 'album') { const t = tracks.find(t => t.album === selection); $('album-detail').innerHTML = `<img src="assets/${t.art}.svg" alt="Capa de ${t.album}"><div><p>ONDA RECORDS · 2026</p><h3>${t.album}</h3><p>${t.artist} · Álbum demonstrativo</p></div>`; }
    document.querySelectorAll('nav [data-view]').forEach(button => { if (button.dataset.view === view) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    renderTracks();
  }
  function navigate(nextView, value = '') { view = nextView; selection = value; render(); if (view === 'search') $('search').focus(); else { $('list-title').setAttribute('tabindex', '-1'); $('list-title').focus(); } }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.view) navigate(button.dataset.view);
    if (button.dataset.playlist) navigate('playlist', button.dataset.playlist);
    if (button.dataset.track) selectTrack(button.dataset.track);
    if (button.dataset.album) navigate('album', find(button.dataset.album).album);
    if (button.dataset.favorite) favorite(button.dataset.favorite);
    if (button.dataset.add) { if (!queue.includes(button.dataset.add)) { queue.push(button.dataset.add); announce('Faixa adicionada à fila.'); } else announce('Esta faixa já está na fila.'); renderTracks(); }
    if (button.dataset.remove) { queue = queue.filter(id => id !== button.dataset.remove); renderTracks(); announce('Faixa removida da fila.'); }
  });
  $('search').addEventListener('input', renderTracks);
  $('reset').addEventListener('click', () => { $('search').value = ''; navigate('home'); });
  $('toggle').addEventListener('click', () => void setPlaying(!playing));
  $('previous').addEventListener('click', () => { if (position > 3) { position = 0; updatePlayer(); } else step(-1); });
  $('next').addEventListener('click', () => step(1));
  $('now-favorite').addEventListener('click', () => favorite(current.id));
  $('hero-play').addEventListener('click', () => { queue = [...playlists.noite.ids]; selectTrack(queue[0]); });
  $('play-list').addEventListener('click', () => { if (visible.length) { queue = visible.map(t => t.id); selectTrack(queue[0]); } });
  $('progress').addEventListener('input', event => { position = Number(event.target.value); lastTick = performance.now(); updatePlayer(); });
  function setVolume(value) { $('volume').value = value; if (gain && audioContext) gain.gain.setTargetAtTime(value / 100 * 0.055, audioContext.currentTime, 0.05); $('mute').setAttribute('aria-pressed', String(Number(value) === 0)); $('mute').setAttribute('aria-label', Number(value) === 0 ? 'Restaurar volume' : 'Silenciar'); }
  $('volume').addEventListener('input', event => setVolume(Number(event.target.value)));
  $('mute').addEventListener('click', () => { if (Number($('volume').value)) { previousVolume = Number($('volume').value); setVolume(0); } else setVolume(previousVolume || 35); });
  setInterval(() => { if (!playing) return; const now = performance.now(); position += (now - lastTick) / 1000; lastTick = now; if (position >= current.duration) step(1); else updatePlayer(); }, 250);
  window.addEventListener('pagehide', () => { playing = false; stopSound(); });
  render(); updatePlayer();
})();
