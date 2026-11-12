import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {listTemplateDirectories, templateArea} from '../scripts/showcase-lib.mjs';
const require=createRequire(import.meta.url);
const {cities,searchCities,hourlyFor,weeklyFor,convert}=require('../src/weather-app/assets/main.js');
test('weather catalogue entry and local assets are available',async()=>{
  const entry=(await listTemplateDirectories()).find(t=>t.slug==='weather-app');
  assert.ok(entry);assert.match(entry.name,/Brisa Meteo/);assert.equal(templateArea(entry),'Meteorologia');
  const html=await readFile('src/weather-app/index.html','utf8');
  for(const file of ['assets/main.js','assets/style.css'])assert.ok(html.includes(file));
  assert.match(html,/lang="pt-PT"/);assert.match(html,/DEMO/);
  assert.ok((await readFile('index.html','utf8')).includes('./src/weather-app/index.html'));
});
test('search ignores accents and case; unknown cities give empty result',()=>{
  assert.equal(searchCities('evora')[0].id,'evora');
  assert.equal(searchCities('  ALGARVE ')[0].id,'faro');
  assert.equal(searchCities('').length,cities.length);
  assert.deepEqual(searchCities('Tóquio'),[]);
});
test('unit conversion and forecasts are consistent',()=>{
  assert.equal(convert(0,'F'),32);assert.equal(convert(100,'F'),212);assert.equal(convert(19),19);
  for(const c of cities){
    const h=hourlyFor(c);assert.equal(h.length,24);assert.equal(h[0].temp,c.temp);
    assert.ok(h.every(x=>Number.isFinite(x.temp)&&x.rain>=0&&x.rain<=100));
    const w=weeklyFor(c);assert.equal(w.length,7);assert.equal(w[0].label,'Hoje');
    assert.ok(w.every(d=>d.max>d.min));
  }
});
