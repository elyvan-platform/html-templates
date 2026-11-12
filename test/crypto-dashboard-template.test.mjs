import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {listTemplateDirectories} from '../scripts/showcase-lib.mjs';
const require=createRequire(import.meta.url);
const {assets,selectAssets,seriesFor,portfolio}=require('../src/crypto-dashboard/assets/main.js');
test('crypto catalogue entry and local assets are available',async()=>{
  const entry=(await listTemplateDirectories()).find(t=>t.slug==='crypto-dashboard');
  assert.ok(entry);assert.match(entry.name,/Vértice Crypto/);
  const html=await readFile('src/crypto-dashboard/index.html','utf8');
  for(const file of ['assets/main.js','assets/style.css']){assert.ok(html.includes(file));assert.ok((await readFile(`src/crypto-dashboard/${file}`,'utf8')).length>0);}
  assert.match(html,/lang="pt-PT"/);
});
test('market search, movement, favorites and ordering compose correctly',()=>{
  assert.equal(selectAssets({query:'  BTC '})[0].id,'btc');
  assert.equal(selectAssets({query:'missing'}).length,0);
  assert.ok(selectAssets({movement:'down'}).every(a=>a.change<0));
  assert.deepEqual(selectAssets({watchOnly:true,favorites:new Set()}),[]);
  assert.deepEqual(selectAssets({watchOnly:true,favorites:new Set(['sol']),movement:'up'}).map(a=>a.id),['sol']);
  const sorted=selectAssets({sort:'change'});
  assert.equal(sorted[0].id,'sol');
});
test('portfolio allocation and previous-day variation reconcile',()=>{
  const {holdings,total,change}=portfolio();
  assert.equal(holdings.length,4);
  assert.ok(Math.abs(holdings.reduce((s,a)=>s+a.value/total,0)-1)<1e-10);
  const previous=holdings.reduce((s,a)=>s+a.value/(1+a.change/100),0);
  assert.ok(Math.abs((total/previous-1)*100-change)<1e-10);
});
test('all chart periods contain finite prices and end at the displayed quote',()=>{
  for(const asset of assets)for(const period of ['1D','1S','1M','1A']){
    const values=seriesFor(asset,period);
    assert.equal(values.length,25);assert.ok(values.every(v=>Number.isFinite(v)&&v>0));
    assert.ok(Math.abs(values.at(-1)-asset.price)<1e-8);
    assert.equal(Math.sign(values.at(-1)-values[0]),Math.sign(asset.change));
  }
  assert.notDeepEqual(seriesFor(assets[0],'1D'),seriesFor(assets[0],'1M'));
});
