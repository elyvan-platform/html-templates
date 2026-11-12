'use strict';
const assets = [
  {id:'btc',name:'Bitcoin',symbol:'BTC',icon:'₿',color:'#bd792e',price:68420,change:3.42,cap:1350000000000,quantity:0.175},
  {id:'eth',name:'Ethereum',symbol:'ETH',icon:'Ξ',color:'#7362b4',price:3248.60,change:2.18,cap:391000000000,quantity:2.3},
  {id:'sol',name:'Solana',symbol:'SOL',icon:'◎',color:'#34695f',price:168.42,change:6.75,cap:79000000000,quantity:22},
  {id:'ada',name:'Cardano',symbol:'ADA',icon:'₳',color:'#3665a3',price:0.5824,change:-1.24,cap:20400000000,quantity:0},
  {id:'avax',name:'Avalanche',symbol:'AVAX',icon:'▲',color:'#a84a59',price:32.85,change:-2.36,cap:13400000000,quantity:0},
  {id:'usdc',name:'USD Coin',symbol:'USDC',icon:'$',color:'#4b6577',price:0.94,change:0.02,cap:31800000000,quantity:1800}
];
const euro = value => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:value < 1 ? 4 : 2}).format(value);
const percent = value => `${value >= 0 ? '+' : ''}${value.toFixed(2).replace('.',',')}%`;
function selectAssets({query='',movement='all',watchOnly=false,favorites=new Set(),sort='rank'}={}) {
  const term=query.trim().toLocaleLowerCase('pt-PT');
  return assets.filter(a => `${a.name} ${a.symbol}`.toLocaleLowerCase('pt-PT').includes(term) && (!watchOnly || favorites.has(a.id)) && (movement==='all' || (movement==='up' ? a.change>0 : a.change<0))).sort((a,b)=> sort==='price' ? b.price-a.price : sort==='change' ? b.change-a.change : b.cap-a.cap);
}
function seriesFor(asset,period){
  const scale={'1D':1,'1S':2.4,'1M':5,'1A':12}[period] || 1;
  const count=25;
  const end=asset.price;
  const start=end/(1+asset.change*scale/100);
  return Array.from({length:count},(_,i)=>start+(end-start)*i/(count-1)+Math.sin(i*1.8+assets.indexOf(asset)) * end*.006*scale*Math.sin(Math.PI*i/(count-1)));
}
function portfolio(){
  const holdings=assets.filter(a=>a.quantity>0).map(a=>({...a,value:a.price*a.quantity}));
  const total=holdings.reduce((sum,a)=>sum+a.value,0);
  const previous=holdings.reduce((sum,a)=>sum+a.value/(1+a.change/100),0);
  return {holdings,total,change:(total/previous-1)*100};
}
if(typeof module!=='undefined') module.exports={assets,selectAssets,seriesFor,portfolio};
if(typeof document!=='undefined'){
  const $=id=>document.getElementById(id);
  const favorites=new Set(['btc','eth','sol']);
  let watchOnly=false;
  let period='1D';
  $('asset').innerHTML=assets.map(a=>`<option value="${a.id}">${a.name} · ${a.symbol}</option>`).join('');
  const wallet=portfolio();
  $('portfolio-value').textContent=euro(wallet.total);
  $('donut-total').textContent=euro(wallet.total);
  $('portfolio-change').textContent=percent(wallet.change);
  const colors=['#78ecc0','#b5a1f8','#76b8eb','#637276'];
  let angle=0;
  const segments=wallet.holdings.map((a,i)=>{
    const start=angle;angle+=a.value/wallet.total*100;
    return `${colors[i]} ${start}% ${angle}%`;
  });
  document.querySelector('.donut').style.background=`conic-gradient(${segments.join(',')})`;
  $('allocation-list').innerHTML=wallet.holdings.map((a,i)=>`<li><i style="background:${colors[i]}" aria-hidden="true"></i>${a.name}<span>${(a.value/wallet.total*100).toFixed(1).replace('.',',')}% · ${euro(a.value)}</span></li>`).join('');
  function drawChart(){
    const asset=assets.find(a=>a.id===$('asset').value);
    const values=seriesFor(asset,period);
    const min=Math.min(...values)*.997,max=Math.max(...values)*1.003;
    const points=values.map((value,i)=>`${i*740/(values.length-1)},${200-(value-min)/(max-min)*175}`);
    $('chart-line').setAttribute('d',`M${points.join(' L')}`);
    $('chart-area').setAttribute('d',`M0,230 L${points.join(' L')} L740,230 Z`);
    $('chart-price').textContent=euro(asset.price);
    const change=(values.at(-1)/values[0]-1)*100;
    $('chart-change').textContent=`${percent(change)} · ${period} · exemplo`;
    $('chart-change').className=change>=0?'positive':'negative';
    $('chart-title').textContent=`${asset.name} · ${period} · cotação fictícia em EUR`;
    $('chart-desc').textContent=`De ${euro(values[0])} a ${euro(values.at(-1))}. Mínimo: ${euro(Math.min(...values))}. Máximo: ${euro(Math.max(...values))}. Valores detalhados disponíveis abaixo.`;
    const labels={'1D':['00:00','06:00','12:00','18:00','23:59'],'1S':['6 nov.','8 nov.','9 nov.','11 nov.','12 nov.'],'1M':['13 out.','20 out.','28 out.','4 nov.','12 nov.'],'1A':['nov. 2025','fev. 2026','mai. 2026','ago. 2026','nov. 2026']}[period];
    $('chart-caption').innerHTML=labels.map(l=>`<span>${l}</span>`).join('');
    $('chart-values').innerHTML=values.map((v,i)=>`<span>Ponto ${i+1}: ${euro(v)}</span>`).join('');
  }
  function render(){
    const filtered=selectAssets({query:$('search').value,movement:$('movement').value,sort:$('sort').value,watchOnly,favorites});
    $('market-body').innerHTML=filtered.map(a=>{
      const values=seriesFor(a,'1S');
      const min=Math.min(...values),range=Math.max(...values)-min || 1;
      const points=values.map((v,i)=>`${i*95/24},${25-(v-min)/range*22}`).join(' ');
      return `<tr><td><button class="star" data-favorite="${a.id}" aria-label="${favorites.has(a.id)?'Remover':'Adicionar'} ${a.name} ${favorites.has(a.id)?'da':'à'} watchlist" aria-pressed="${favorites.has(a.id)}">${favorites.has(a.id)?'★':'☆'}</button></td><td><div class="asset-cell"><span class="coin" style="--coin:${a.color}" aria-hidden="true">${a.icon}</span><div><span class="asset-name">${a.name}</span><span class="asset-symbol">${a.symbol}</span></div></div></td><td>${euro(a.price)}</td><td class="${a.change>=0?'positive':'negative'}">${percent(a.change)}</td><td>${new Intl.NumberFormat('pt-PT',{maximumFractionDigits:2}).format(a.cap/1e9)} mil M €</td><td><svg class="sparkline" viewBox="0 0 95 28" role="img" aria-label="Tendência fictícia semanal ${a.change>=0?'ascendente':'descendente'}"><polyline points="${points}" fill="none" stroke="${a.change>=0?'#78ecc0':'#ff9ca9'}" stroke-width="1.5"/></svg></td></tr>`;
    }).join('');
    $('empty').hidden=filtered.length>0;
    $('empty-copy').textContent=watchOnly && favorites.size===0 ? 'A tua watchlist está vazia. Adiciona ativos através da estrela junto ao nome.' : 'Não há resultados para estes filtros. Experimenta outro nome ou limpa a pesquisa.';
    $('result-count').textContent=`${filtered.length} de ${assets.length} ativos · ${favorites.size} favoritos`;
    $('watch-count').textContent=favorites.size;
    $('all-tab').setAttribute('aria-pressed',String(!watchOnly));
    $('watch-tab').setAttribute('aria-pressed',String(watchOnly));
  }
  $('market-body').addEventListener('click',event=>{
    const button=event.target.closest('[data-favorite]');if(!button)return;
    const id=button.dataset.favorite;
    if(favorites.has(id)) favorites.delete(id);else favorites.add(id);
    $('announcement').textContent=`Watchlist atualizada. ${favorites.size} ativos guardados nesta visita.`;
    render();
    const replacement=document.querySelector(`[data-favorite="${id}"]`);
    (replacement || $('watch-tab')).focus();
  });
  $('search').addEventListener('input',render);
  ['movement','sort'].forEach(id=>$(id).addEventListener('change',render));
  $('all-tab').addEventListener('click',()=>{watchOnly=false;render();});
  $('watch-tab').addEventListener('click',()=>{watchOnly=true;render();});
  $('watch-nav').addEventListener('click',()=>{watchOnly=true;render();});
  $('clear-filters').addEventListener('click',()=>{watchOnly=false;$('search').value='';$('movement').value='all';$('sort').value='rank';render();$('search').focus();});
  $('asset').addEventListener('change',drawChart);
  document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{
    period=button.dataset.period;
    document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    drawChart();
    $('announcement').textContent=`Gráfico atualizado para ${period}.`;
  }));
  drawChart();render();
}
