(() => {
  const people = [
    { name: 'Inês Matos', handle: '@inesmatos', role: 'Designer & ilustradora', initials: 'IM', color: '#b88873' },
    { name: 'Tomás Neves', handle: '@tomasneves', role: 'Fotógrafo, Lisboa', initials: 'TN', color: '#718c7b' },
    { name: 'Beatriz Costa', handle: '@beatrizcosta', role: 'Criativa por natureza', initials: 'BC', color: '#bd9c6f' }
  ];
  const initialPosts = [
    { id: 1, person: 0, time: 'há 2 horas', text: 'Há qualquer coisa de especial em abrandar e reparar nos pequenos detalhes. Hoje trouxe um bocadinho do meu cantinho favorito. 🌿\n\nO que vos tem inspirado ultimamente? #vidacriativa', art: 'garden', likes: 128, comments: [{ name: 'Beatriz Costa', text: 'Que cores bonitas! A natureza também me inspira muito.' }, { name: 'Tomás Neves', text: 'Adoro esta energia. 🌿' }] },
    { id: 2, person: 1, time: 'há 5 horas', text: 'Uma manhã sem pressa, café quente e ideias novas na mesa. Às vezes é tudo o que precisamos para começar. ☕\n\nBom dia, comunidade!', art: 'studio', likes: 86, comments: [{ name: 'Inês Matos', text: 'As melhores manhãs são assim.' }] },
    { id: 3, person: 2, time: 'ontem', text: 'Lembrete para hoje: não precisas de ter tudo resolvido para dar o próximo passo. Vamos criando pelo caminho. ✨', likes: 54, comments: [] }
  ];
  let state = { posts: initialPosts, liked: [], saved: [], following: [], filter: 'recent', view: 'feed', query: '', openComments: [] };
  try { const saved = JSON.parse(localStorage.getItem('entrelinhas-demo')); if (saved && Array.isArray(saved.posts) && Array.isArray(saved.liked) && Array.isArray(saved.saved) && Array.isArray(saved.following)) state = { ...state, ...saved, view: 'feed', query: '', openComments: [] }; } catch (_) { /* A demo continua disponível durante a sessão. */ }
  const content = document.querySelector('#content');
  const search = document.querySelector('#search');
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const norm = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const personFor = post => post.person === 'me' ? { name: 'Maria Correia', handle: '@mariacorreia', initials: 'MC', color: '#c78e74' } : people[post.person];
  const avatar = person => `<span class="avatar" style="background:${person.color}" aria-hidden="true">${person.initials}</span>`;
  const persist = () => { try { localStorage.setItem('entrelinhas-demo', JSON.stringify({ posts: state.posts, liked: state.liked, saved: state.saved, following: state.following })); } catch (_) { /* armazenamento opcional */ } };
  const toast = message => { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2500); };
  const header = (overline, title, subtitle) => `<div class="page-header"><div><p class="eyebrow">${overline}</p><h1>${title}</h1><p>${subtitle}</p></div><span class="date">UM ESPAÇO PARA TI ✳</span></div>`;
  const composer = () => `<form class="composer" id="composer"><div class="composer-top">${avatar(personFor({person:'me'}))}<textarea id="post-text" aria-label="Escreve uma publicação" placeholder="O que tens em mente, Maria?" maxlength="500" required></textarea></div><div class="composer-bottom"><span class="composer-hint">✎ &nbsp; Partilha algo com a comunidade</span><button class="primary" type="submit">Publicar ↗</button></div></form>`;
  const postMarkup = post => {
    const person = personFor(post); if (!person) return '';
    const liked = state.liked.includes(post.id), saved = state.saved.includes(post.id), open = state.openComments.includes(post.id);
    const text = esc(post.text).replace(/(#\w+)/g, '<span class="tag">$1</span>').replace(/\n/g, '<br>');
    return `<article class="post"><div class="post-head">${avatar(person)}<div class="post-person"><strong>${esc(person.name)}</strong><small>${esc(person.handle)} · ${esc(post.time)}</small></div><span class="post-more" aria-hidden="true">···</span></div><p class="post-text">${text}</p>${post.art ? `<div class="art ${post.art === 'studio' ? 'studio' : ''}" role="img" aria-label="Ilustração abstrata em tons naturais"><div class="art-inner"><span class="sun"></span><span class="shape"></span></div><span class="art-caption">${post.art === 'studio' ? 'dias com calma' : 'encontrar beleza no simples'}</span></div>` : ''}<div class="post-stats"><span>${post.likes + (liked ? 1 : 0)} gostos</span><span>${post.comments.length} ${post.comments.length === 1 ? 'comentário' : 'comentários'}</span></div><div class="post-actions"><button type="button" data-action="like" data-id="${post.id}" class="${liked ? 'selected' : ''}" aria-pressed="${liked}"><span aria-hidden="true">${liked ? '♥' : '♡'}</span> Gosto</button><button type="button" data-action="comments" data-id="${post.id}" aria-expanded="${open}"><span aria-hidden="true">♧</span> Comentar</button><button type="button" data-action="save" data-id="${post.id}" class="save ${saved ? 'selected' : ''}" aria-pressed="${saved}"><span aria-hidden="true">${saved ? '◆' : '◇'}</span> ${saved ? 'Guardado' : 'Guardar'}</button></div>${open ? `<div class="comments">${post.comments.map(c => `<p class="comment"><strong>${esc(c.name)}</strong> ${esc(c.text)}</p>`).join('') || '<p class="muted">Ainda sem comentários. Começa a conversa!</p>'}<form class="comment-form" data-comment="${post.id}"><input name="comment" aria-label="Escreve um comentário" placeholder="Escreve um comentário..." maxlength="300" required><button class="primary">Enviar</button></form></div>` : ''}</article>`;
  };
  const empty = (title, message) => `<div class="panel empty"><strong>${title}</strong>${message}</div>`;
  function suggestions() { document.querySelector('#suggestions').innerHTML = people.map((p, i) => `<div class="suggestion">${avatar(p)}<div><strong>${p.name}</strong><small>${p.role}</small></div><button class="follow ${state.following.includes(i) ? 'following' : ''}" data-follow="${i}" aria-pressed="${state.following.includes(i)}">${state.following.includes(i) ? 'A seguir' : 'Seguir'}</button></div>`).join(''); }
  function render() {
    document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === state.view));
    suggestions();
    let posts = [...state.posts];
    if (state.view === 'feed') {
      if (state.filter === 'following') posts = posts.filter(p => state.following.includes(p.person));
      if (state.filter === 'popular') posts.sort((a,b) => b.likes - a.likes);
      content.innerHTML = header('OLÁ, MARIA ✳', 'O teu espaço', 'Ideias, pessoas e histórias para o teu dia.') + composer() + `<div class="feed-heading"><h2>O teu feed</h2><div class="filters" aria-label="Filtrar feed"><button class="filter ${state.filter === 'recent' ? 'active' : ''}" data-filter="recent" aria-pressed="${state.filter === 'recent'}">Recentes</button><button class="filter ${state.filter === 'following' ? 'active' : ''}" data-filter="following" aria-pressed="${state.filter === 'following'}">A seguir</button><button class="filter ${state.filter === 'popular' ? 'active' : ''}" data-filter="popular" aria-pressed="${state.filter === 'popular'}">Populares</button></div></div>` + (posts.map(postMarkup).join('') || empty('Ainda está tranquilo por aqui.', 'Segue pessoas da comunidade para veres as suas publicações.'));
    } else if (state.view === 'saved') {
      posts = posts.filter(p => state.saved.includes(p.id)); content.innerHTML = header('A TUA COLEÇÃO', 'Guardados', 'As ideias às quais queres voltar.') + (posts.map(postMarkup).join('') || empty('Ainda não guardaste nada.', 'Guarda as tuas publicações favoritas para as encontrares aqui.'));
    } else if (state.view === 'profile') {
      posts = posts.filter(p => p.person === 'me'); content.innerHTML = header('O TEU ESPAÇO', 'Perfil', 'Um pouco sobre ti e as tuas partilhas.') + `<section class="panel"><div class="profile-cover"></div><div class="profile-info">${avatar(personFor({person:'me'}))}<h2>Maria Correia</h2><p>@mariacorreia · Lisboa, Portugal</p><p>Curiosa por natureza. À procura de boas histórias, lugares bonitos e café demorado. ☕</p><div class="profile-stats"><span><b>${posts.length}</b> publicações</span><span><b>${state.following.length}</b> a seguir</span></div></div></section><div class="feed-heading" style="margin-top:28px"><h2>As tuas publicações</h2></div>` + (posts.map(postMarkup).join('') || empty('A tua história começa aqui.', 'Cria uma publicação no feed para a veres no teu perfil.'));
    } else if (state.view === 'notifications') {
      content.innerHTML = header('NOVIDADES PARA TI', 'Notificações', 'As últimas novidades da tua comunidade.') + `<section class="panel list-panel" aria-label="Notificações"><div class="notice">${avatar(people[0])}<div><strong>Inês Matos</strong> começou a seguir-te.<small>Há 2 horas</small></div></div><div class="notice">${avatar(people[1])}<div><strong>Tomás Neves</strong> gostou de uma publicação tua.<small>Ontem</small></div></div><div class="notice">${avatar(people[2])}<div><strong>Beatriz Costa</strong> partilhou uma nova ideia.<small>Há 2 dias</small></div></div></section>`;
    } else {
      const q = norm(state.query.trim()); posts = posts.filter(p => !q || norm(p.text + ' ' + personFor(p).name + ' ' + personFor(p).handle).includes(q));
      const matchingPeople = people.map((p,i) => ({p,i})).filter(({p}) => !q || norm(p.name + ' ' + p.handle + ' ' + p.role).includes(q));
      content.innerHTML = header('ENCONTRA A TUA INSPIRAÇÃO', 'Explorar', state.query ? `Resultados para “${esc(state.query)}”` : 'Descobre novas pessoas e ideias.') + (matchingPeople.length ? `<section class="panel list-panel"><h2 class="feed-heading">Pessoas</h2>${matchingPeople.map(({p,i}) => `<div class="suggestion">${avatar(p)}<div><strong>${p.name}</strong><small>${p.role}</small></div><button class="follow ${state.following.includes(i) ? 'following' : ''}" data-follow="${i}" aria-pressed="${state.following.includes(i)}">${state.following.includes(i) ? 'A seguir' : 'Seguir'}</button></div>`).join('')}</section>` : '') + (posts.length ? `<div class="feed-heading" style="margin-top:28px"><h2>Publicações</h2></div>${posts.map(postMarkup).join('')}` : '') + (!posts.length && !matchingPeople.length ? empty('Não encontrámos resultados.', 'Experimenta procurar por outro nome ou tema.') : '');
    }
  }
  document.addEventListener('click', event => {
    const view = event.target.closest('[data-view]'); if (view) { event.preventDefault(); state.view = view.dataset.view; state.query = ''; search.value = ''; render(); window.scrollTo(0,0); return; }
    if (event.target.closest('[data-compose]')) { state.view = 'feed'; render(); document.querySelector('#post-text').focus(); return; }
    if (event.target.closest('[data-topic]')) { state.view = 'explore'; state.query = 'vidacriativa'; search.value = state.query; render(); window.scrollTo(0,0); return; }
    const filter = event.target.closest('[data-filter]'); if (filter) { state.filter = filter.dataset.filter; render(); return; }
    const follow = event.target.closest('[data-follow]'); if (follow) { const id = Number(follow.dataset.follow); state.following = state.following.includes(id) ? state.following.filter(x => x !== id) : [...state.following, id]; persist(); render(); toast(state.following.includes(id) ? `Estás a seguir ${people[id].name}.` : `Deixaste de seguir ${people[id].name}.`); return; }
    const action = event.target.closest('[data-action]'); if (!action) return; const id = Number(action.dataset.id); const key = action.dataset.action === 'like' ? 'liked' : action.dataset.action === 'save' ? 'saved' : 'openComments'; state[key] = state[key].includes(id) ? state[key].filter(x => x !== id) : [...state[key], id]; persist(); render();
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'composer') { event.preventDefault(); const input = document.querySelector('#post-text'); const text = input.value.trim(); if (!text) { toast('Escreve algo antes de publicar.'); input.focus(); return; } state.posts.unshift({ id: Date.now(), person: 'me', time: 'agora', text, likes: 0, comments: [] }); state.filter = 'recent'; persist(); render(); toast('Publicação partilhada!'); }
    if (event.target.matches('[data-comment]')) { event.preventDefault(); const input = event.target.elements.comment; const text = input.value.trim(); if (!text) { toast('Escreve um comentário antes de enviar.'); input.focus(); return; } const post = state.posts.find(p => p.id === Number(event.target.dataset.comment)); if (post) { post.comments.push({ name: 'Maria Correia', text }); persist(); render(); toast('Comentário adicionado.'); } }
  });
  search.addEventListener('input', () => { state.query = search.value; state.view = 'explore'; render(); });
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); } });
  render();
})();
