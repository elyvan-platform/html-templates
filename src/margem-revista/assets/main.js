const $ = (selector) => document.querySelector(selector);
function card(story) {
  return `<article class="story"><a href="article.html?id=${story.id}"><div class="image-wrap"><img src="assets/${story.id}.svg" alt="" loading="lazy" width="600" height="540"><span aria-hidden="true">↗</span></div><p class="eyebrow">${story.category} / ${story.minutes} min</p><h3>${story.title}</h3></a><p>${story.intro}</p><p class="author">${story.author} · 12 outubro 2026</p></article>`;
}
if ($('#stories')) {
  let category = new URLSearchParams(location.search).get('categoria') || 'Todas';
  if (!['Todas', 'Cultura', 'Design', 'Tecnologia'].includes(category)) category = 'Todas';
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function render() {
    const query = normalize($('#pesquisa').value.trim());
    const matches = stories.filter(s => (category === 'Todas' || s.category === category) && normalize(`${s.title} ${s.intro} ${s.category} ${s.author}`).includes(query));
    if ($('#sort').value === 'short') matches.sort((a, b) => a.minutes - b.minutes);
    $('#stories').innerHTML = matches.map(card).join('');
    $('#results').textContent = `${matches.length} ${matches.length === 1 ? 'história' : 'histórias'} nesta seleção`;
    $('#empty').hidden = matches.length > 0;
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === category)));
  }
  document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => { category = b.dataset.category; render(); }));
  $('#pesquisa').addEventListener('input', render);
  $('#search-form').addEventListener('submit', e => { e.preventDefault(); render(); });
  $('#sort').addEventListener('change', render);
  $('#reset').addEventListener('click', () => { category = 'Todas'; $('#pesquisa').value = ''; $('#sort').value = 'edition'; render(); $('#pesquisa').focus(); });
  $('#newsletter-form').addEventListener('submit', e => { e.preventDefault(); $('#newsletter-status').textContent = 'Demonstração concluída. Numa edição real, receberia uma confirmação. Não foi feita qualquer subscrição.'; $('#newsletter-form').reset(); });
  render();
}
if ($('#article')) {
  const id = new URLSearchParams(location.search).get('id') || 'cidade';
  const story = stories.find(s => s.id === id);
  if (!story) {
    $('#article').innerHTML = '<h1>Esta página ficou fora da edição.</h1><p>A história pedida não existe. Explore as leituras disponíveis na revista.</p><a href="index.html#historias">Explorar histórias →</a>';
  } else {
    document.title = `${story.title} | Margem`;
    const sections = {
      cidade: [['Uma cidade à escala humana', 'A manhã começa numa rua estreita do Porto. Uma livraria levanta a grade, o café da esquina recebe os primeiros vizinhos e, num andar de cima, alguém prepara uma exposição. Não há um grande anúncio. Há portas abertas.', 'Estes espaços pequenos fazem parte de uma rede cultural que raramente aparece nos mapas. São lugares de encontro, onde uma conversa pode dar origem a uma colaboração e onde o bairro continua a reconhecer-se.'], ['O espaço entre as coisas', 'Numa antiga oficina, as mesas são partilhadas por ilustradores e editores. As ferramentas passam de mão em mão. O que os reúne não é uma estética comum, mas a vontade de manter um espaço acessível à experimentação.', 'A transformação de uma cidade também se mede por aquilo que consegue preservar: tempo para conversar, rendas que permitem ficar e lugares onde não é preciso consumir para pertencer.'], ['Continuar a olhar', 'Talvez o melhor roteiro seja aquele que deixa espaço ao desvio. Entrar numa livraria independente, visitar uma exposição de bairro ou perguntar quem fez o cartaz na parede são formas simples de participar.', 'Ler a cidade pelas margens não exige um olhar especializado. Exige disponibilidade. E a curiosidade de reconhecer que a próxima boa história pode estar na rua ao lado.']],
      objetos: [['A vida dos materiais', 'Uma cadeira herdada transporta mais do que uma forma. As marcas de uso contam uma história que nenhum catálogo consegue reproduzir. Projetar para durar começa por reconhecer esse valor.'], ['Reparar como escolha', 'Nas oficinas de reparação, uma junta solta não significa o fim de um objeto. Materiais desmontáveis e peças substituíveis tornam a manutenção possível e aproximam quem desenha de quem utiliza.'], ['Comprar com tempo', 'Antes de escolher uma peça nova, vale a pena perguntar onde foi feita, como envelhece e quem a poderá reparar. A durabilidade é uma relação que se constrói ao longo dos anos.']],
      digital: [['O ruído constante', 'Abrimos uma aplicação para responder a uma mensagem e saímos vinte minutos depois. A atenção tornou-se um recurso disputado por interfaces que raramente nos convidam a parar.'], ['Desenhar uma pausa', 'Uma internet mais lenta não precisa de carregar devagar. Precisa de respeitar a intenção de quem a usa: notificações escolhidas, finais claros e espaço para ler sem interrupções.'], ['Pequenas experiências', 'Desligar alertas dispensáveis e reservar um momento para a correspondência são experiências acessíveis. O design pode apoiar estas escolhas ao tornar os controlos visíveis e compreensíveis.']],
      oficinas: [['O gesto e a matéria', 'Na bancada, o barro obriga a abrandar. Cada peça nasce de um diálogo entre intenção e resistência, num processo em que o erro também ensina.'], ['Aprender em conjunto', 'As oficinas abertas aproximam gerações. Quem começa aprende a preparar ferramentas; quem ensina descobre novas perguntas. O conhecimento ganha vida quando circula.'], ['Dar continuidade', 'Valorizar o trabalho manual implica reconhecer o tempo que exige. Visitar uma oficina e conhecer os processos ajuda a compreender o preço e a história de cada peça.']],
      letras: [['Ler a rua', 'As letras de uma fachada dizem-nos quando uma loja abriu e como queria ser vista. Mesmo desgastados, os letreiros continuam a participar na identidade do bairro.'], ['Desenhar uma voz', 'Uma família tipográfica pode ser discreta ou expressiva, mas precisa de servir a leitura. Nos projetos locais, o desenho começa muitas vezes pela observação do arquivo da cidade.'], ['Preservar sem congelar', 'Documentar letreiros e conhecer os seus autores permite adaptar referências com cuidado. A memória visual pode alimentar novas linguagens sem se tornar uma cópia.']],
      arquivo: [['Memórias sem caixa', 'Guardamos milhares de fotografias, mas nem sempre sabemos onde estão os originais. A facilidade de registar não garante a possibilidade de voltar a encontrar.'], ['Cuidar dos ficheiros', 'Nomes compreensíveis, formatos comuns e cópias em locais diferentes ajudam a preservar um arquivo pessoal. É um trabalho discreto que merece entrar nas rotinas.'], ['Escolher o que fica', 'Preservar também é selecionar e dar contexto. Uma data, um lugar e duas linhas sobre quem aparece numa imagem podem ser tão importantes como a própria fotografia.']]
    };
    $('#article').innerHTML = `<div class="article-heading"><p class="eyebrow">${story.category} / Edição 08</p><h1>${story.title}</h1><p class="standfirst">${story.intro}</p><div class="byline">${story.author} · 12 outubro 2026 <span>${story.minutes} min de leitura</span></div><button id="reading-mode" aria-pressed="false">Modo de leitura</button></div><figure class="article-image"><img src="assets/${story.id}.svg" alt="Ilustração editorial para ${story.title}" width="600" height="540"><figcaption>Ilustração da redação · Margem, edição de outono</figcaption></figure><div class="article-layout"><aside class="toc"><nav aria-label="Índice do artigo"><p class="eyebrow">Nesta história</p>${sections[id].map((s,i) => `<a href="#parte-${i}">0${i+1} — ${s[0]}</a>`).join('')}</nav></aside><div class="prose">${sections[id].map((s,i) => `<section id="parte-${i}"><h2>${s[0]}</h2>${s.slice(1).map(t => `<p>${t}</p>`).join('')}</section>`).join('')}<p class="endnote">Texto demonstrativo · Uma publicação independente, um olhar partilhado.</p></div></div><section class="related"><p class="eyebrow">Continue a descobrir</p><h2>Na mesma margem</h2><div class="grid">${stories.filter(s => s.id !== id).sort((a,b) => Number(b.category === story.category)-Number(a.category === story.category)).slice(0,3).map(card).join('')}</div></section>`;
    $('#reading-mode').addEventListener('click', () => {
      const active = document.body.classList.toggle('reading');
      $('#reading-mode').setAttribute('aria-pressed', String(active));
      $('#reading-mode').textContent = active ? 'Sair do modo de leitura' : 'Modo de leitura';
    });
  }
}
