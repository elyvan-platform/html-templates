import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {listTemplateDirectories,templateArea} from '../scripts/showcase-lib.mjs';
const require=createRequire(import.meta.url);
const {tracks,playlists,filterTracks,formatTime}=require('../src/entrelinha-music/assets/main.js');
test('music player is discoverable with local preview and assets',async()=>{
 const entry=(await listTemplateDirectories()).find(t=>t.slug==='entrelinha-music');
 assert.equal(entry.name,'Entrelinha');assert.equal(templateArea(entry),'Cultura e revistas');
 assert.equal(entry.previewHref,'/src/entrelinha-music/preview.svg');
 const html=await readFile('src/entrelinha-music/index.html','utf8');
 assert.match(html,/lang="pt-PT"/);
 for(const file of ['assets/style.css','assets/main.js','preview.svg'])assert.ok((await readFile(`src/entrelinha-music/${file}`)).length);
 assert.doesNotMatch(html,/https?:\/\//);
});
test('search handles accents, case, whitespace, albums and empty results',()=>{
 assert.equal(filterTracks({query:'  MARE  '}).length,2);
 assert.equal(filterTracks({query:'CLARA'}).length,2);
 assert.equal(filterTracks({query:'missing'}).length,0);
 assert.equal(filterTracks({view:'favorites'}).length,0);
 assert.deepEqual(filterTracks({view:'favorites',favorites:[2],query:'casa'}).map(t=>t.id),[2]);
 assert.equal(filterTracks({album:'Maré baixa'}).length,2);
 for(const [playlist,data] of Object.entries(playlists))assert.deepEqual(filterTracks({playlist}).map(t=>t.id).sort(),[...data.ids].sort());
});
test('local audio files match the declared duration and are playable PCM WAV',async()=>{
 for(const track of tracks){
 const data=await readFile(`src/entrelinha-music/assets/track-${track.id}.wav`);
 assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');
 assert.equal(data.readUInt16LE(20),1); // PCM
 const bytesPerSecond=data.readUInt32LE(28);
 assert.equal(data.readUInt32LE(40)/bytesPerSecond,track.duration);
 assert.equal(formatTime(track.duration),'0:24');
 }
 assert.equal(formatTime(72),'1:12');
});
