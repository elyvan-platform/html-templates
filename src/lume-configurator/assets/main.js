(() => {
  const colors = { oliva: ['Oliva', '#727a59'], terracota: ['Terracota', '#c36e52'], areia: ['Areia', '#ded8c9'], grafite: ['Grafite', '#3b3d3b'] };
  const materials = { aluminio: ['Alumínio acetinado', 0, ['#6e7069', '#e3e1d7', '#77796f']], latao: ['Latão escovado', 35, ['#927039', '#eedcaf', '#aa8644']] };
  const bases = { circular: ['Circular', 0], oval: ['Oval', 20] };
  const $ = (id) => document.getElementById(id);
  const form = $('options');
  let angle = 0, zoom = 100, lit = true;
  const money = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
  function configuration() {
    const values = new FormData(form);
    const color = colors[values.get('color')];
    const material = materials[values.get('material')];
    const base = bases[values.get('base')];
    return { color, material, base, price: 189 + material[1] + base[1] };
  }
  function render() {
    const { color, material, base, price } = configuration();
    document.querySelectorAll('.paint').forEach((part) => part.setAttribute('fill', color[1]));
    document.querySelectorAll('#metal stop').forEach((stop, index) => stop.setAttribute('stop-color', material[2][index]));
    $('base').setAttribute('transform', `translate(350 529) scale(${base[0] === 'Oval' ? 1.35 : 1} 1) translate(-350 -529)`);
    $('color-name').textContent = color[0];
    $('summary').textContent = `${color[0]} · ${material[0]} · ${base[0]}`;
    $('price').textContent = money.format(price);
    $('lamp-title').textContent = `Candeeiro Arco em ${color[0]}, ${material[0]} e base ${base[0]}`;
    $('status').textContent = '';
    renderView();
  }
  function renderView() {
    const offset = Math.sin(angle * Math.PI / 180) * 38;
    $('head').setAttribute('transform', `translate(${offset} 0)`);
    $('stem').setAttribute('d', `M350 524 L350 232 Q350 190 ${385 + offset} 190`);
    $('object').style.transform = `scale(${zoom / 100})`;
    $('angle-label').textContent = `VISTA · ${((angle % 360) + 360) % 360}°`;
    $('zoom-label').textContent = `${zoom}%`;
    $('zoom-out').disabled = zoom <= 70;
    $('zoom-in').disabled = zoom >= 140;
    $('light-pool').style.opacity = lit ? '1' : '0';
    $('light').setAttribute('aria-pressed', String(lit));
  }
  const rotate = (delta) => { angle = Math.round(angle + delta); renderView(); };
  const magnify = (delta) => { zoom = Math.min(140, Math.max(70, zoom + delta)); renderView(); };
  form.addEventListener('change', render);
  $('rotate-left').addEventListener('click', () => rotate(-30));
  $('rotate-right').addEventListener('click', () => rotate(30));
  $('zoom-in').addEventListener('click', () => magnify(10));
  $('zoom-out').addEventListener('click', () => magnify(-10));
  $('light').addEventListener('click', () => { lit = !lit; renderView(); });
  $('viewport').addEventListener('keydown', (event) => {
    const actions = { ArrowLeft: () => rotate(-15), ArrowRight: () => rotate(15), '+': () => magnify(10), '=': () => magnify(10), '-': () => magnify(-10), Home: () => { angle = 0; zoom = 100; renderView(); } };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  let start = null;
  $('viewport').addEventListener('pointerdown', (event) => { if (!event.isPrimary || event.button !== 0) return; start = event.clientX; $('viewport').setPointerCapture(event.pointerId); });
  $('viewport').addEventListener('pointermove', (event) => { if (start === null) return; const delta = event.clientX - start; rotate(delta / 2); start = event.clientX; });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) $('viewport').addEventListener(type, () => { start = null; });
  $('reset').addEventListener('click', () => { form.reset(); angle = 0; zoom = 100; lit = true; render(); $('status').textContent = 'Configuração inicial reposta.'; });
  $('export').addEventListener('click', () => {
    let url;
    try {
      const { color, material, base, price } = configuration();
      const text = `LUME STUDIO — ARCO 01\n\nCor: ${color[0]}\nHaste: ${material[0]}\nBase: ${base[0]}\nPreço ilustrativo: ${money.format(price)} (IVA incluído)\n\nDimensões: 42 cm de altura · abajur de 26 cm\nLED · 2700 K\n\nProduto fictício. Resumo local de demonstração, sem encomenda.\n`;
      url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'lume-arco-configuracao.txt'; document.body.append(link); link.click(); link.remove();
      $('status').textContent = 'Resumo preparado. Consulte as transferências.';
    } catch { $('status').textContent = 'Não foi possível guardar. Tente novamente ou copie o resumo acima.'; }
    finally { if (url) setTimeout(() => URL.revokeObjectURL(url), 1000); }
  });
  render();
})();
