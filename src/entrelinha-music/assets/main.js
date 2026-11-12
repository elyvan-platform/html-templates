/* All catalogue content and audio are local, fictional demonstration material. */
const tracks = [
  {id:0,title:'Margem sul',artist:'Atlas Lento',album:'Maré baixa',art:0,duration:24},
  {id:1,title:'Devagar, o dia',artist:'Atlas Lento',album:'Maré baixa',art:0,duration:24},
  {id:2,title:'Casa de luz',artist:'Clara Nevoeiro',album:'Luz de dentro',art:1,duration:24},
  {id:3,title:'Quando a cidade dorme',artist:'Clara Nevoeiro',album:'Luz de dentro',art:1,duration:24}
];
const playlists = {slow:{name:'Sem pressa',ids:[0,2,1]},night:{name:'Depois das dez',ids:[3,2]},focus:{name:'Modo foco',ids:[1,3]}};
function filterTracks({query='',view='home',album='',playlist='',favorites=[]}={}) {
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return tracks.filter(track => (!album || track.album===album) && (!playlist || playlists[playlist]?.ids.includes(track.id)) && (view!=='favorites' || favorites.includes(track.id)) && normalize(`${track.title} ${track.artist} ${track.album}`).includes(normalize(query.trim())));
}
function formatTime(seconds){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
if(typeof module!=='undefined') module.exports={tracks,playlists,filterTracks,formatTime};
if(typeof document!=='undefined') {
  const $=id=>document.getElementById(id);
  const audio=$('audio');
  let current=0, queue=[1,2,3], history=[], favorites=[], view='home', album='', playlist='', timer, request=0;
  // Storage may be unavailable in private browsing or file previews.
  try {const saved=JSON.parse(localStorage.getItem('entrelinha-favorites')||'[]');if(Array.isArray(saved))favorites=[...new Set(saved.filter(id=>tracks.some(t=>t.id===id)))];} catch {}
  function status(message){$('status').textContent=message;clearTimeout(timer);timer=setTimeout(()=>$('status').textContent='',5000);}
  function rows(){return filterTracks({query:$('search').value,view,album,playlist,favorites});}
  function favorite(id){favorites=favorites.includes(id)?favorites.filter(value=>value!==id):[...favorites,id];try{localStorage.setItem('entrelinha-favorites',JSON.stringify(favorites));}catch{}render();status(favorites.includes(id)?'Guardada nos favoritos.':'Removida dos favoritos.');}
  function render(){
    const active=document.activeElement;
    const focusKey=['favorite','add','remove','queueIndex','track','album'].find(key=>active?.dataset?.[key]!==undefined);
    const focusValue=focusKey?active.dataset[focusKey]:null;
    const searching=Boolean($('search').value.trim());
    $('discovery').hidden=view!=='home'||searching;
    const title=searching?'Resultados da pesquisa':album||playlists[playlist]?.name||({home:'A rodar por aqui',all:'A tua biblioteca',favorites:'Os teus favoritos'}[view]);
    $('list-title').textContent=title;
    $('list-kicker').textContent=searching?`${rows().length} FAIXAS ENCONTRADAS`:'ESCUTA COM CALMA';
    $('show-all').hidden=view!=='home'||searching;
    $('list-actions').hidden=view==='home'&&!searching;
    $('play-list').disabled=rows().length===0;
    document.querySelectorAll('[data-view]').forEach(button=>{const active=button.dataset.view===view&&!searching;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    $('favorite-count').textContent=favorites.length;
    $('tracks').innerHTML=rows().map((t,index)=>`<div class="track ${current===t.id?'current':''}"><button class="track-play" data-track="${t.id}" aria-label="Reproduzir ${t.title}">${current===t.id&&!audio.paused?'Ⅱ':String(index+1).padStart(2,'0')}</button><button class="track-name" data-track="${t.id}">${t.title}<small>${t.artist}</small></button><button class="track-album" data-album="${t.album}">${t.album}</button><span class="track-duration">${formatTime(t.duration)}</span><div class="row-actions"><button class="heart" data-favorite="${t.id}" aria-label="Favorito: ${t.title}" aria-pressed="${favorites.includes(t.id)}">${favorites.includes(t.id)?'♥':'♡'}</button><button class="add-queue" data-add="${t.id}" aria-label="Adicionar ${t.title} à fila">+</button></div></div>`).join('');
    $('empty').hidden=rows().length>0;
    $('empty-title').textContent=searching?'Não encontrámos essa frequência.':'Ainda está tudo em silêncio.';
    $('empty-copy').textContent=searching?'Experimenta outro título, artista ou álbum.':'Toca no coração de uma faixa para a guardares aqui.';
    $('now-title').textContent=tracks[current].title;$('now-artist').textContent=tracks[current].artist;$('now-cover').className=`mini-art art-${tracks[current].art}`;
    $('now-favorite').textContent=favorites.includes(current)?'♥':'♡';$('now-favorite').setAttribute('aria-pressed',String(favorites.includes(current)));$('now-favorite').setAttribute('aria-label',favorites.includes(current)?'Remover faixa atual dos favoritos':'Adicionar faixa atual aos favoritos');
    $('queue-count').textContent=`${queue.length} ${queue.length===1?'faixa':'faixas'}`;
    $('queue-list').innerHTML=queue.length?queue.map((id,index)=>`<div class="queue-item"><span class="mini-art art-${tracks[id].art}" aria-hidden="true"></span><button class="q-play" data-queue-index="${index}" aria-label="Reproduzir ${tracks[id].title} da fila">${tracks[id].title}<small>${tracks[id].artist}</small></button><button class="icon" data-remove="${index}" aria-label="Remover ${tracks[id].title} da fila">×</button></div>`).join(''):'<p class="queue-empty">A fila está vazia.<br>Usa o + junto a uma faixa para a adicionares.</p>';
    $('clear-queue').disabled=queue.length===0;
    syncPlayback();
    if(focusKey&&!active.isConnected){
      const replacement=[...document.querySelectorAll('button')].find(button=>button.dataset[focusKey]===focusValue);
      (replacement||(!$('empty').hidden?$('reset'):$('clear-queue'))).focus({preventScroll:true});
    }
  }
  function syncPlayback(){const playing=!audio.paused;$('play').textContent=playing?'Ⅱ':'▶';$('play').setAttribute('aria-label',playing?'Pausar':'Reproduzir');const row=document.querySelector(`.track-play[data-track="${current}"]`);if(row)row.textContent=playing?'Ⅱ':'▶';}
  async function play(){const token=++request;try{await audio.play();if(token===request)syncPlayback();}catch(error){if(token===request&&error.name!=='AbortError')status('Não foi possível reproduzir o excerto. Tenta novamente ou escolhe outra faixa.');}}
  function select(id, autoplay=true){request++;audio.pause();if(id!==current)history.push(current);current=id;audio.src=`assets/track-${id}.wav`;$('progress').value=0;$('elapsed').value='0:00';render();if(autoplay)play();}
  function next(){if(queue.length){select(queue.shift());}else{audio.pause();audio.currentTime=0;syncPlayback();status('Chegaste ao fim da fila. Adiciona mais música para continuar.');render();}}
  function navigate(nextView, nextAlbum='', nextPlaylist=''){view=nextView;album=nextAlbum;playlist=nextPlaylist;$('search').value='';render();}
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.view)navigate(button.dataset.view);
    if(button.dataset.album)navigate('album',button.dataset.album);
    if(button.dataset.playlist)navigate('playlist','',button.dataset.playlist);
    if(button.dataset.track!==undefined)select(Number(button.dataset.track));
    if(button.dataset.favorite!==undefined)favorite(Number(button.dataset.favorite));
    if(button.dataset.add!==undefined){queue.push(Number(button.dataset.add));render();status('Faixa adicionada à fila.');}
    if(button.dataset.remove!==undefined){queue.splice(Number(button.dataset.remove),1);render();status('Faixa removida da fila.');}
    if(button.dataset.queueIndex!==undefined){const index=Number(button.dataset.queueIndex);const [id]=queue.splice(index,1);select(id);}
  });
  $('search-form').addEventListener('submit',e=>{e.preventDefault();render();});$('search').addEventListener('input',()=>{if(view==='home'||view==='all'){render();}else{view='all';album='';playlist='';render();}});
  $('show-all').onclick=()=>navigate('all');$('back').onclick=()=>navigate('home');$('reset').onclick=()=>navigate('all');
  $('hero-play').onclick=()=>{queue=playlists.slow.ids.slice(1);select(playlists.slow.ids[0]);};
  $('play-list').onclick=()=>{const selection=rows();if(selection.length){queue=selection.slice(1).map(t=>t.id);select(selection[0].id);}};
  $('clear-queue').onclick=()=>{queue=[];render();status('Fila limpa. A faixa atual continua disponível.');};
  $('now-favorite').onclick=()=>favorite(current);
  $('play').onclick=()=>{if(audio.paused)play();else{request++;audio.pause();syncPlayback();}};
  $('next').onclick=next;$('previous').onclick=()=>{if(audio.currentTime>3||!history.length){audio.currentTime=0;status('Faixa reiniciada.');}else{const previous=history.pop();queue.unshift(current);current=previous;select(previous);}};
  audio.volume=.65;$('volume').oninput=()=>{audio.volume=Number($('volume').value);audio.muted=false;updateMute();};
  function updateMute(){$('mute').setAttribute('aria-pressed',String(audio.muted));$('mute').setAttribute('aria-label',audio.muted?'Ativar som':'Silenciar');$('mute').textContent=audio.muted?'∅':'♪';}
  $('mute').onclick=()=>{audio.muted=!audio.muted;updateMute();};
  $('progress').oninput=()=>{if(Number.isFinite(audio.duration)){audio.currentTime=Math.min(Number($('progress').value),audio.duration);$('elapsed').value=formatTime(audio.currentTime);}};
  audio.addEventListener('timeupdate',()=>{$('progress').value=audio.currentTime;$('elapsed').value=formatTime(audio.currentTime);});
  audio.addEventListener('loadedmetadata',()=>{$('progress').max=audio.duration;$('duration').textContent=formatTime(audio.duration);});
  audio.addEventListener('play',render);audio.addEventListener('pause',syncPlayback);audio.addEventListener('ended',next);audio.addEventListener('error',()=>status('O excerto está indisponível. Escolhe outra faixa ou tenta recarregar a página.'));
  render();
}
