(() => {
  'use strict';
  const KEY = 'trilho-progresso-v1';
  const ICONS = {
    code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    palette: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="14" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="14" r="1.3" fill="currentColor"/>',
    chart: '<path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    book: '<path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    mic: '<rect x="9" y="4" width="6" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 11a6 6 0 0012 0M12 17v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    leaf: '<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  const q = (t, opts, ok) => ({ t, opts, ok });
  const L = (id, t, min, body) => ({ id, t, min, body });
  const QZ = (id, t, qs) => ({ id, t, min: 5, quiz: qs });
  const COURSES = [
    { id: 'html-css', cat: 'Programação', level: 'Iniciante', icon: 'code', color: '#c4491a', title: 'HTML e CSS do zero', teacher: 'Marta Figueiredo',
      blurb: 'Construa a sua primeira página web, semântica, acessível e adaptada a qualquer ecrã.', learn: ['Estruturar páginas com HTML semântico', 'Estilizar com CSS moderno', 'Criar layouts responsivos com Flexbox e Grid'],
      modules: [
        { t: 'Primeiros passos', lessons: [L('a', 'O que é a web?', 6, 'Um browser pede ficheiros a um servidor e mostra-os. HTML descreve a estrutura, CSS a apresentação e JavaScript o comportamento.'), L('b', 'A tua primeira página', 9, 'Um documento começa com doctype, html, head e body. Use títulos, parágrafos e listas para organizar o conteúdo.'), L('c', 'Elementos semânticos', 8, 'Elementos como header, nav, main e footer dão significado à página e ajudam leitores de ecrã a navegar.')] },
        { t: 'Estilo com CSS', lessons: [L('d', 'Seletores e cascata', 10, 'Seletores escolhem elementos; a cascata decide qual a regra que vence quando há conflito, com base na especificidade e na ordem.'), L('e', 'O modelo de caixa', 9, 'Cada elemento é uma caixa: conteúdo, padding, border e margin. Use box-sizing: border-box para contas previsíveis.'), QZ('f', 'Quiz: fundamentos de CSS', [q('Que propriedade cria espaço dentro da borda de um elemento?', ['margin', 'padding', 'gap'], 1), q('Qual o elemento mais adequado para o menu principal?', ['<div>', '<nav>', '<section>'], 1)])] },
        { t: 'Layouts responsivos', lessons: [L('g', 'Flexbox na prática', 12, 'Flexbox distribui espaço num eixo. Com display:flex, justify-content e align-items alinha os filhos facilmente.'), L('h', 'Grid e media queries', 14, 'Grid organiza linhas e colunas. Combine com media queries para adaptar o layout a telemóveis, tablets e computadores.')] }
      ] },
    { id: 'ux-design', cat: 'Design', level: 'Iniciante', icon: 'palette', color: '#7a4fb0', title: 'Fundamentos de Design de Interação', teacher: 'Rui Cardoso',
      blurb: 'Aprenda a investigar, desenhar e testar interfaces centradas nas pessoas.', learn: ['Conduzir entrevistas simples a utilizadores', 'Esboçar fluxos e wireframes', 'Testar protótipos com cinco pessoas'],
      modules: [
        { t: 'Compreender pessoas', lessons: [L('a', 'O que é UX?', 7, 'Experiência do utilizador é o conjunto de perceções de quem usa um produto, antes, durante e depois da interação.'), L('b', 'Entrevistas curtas', 11, 'Faça perguntas abertas, ouça mais do que fala e peça exemplos reais em vez de opiniões hipotéticas.')] },
        { t: 'Desenhar soluções', lessons: [L('c', 'Fluxos e wireframes', 12, 'Comece em papel. Um fluxo mostra o caminho; o wireframe mostra a estrutura de cada ecrã sem distrações visuais.'), L('d', 'Hierarquia visual', 9, 'Tamanho, contraste e espaço guiam o olhar. Se tudo é destacado, nada é destacado.'), QZ('e', 'Quiz: princípios de UX', [q('Quantas pessoas detetam a maioria dos problemas num teste rápido?', ['1', 'Cerca de 5', '100'], 1), q('Que tipo de pergunta é melhor numa entrevista?', ['Fechada (sim/não)', 'Aberta', 'Sugestiva'], 1)])] }
      ] },
    { id: 'excel-dados', cat: 'Dados', level: 'Intermédio', icon: 'chart', color: '#2f7d5b', title: 'Análise de dados com folhas de cálculo', teacher: 'Beatriz Almeida',
      blurb: 'Transforme tabelas em decisões: fórmulas, tabelas dinâmicas e gráficos claros.', learn: ['Limpar e organizar dados', 'Usar PROCV, SE e tabelas dinâmicas', 'Contar histórias com gráficos'],
      modules: [
        { t: 'Preparar os dados', lessons: [L('a', 'Estrutura de uma boa tabela', 8, 'Uma linha por registo, uma coluna por variável, cabeçalhos únicos e nenhuma célula fundida.'), L('b', 'Limpeza e validação', 10, 'Remova duplicados, uniformize formatos e use validação de dados para evitar erros de introdução.')] },
        { t: 'Fórmulas e análise', lessons: [L('c', 'SE, SOMA.SE e PROCV', 13, 'As funções condicionais permitem responder a perguntas como “quanto vendemos por região?” sem trabalho manual.'), L('d', 'Tabelas dinâmicas', 14, 'Arraste campos para linhas, colunas e valores e obtenha resumos em segundos.'), QZ('e', 'Quiz: fórmulas', [q('Que função soma apenas valores que cumprem um critério?', ['SOMA', 'SOMA.SE', 'MÉDIA'], 1), q('Uma boa tabela tem…', ['Células fundidas', 'Uma linha por registo', 'Cabeçalhos repetidos'], 1)])] }
      ] },
    { id: 'escrita-clara', cat: 'Comunicação', level: 'Iniciante', icon: 'book', color: '#b8741a', title: 'Escrita clara para o trabalho', teacher: 'Inês Valadares',
      blurb: 'E-mails, relatórios e apresentações que as pessoas leem até ao fim.', learn: ['Estruturar ideias antes de escrever', 'Cortar o que não serve o leitor', 'Rever o seu próprio texto'],
      modules: [
        { t: 'Antes de escrever', lessons: [L('a', 'Quem vai ler?', 6, 'Defina o leitor e o objetivo numa frase. Tudo o que não ajuda esse objetivo pode sair.'), L('b', 'A pirâmide invertida', 8, 'Comece pela conclusão e acrescente detalhes por ordem de importância.')] },
        { t: 'Reescrever', lessons: [L('c', 'Frases curtas, verbos fortes', 9, 'Prefira a voz ativa e evite nominalizações: “decidimos” é melhor que “foi tomada a decisão”.'), QZ('d', 'Quiz: clareza', [q('A pirâmide invertida começa por…', ['Contexto histórico', 'A conclusão', 'Agradecimentos'], 1)])] }
      ] },
    { id: 'falar-publico', cat: 'Comunicação', level: 'Intermédio', icon: 'mic', color: '#d1486b', title: 'Falar em público com confiança', teacher: 'Duarte Matos',
      blurb: 'Técnicas práticas para preparar, ensaiar e apresentar sem pânico.', learn: ['Estruturar uma apresentação', 'Gerir a ansiedade', 'Usar voz e pausas com intenção'],
      modules: [
        { t: 'Preparação', lessons: [L('a', 'Uma ideia central', 7, 'Se o público só se lembrar de uma frase, qual deve ser? Construa tudo à volta dela.'), L('b', 'Ensaiar sem decorar', 10, 'Memorize os pontos-chave, não as frases. Ensaie em voz alta e grave-se.')] },
        { t: 'No palco', lessons: [L('c', 'Respiração e voz', 8, 'Respire pelo diafragma, abrande o ritmo e use pausas para dar peso às ideias.'), QZ('d', 'Quiz: apresentação', [q('Deve decorar o texto palavra a palavra?', ['Sim', 'Não, os pontos-chave'], 1)])] }
      ] },
    { id: 'horta-urbana', cat: 'Vida prática', level: 'Iniciante', icon: 'leaf', color: '#4a8f2f', title: 'Horta urbana em varandas', teacher: 'Teresa Lopes',
      blurb: 'Cultive ervas e legumes em pouco espaço, ao ritmo das estações.', learn: ['Escolher vasos e substrato', 'Planear o calendário de sementeiras', 'Rega eficiente e compostagem'],
      modules: [
        { t: 'Começar', lessons: [L('a', 'Luz e espaço', 6, 'Observe quantas horas de sol a varanda recebe: a maioria dos legumes pede pelo menos seis.'), L('b', 'Vasos e substrato', 9, 'Garanta drenagem, use substrato leve e vasos com profundidade adequada a cada cultura.')] },
        { t: 'Cultivar', lessons: [L('c', 'Calendário de sementeiras', 10, 'Alface e espinafres no outono; tomate e manjericão na primavera. Adapte à sua região.'), QZ('d', 'Quiz: horta', [q('Quantas horas de sol pedem a maioria dos legumes?', ['2', 'Cerca de 6', '12'], 1)])] }
      ] }
  ];
  const CATS = [...new Set(COURSES.map(c => c.cat))];
  const $main = document.getElementById('conteudo');
  const $live = document.getElementById('live');
  let storageOk = true;
  let state = { done: {}, quiz: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p && typeof p.done === 'object' && typeof p.quiz === 'object') state = p; } } catch (e) { storageOk = false; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; } };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lessons = c => c.modules.flatMap(m => m.lessons);
  const isDone = (c, l) => !!state.done[c.id + '/' + l.id];
  const pct = c => { const ls = lessons(c); return Math.round(ls.filter(l => isDone(c, l)).length / ls.length * 100); };
  const mins = c => lessons(c).reduce((s, l) => s + l.min, 0);
  const course = id => COURSES.find(c => c.id === id);
  const cover = c => `style="background:linear-gradient(135deg,${c.color},${c.color}cc 60%,#f6b73c)"`;
  const icon = (c, n = 56) => `<svg viewBox="0 0 24 24" width="${n}" height="${n}" aria-hidden="true">${ICONS[c.icon]}</svg>`;
  const bar = p => `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="Progresso do curso"><span style="width:${p}%"></span></div><div class="bar-label"><span>${p}% concluído</span></div>`;
  const announce = m => { $live.textContent = ''; setTimeout(() => { $live.textContent = m; }, 30); };
  const filters = { text: '', cat: 'Todos', level: 'Todos' };

  function cardHtml(c, i) {
    const p = pct(c);
    return `<li><article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms"><div class="cover" ${cover(c)}>${icon(c)}</div><div class="card-body">
      <div class="meta"><span class="tag">${esc(c.cat)}</span>${p === 100 ? '<span class="tag done">Concluído</span>' : ''}</div>
      <h3><a href="#/curso/${c.id}">${esc(c.title)}</a></h3><p class="meta">${esc(c.teacher)} · ${esc(c.level)} · ${mins(c)} min</p>${bar(p)}</div></article></li>`;
  }

  function catalog() {
    document.title = 'Trilho | Plataforma de cursos online';
    const next = COURSES.find(c => { const p = pct(c); return p > 0 && p < 100; });
    $main.innerHTML = `<section class="hero"><div><p class="eyebrow">Aprende ao teu ritmo</p><h1>Cada aula é um passo no teu trilho.</h1><p class="lead">Cursos curtos e práticos, em português, com lições, quizzes e progresso guardado. Começa hoje, continua quando quiseres.</p><a class="btn" href="#catalogo">Explorar cursos</a></div>
      <aside class="hero-card" aria-labelledby="cont-t"><h2 id="cont-t">Continuar a aprender</h2>${next ? `<p><strong>${esc(next.title)}</strong></p>${bar(pct(next))}<p></p><a class="btn" href="#/curso/${next.id}">Retomar curso</a>` : '<p>Ainda não começaste nenhum curso. Escolhe um no catálogo e marca a tua primeira lição como concluída.</p>'}</aside></section>
      <section id="catalogo" aria-labelledby="cat-t"><h2 id="cat-t">Catálogo de cursos</h2>
      <form class="toolbar" role="search" onsubmit="return false"><div class="field"><label for="busca">Pesquisar</label><input id="busca" type="search" placeholder="Ex.: design, dados, horta…" value="${esc(filters.text)}"></div>
      <div class="field" style="flex:0 1 200px"><label for="nivel">Nível</label><select id="nivel">${['Todos', 'Iniciante', 'Intermédio'].map(n => `<option${n === filters.level ? ' selected' : ''}>${n}</option>`).join('')}</select></div></form>
      <div class="chips" role="group" aria-label="Categorias">${['Todos', ...CATS].map(k => `<button type="button" class="chip" data-cat="${esc(k)}" aria-pressed="${k === filters.cat}">${esc(k)}</button>`).join('')}</div>
      <p id="count" class="meta" role="status"></p><ul class="grid" id="lista"></ul><div id="vazio" class="empty" hidden><h3>Nenhum curso encontrado</h3><p>Experimenta outra pesquisa ou limpa os filtros.</p><button type="button" class="btn ghost" id="limpar">Limpar filtros</button></div></section>`;
    const list = document.getElementById('lista'), empty = document.getElementById('vazio'), count = document.getElementById('count');
    const render = () => {
      const t = filters.text.trim().toLowerCase();
      const r = COURSES.filter(c => (filters.cat === 'Todos' || c.cat === filters.cat) && (filters.level === 'Todos' || c.level === filters.level) && (!t || (c.title + ' ' + c.blurb + ' ' + c.cat + ' ' + c.teacher).toLowerCase().includes(t)));
      list.innerHTML = r.map(cardHtml).join('');
      empty.hidden = r.length > 0; list.hidden = !r.length;
      count.textContent = r.length === 1 ? '1 curso encontrado' : r.length + ' cursos encontrados';
    };
    document.getElementById('busca').addEventListener('input', e => { filters.text = e.target.value; render(); });
    document.getElementById('nivel').addEventListener('change', e => { filters.level = e.target.value; render(); });
    $main.querySelector('.chips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; filters.cat = b.dataset.cat; $main.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); });
    document.getElementById('limpar').addEventListener('click', () => { filters.text = ''; filters.cat = 'Todos'; filters.level = 'Todos'; catalog(); });
    render();
  }

  function outline(c, current) {
    return c.modules.map((m, mi) => {
      const open = !current || m.lessons.some(l => l.id === current);
      return `<details class="module"${open ? ' open' : ''}><summary><span>Módulo ${mi + 1}: ${esc(m.t)}</span></summary><ol>${m.lessons.map(l => `<li><a class="lesson-link" href="#/aula/${c.id}/${l.id}"${l.id === current ? ' aria-current="true"' : ''}><span class="tick${isDone(c, l) ? ' on' : ''}" aria-hidden="true">${isDone(c, l) ? '✓' : ''}</span><span>${esc(l.t)}${l.quiz ? ' (quiz)' : ''}${isDone(c, l) ? '<span class="sr-only"> — concluída</span>' : ''}</span><span class="dur">${l.min} min</span></a></li>`).join('')}</ol></details>`;
    }).join('');
  }

  function detail(c) {
    document.title = c.title + ' | Trilho';
    const first = lessons(c).find(l => !isDone(c, l)) || lessons(c)[0], p = pct(c);
    $main.innerHTML = `<p class="crumbs"><a href="#/">← Todos os cursos</a></p><div class="detail-head" ${cover(c)}><p class="eyebrow" style="color:#fff">${esc(c.cat)} · ${esc(c.level)}</p><h1>${esc(c.title)}</h1><p>${esc(c.blurb)}</p></div>
      <div class="detail"><section aria-labelledby="curr-t"><h2>O que vais aprender</h2><ul>${c.learn.map(x => `<li>${esc(x)}</li>`).join('')}</ul><h2 id="curr-t">Currículo</h2>${outline(c)}</section>
      <aside class="aside" aria-label="Resumo do curso"><p><strong>${esc(c.teacher)}</strong><br><span class="meta">Formadora/formador</span></p><p class="meta">${lessons(c).length} lições · ${mins(c)} min · Certificado fictício</p>${bar(p)}<p></p><a class="btn" href="#/aula/${c.id}/${first.id}">${p === 0 ? 'Começar curso' : p === 100 ? 'Rever curso' : 'Continuar curso'}</a></aside></div>`;
  }

  function lessonView(c, l) {
    document.title = l.t + ' · ' + c.title + ' | Trilho';
    const ls = lessons(c), i = ls.indexOf(l), prev = ls[i - 1], nxt = ls[i + 1], done = isDone(c, l);
    let body;
    if (l.quiz) {
      const last = state.quiz[c.id + '/' + l.id];
      body = `<form class="quiz" id="quiz" novalidate><p>Escolhe uma resposta em cada pergunta.</p>${l.quiz.map((qq, n) => `<fieldset><legend>${n + 1}. ${esc(qq.t)}</legend>${qq.opts.map((o, k) => `<label class="opt"><input type="radio" name="q${n}" value="${k}"> <span>${esc(o)}</span></label>`).join('')}<p class="feedback" id="fb${n}"></p></fieldset>`).join('')}<p class="error-msg" id="qerr" role="alert"></p><button class="btn" type="submit">Verificar respostas</button></form><div id="qres" aria-live="polite">${last != null ? `<p class="result">Última tentativa: ${last}/${l.quiz.length}.</p>` : ''}</div>`;
    } else {
      body = `<div class="video" ${cover(c)} role="img" aria-label="Vídeo ilustrativo da lição"><div>${icon(c, 48)}<br><strong>Vídeo demonstrativo</strong><br><span>${l.min} min · sem ficheiro de vídeo nesta demo</span></div></div><p>${esc(l.body)}</p>`;
    }
    $main.innerHTML = `<p class="crumbs"><a href="#/curso/${c.id}">← ${esc(c.title)}</a></p><div class="classroom"><nav class="sidebar" aria-label="Módulos do curso"><h2>Conteúdo</h2>${bar(pct(c))}<p></p>${outline(c, l.id)}</nav>
      <article class="stage"><p class="eyebrow">Lição ${i + 1} de ${ls.length}</p><h1 id="lt" tabindex="-1">${esc(l.t)}</h1>${body}
      <div class="lesson-actions">${prev ? `<a class="btn ghost" href="#/aula/${c.id}/${prev.id}">← Anterior</a>` : ''}${l.quiz ? '' : `<button type="button" class="btn${done ? ' ghost' : ''}" id="toggle" aria-pressed="${done}">${done ? '✓ Concluída (desfazer)' : 'Marcar como concluída'}</button>`}${nxt ? `<a class="btn ghost" href="#/aula/${c.id}/${nxt.id}">Seguinte →</a>` : `<a class="btn ghost" href="#/curso/${c.id}">Fim do curso</a>`}</div></article></div>`;
    const t = document.getElementById('toggle');
    if (t) t.addEventListener('click', () => { const k = c.id + '/' + l.id; if (isDone(c, l)) delete state.done[k]; else state.done[k] = 1; save(); lessonView(c, l); document.getElementById('toggle').focus(); announce(isDone(c, l) ? 'Lição marcada como concluída. Progresso: ' + pct(c) + '%' : 'Lição desmarcada.'); });
    const f = document.getElementById('quiz');
    if (f) f.addEventListener('submit', e => {
      e.preventDefault();
      const missing = l.quiz.findIndex((_, n) => !f.querySelector(`input[name=q${n}]:checked`));
      const err = document.getElementById('qerr');
      if (missing >= 0) { err.textContent = 'Responde a todas as perguntas (falta a pergunta ' + (missing + 1) + ').'; f.querySelector(`input[name=q${missing}]`).focus(); return; }
      err.textContent = '';
      let score = 0;
      l.quiz.forEach((qq, n) => {
        const val = +f.querySelector(`input[name=q${n}]:checked`).value, ok = val === qq.ok; if (ok) score++;
        f.querySelectorAll(`input[name=q${n}]`).forEach(inp => { const row = inp.closest('.opt'); row.classList.toggle('right', +inp.value === qq.ok); row.classList.toggle('wrong', inp.checked && !ok); });
        document.getElementById('fb' + n).textContent = ok ? 'Correto!' : 'Resposta certa: ' + qq.opts[qq.ok];
      });
      state.quiz[c.id + '/' + l.id] = score;
      if (score === l.quiz.length) state.done[c.id + '/' + l.id] = 1;
      save();
      document.getElementById('qres').innerHTML = `<p class="result"><strong>${score}/${l.quiz.length}</strong> — ${score === l.quiz.length ? 'Excelente! Quiz concluído.' : 'Revê as respostas e tenta outra vez.'}</p>`;
      $main.querySelector('.sidebar').querySelectorAll('details').forEach(d => d.remove());
      $main.querySelector('.sidebar').insertAdjacentHTML('beforeend', outline(c, l.id));
      announce('Quiz corrigido: ' + score + ' de ' + l.quiz.length);
    });
    return document.getElementById('lt');
  }

  function progress() {
    document.title = 'O meu progresso | Trilho';
    const all = COURSES.flatMap(c => lessons(c).map(l => [c, l])), n = all.filter(([c, l]) => isDone(c, l)).length;
    const started = COURSES.filter(c => pct(c) > 0);
    $main.innerHTML = `<h1 style="margin-top:32px">O meu progresso</h1>${storageOk ? '' : '<p class="notice">Não foi possível guardar dados neste navegador; o progresso perde-se ao fechar a página.</p>'}
      <div class="stats"><div class="stat"><strong>${n}</strong>lições concluídas</div><div class="stat"><strong>${started.length}</strong>cursos iniciados</div><div class="stat"><strong>${COURSES.filter(c => pct(c) === 100).length}</strong>cursos terminados</div></div>
      ${started.length ? `<ul class="grid">${started.map(cardHtml).join('')}</ul>` : '<div class="empty"><h2>Ainda sem progresso</h2><p>Marca a tua primeira lição como concluída para veres o teu avanço aqui.</p><a class="btn" href="#/">Ver cursos</a></div>'}`;
  }

  function notFound() {
    document.title = 'Página não encontrada | Trilho';
    $main.innerHTML = '<div class="empty" style="margin-top:48px"><h1>Página não encontrada</h1><p>Este curso ou lição não existe.</p><a class="btn" href="#/">Voltar ao catálogo</a></div>';
  }

  function route() {
    const h = location.hash.replace(/^#\/?/, ''), parts = h.split('/');
    let focus = null;
    if (h === 'catalogo') { if (!document.getElementById('catalogo')) catalog(); document.getElementById('catalogo').scrollIntoView(); setNav('catalogo'); return; }
    if (!h) { catalog(); setNav('catalogo'); }
    else if (parts[0] === 'progresso') { progress(); setNav('progresso'); }
    else if (parts[0] === 'curso' && course(parts[1])) { detail(course(parts[1])); setNav('catalogo'); }
    else if (parts[0] === 'aula' && course(parts[1]) && lessons(course(parts[1])).find(l => l.id === parts[2])) { const c = course(parts[1]); focus = lessonView(c, lessons(c).find(l => l.id === parts[2])); setNav('catalogo'); }
    else { notFound(); setNav(''); }
    if (focus) focus.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function setNav(k) { document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }

  document.getElementById('reset-progress').addEventListener('click', () => {
    if (!confirm('Repor todo o progresso guardado neste navegador?')) return;
    state = { done: {}, quiz: {} }; save(); route(); announce('Progresso reposto.');
  });
  window.addEventListener('hashchange', route);
  route();
})();
