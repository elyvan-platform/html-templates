'use strict';
const conditions = {
  sun:{label:'Céu limpo',icon:'☀'},
  part:{label:'Pouco nublado',icon:'⛅'},
  cloud:{label:'Nublado',icon:'☁'},
  rain:{label:'Chuva fraca',icon:'🌧'},
  storm:{label:'Aguaceiros fortes',icon:'⛈'},
  fog:{label:'Nevoeiro matinal',icon:'🌫'}
};
// Cenário fixo e fictício: 12 nov. 2026. base = temperatura média do dia (°C), amp = amplitude diária.
const cities = [
  {id:'lisboa',name:'Lisboa',region:'Lisboa',temp:19,feels:18,cond:'part',wind:14,dir:'NO',rain:15,humidity:68,base:17,amp:4,days:['sun','part','part','rain','cloud','sun','sun']},
  {id:'porto',name:'Porto',region:'Norte',temp:16,feels:15,cond:'rain',wind:22,dir:'SO',rain:70,humidity:84,base:14,amp:3,days:['rain','rain','storm','cloud','part','rain','part']},
  {id:'coimbra',name:'Coimbra',region:'Centro',temp:17,feels:16,cond:'fog',wind:6,dir:'N',rain:25,humidity:88,base:15,amp:5,days:['fog','part','sun','sun','cloud','rain','part']},
  {id:'faro',name:'Faro',region:'Algarve',temp:22,feels:22,cond:'sun',wind:11,dir:'SE',rain:5,humidity:57,base:20,amp:5,days:['sun','sun','sun','part','sun','sun','part']},
  {id:'braga',name:'Braga',region:'Norte',temp:14,feels:12,cond:'cloud',wind:12,dir:'O',rain:55,humidity:80,base:12,amp:4,days:['cloud','rain','rain','storm','cloud','part','part']},
  {id:'evora',name:'Évora',region:'Alentejo',temp:18,feels:17,cond:'sun',wind:9,dir:'E',rain:8,humidity:52,base:15,amp:7,days:['sun','sun','part','cloud','part','sun','sun']},
  {id:'funchal',name:'Funchal',region:'Madeira',temp:21,feels:21,cond:'part',wind:19,dir:'NE',rain:20,humidity:72,base:20,amp:2,days:['part','part','sun','part','cloud','rain','part']},
  {id:'ponta-delgada',name:'Ponta Delgada',region:'Açores',temp:18,feels:17,cond:'cloud',wind:27,dir:'SO',rain:60,humidity:86,base:17,amp:2,days:['cloud','rain','rain','part','cloud','storm','rain']}
];
const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const convert = (c, unit='C') => Math.round(unit === 'F' ? c * 9 / 5 + 32 : c);
const formatTemp = (c, unit='C') => `${convert(c, unit)}°`;
function searchCities(query='') {
  const term = fold(query);
  return cities.filter(c => fold(`${c.name} ${c.region}`).includes(term));
}
// Previsão horária: 24 horas a partir das 14:00 do cenário, curva sinusoidal diária (mínimo ~06h, máximo ~15h).
function hourlyFor(city, startHour=14) {
  return Array.from({length:24},(_, i) => {
    const hour = (startHour + i) % 24;
    const temp = i === 0 ? city.temp : city.base + city.amp * Math.sin((hour - 9) / 24 * 2 * Math.PI);
    const night = hour < 7 || hour >= 19;
    let cond = city.cond;
    if (i > 0) cond = city.days[0] === 'sun' || city.days[0] === 'part' ? (night ? 'cloud' : city.days[0]) : city.days[0];
    const rain = Math.max(0, Math.min(100, Math.round(city.rain + 18 * Math.sin(i * 1.3 + city.base) * (city.rain > 40 ? 1 : .4))));
    return {hour:`${String(hour).padStart(2,'0')}:00`, temp, cond, rain, night};
  });
}
// Previsão semanal a partir de 12 nov. 2026 (quinta-feira).
function weeklyFor(city) {
  return city.days.map((cond, i) => {
    const date = new Date(Date.UTC(2026, 10, 12 + i));
    const drift = Math.sin(i * 1.7 + city.base) * 2;
    const wet = cond === 'rain' || cond === 'storm';
    return {
      label: i === 0 ? 'Hoje' : weekdays[date.getUTCDay()],
      date: `${date.getUTCDate()}/${date.getUTCMonth() + 1}`,
      cond,
      max: city.base + city.amp / 2 + drift + (wet ? -1.5 : 0),
      min: city.base - city.amp / 2 + drift - (cond === 'sun' ? 1 : 0),
      rain: wet ? 65 + (cond === 'storm' ? 20 : 0) : cond === 'cloud' ? 30 : 8
    };
  });
}
if (typeof module !== 'undefined') module.exports = {cities, conditions, searchCities, hourlyFor, weeklyFor, convert, formatTemp};
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const state = {id:'lisboa', unit:'C', query:'', favorites:new Set(['lisboa','faro'])};
  const say = text => { $('announcement').textContent = text; };
  const current = () => cities.find(c => c.id === state.id);
  const t = c => formatTemp(c, state.unit);
  function renderCities() {
    const list = searchCities(state.query);
    $('city-list').innerHTML = list.map(c => `<li><button type="button" class="city" data-city="${c.id}" aria-pressed="${c.id === state.id}"><span class="city-icon" aria-hidden="true">${conditions[c.cond].icon}</span><span class="city-name">${c.name}<small>${c.region}</small></span><span class="city-temp">${t(c.temp)}</span></button><button type="button" class="star" data-fav="${c.id}" aria-pressed="${state.favorites.has(c.id)}" aria-label="Favorito: ${c.name}">${state.favorites.has(c.id) ? '★' : '☆'}</button></li>`).join('');
    $('empty').hidden = list.length > 0;
    $('result-count').textContent = list.length ? `${list.length} de ${cities.length} localizações` : 'Sem resultados';
    renderFavorites();
  }
  function renderFavorites() {
    const favs = cities.filter(c => state.favorites.has(c.id));
    $('fav-list').innerHTML = favs.map(c => `<li><button type="button" class="chip" data-city="${c.id}">${conditions[c.cond].icon} ${c.name} <strong>${t(c.temp)}</strong></button></li>`).join('');
    $('fav-empty').hidden = favs.length > 0;
  }
  function renderMain() {
    const c = current(), cond = conditions[c.cond];
    document.body.dataset.sky = c.cond;
    $('city-title').textContent = c.name;
    $('city-region').textContent = `${c.region} · Portugal`;
    $('now-temp').textContent = t(c.temp);
    $('now-cond').textContent = `${cond.label} · sensação de ${t(c.feels)}`;
    $('now-icon').textContent = cond.icon;
    $('m-wind').textContent = `${c.wind} km/h ${c.dir}`;
    $('m-rain').textContent = `${c.rain}%`;
    $('m-hum').textContent = `${c.humidity}%`;
    $('bar-wind').style.width = `${Math.min(100, c.wind * 2.5)}%`;
    $('bar-rain').style.width = `${c.rain}%`;
    $('bar-hum').style.width = `${c.humidity}%`;
    $('hourly').innerHTML = hourlyFor(c).map((h, i) => `<li><span>${i === 0 ? 'Agora' : h.hour}</span><span aria-hidden="true">${h.night && h.cond !== 'rain' && h.cond !== 'storm' ? '☾' : conditions[h.cond].icon}</span><strong>${t(h.temp)}</strong><small>${h.rain}%<span class="sr-only"> de probabilidade de chuva, ${conditions[h.cond].label}</span></small></li>`).join('');
    const week = weeklyFor(c);
    const lo = Math.min(...week.map(d => d.min)), hi = Math.max(...week.map(d => d.max));
    $('weekly').innerHTML = week.map(d => `<li><span class="day">${d.label}<small>${d.date}</small></span><span aria-hidden="true">${conditions[d.cond].icon}</span><span class="sr-only">${conditions[d.cond].label}, chuva ${d.rain}%</span><small class="rainp">${d.rain}%</small><span class="range"><span>${t(d.min)}</span><i aria-hidden="true"><b style="left:${(d.min - lo) / (hi - lo) * 100}%;right:${100 - (d.max - lo) / (hi - lo) * 100}%"></b></i><strong>${t(d.max)}</strong></span></li>`).join('');
    $('fav-toggle').setAttribute('aria-pressed', String(state.favorites.has(c.id)));
    $('fav-toggle').textContent = state.favorites.has(c.id) ? '★ Nos favoritos' : '☆ Guardar favorito';
    document.querySelectorAll('[data-unit]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.unit === state.unit)));
  }
  const renderAll = () => { renderCities(); renderMain(); };
  function select(id) { state.id = id; renderAll(); say(`A mostrar ${current().name}.`); }
  document.addEventListener('click', e => {
    const city = e.target.closest('[data-city]');
    if (city) { select(city.dataset.city); return; }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const id = fav.dataset.fav;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      renderAll();
      document.querySelector(`[data-fav="${id}"]`)?.focus();
      say(`${cities.find(c => c.id === id).name} ${state.favorites.has(id) ? 'adicionada aos' : 'removida dos'} favoritos. ${state.favorites.size} guardados nesta visita.`);
      return;
    }
    const unit = e.target.closest('[data-unit]');
    if (unit) { state.unit = unit.dataset.unit; renderAll(); say(`Temperaturas em °${state.unit}.`); }
  });
  $('fav-toggle').addEventListener('click', () => {
    const id = state.id;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    renderAll();
    say(`${current().name} ${state.favorites.has(id) ? 'adicionada aos' : 'removida dos'} favoritos.`);
  });
  $('search').addEventListener('input', e => { state.query = e.target.value; renderCities(); });
  $('search-form').addEventListener('submit', e => {
    e.preventDefault();
    const first = searchCities(state.query)[0];
    if (first) select(first.id);
  });
  $('clear').addEventListener('click', () => { state.query = ''; $('search').value = ''; renderCities(); $('search').focus(); });
  renderAll();
}
