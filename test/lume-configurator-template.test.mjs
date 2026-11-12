import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { listTemplateDirectories, templateArea } from '../scripts/showcase-lib.mjs';

const root = new URL('../src/lume-configurator/', import.meta.url);
test('Lume is discoverable with a local preview and valid asset links', async () => {
  const entry = (await listTemplateDirectories()).find(t => t.slug === 'lume-configurator');
  assert.equal(entry.name, 'Lume Studio');
  assert.equal(templateArea(entry), 'Design e decoração');
  assert.ok(entry.previewHref.endsWith('/preview.svg'));
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (link.startsWith('#')) assert.ok(html.includes(`id="${link.slice(1)}"`));
    else await access(new URL(link, root));
  }
});

test('configuration updates price, view limits, export and reset', async () => {
  const elements = new Map();
  const values = {color:'oliva', material:'aluminio', base:'circular'};
  const make = () => ({ textContent:'', style:{}, attrs:{}, handlers:{}, disabled:false,
    setAttribute(k,v){this.attrs[k]=v;}, addEventListener(k,fn){this.handlers[k]=fn;},
    click(){this.handlers.click?.({});}, remove(){}, setPointerCapture(){},
  });
  const get = id => {if (!elements.has(id)) elements.set(id,make()); return elements.get(id);};
  get('options').reset = () => Object.assign(values,{color:'oliva',material:'aluminio',base:'circular'});
  const paints = [make(),make()]; const stops = [make(),make(),make()];
  let download, exported, revoked = false;
  const context = {
    document: {getElementById:get, querySelectorAll:selector=>selector === '.paint' ? paints : stops,
      createElement:()=>{ download=make(); return download; }, body:{append(){}}},
    FormData: class {get(k){return values[k];}}, Intl, Blob,
    URL: {createObjectURL(blob){exported=blob;return 'blob:local';},revokeObjectURL(){revoked=true;}},
    setTimeout(fn){fn();},
  };
  vm.runInNewContext(await readFile(new URL('assets/main.js',root),'utf8'),context);
  assert.match(get('price').textContent,/189/);
  Object.assign(values,{color:'terracota',material:'latao',base:'oval'});
  get('options').handlers.change();
  assert.match(get('price').textContent,/244/);
  assert.match(get('summary').textContent,/Terracota · Latão escovado · Oval/);
  assert.equal(paints[0].attrs.fill,'#c36e52');
  for(let i=0;i<12;i++) get('zoom-in').click();
  assert.equal(get('zoom-label').textContent,'140%');
  assert.equal(get('zoom-in').disabled,true);
  get('rotate-right').click();
  assert.match(get('angle-label').textContent,/30°/);
  get('light').click(); assert.equal(get('light').attrs['aria-pressed'],'false');
  get('export').click();
  assert.equal(download.download,'lume-arco-configuracao.txt');
  assert.match(await exported.text(),/Latão escovado/);
  assert.match(await exported.text(),/244/);
  assert.ok(revoked);
  get('reset').click();
  assert.match(get('price').textContent,/189/);
  assert.equal(get('zoom-label').textContent,'100%');
  assert.equal(get('light').attrs['aria-pressed'],'true');
  context.URL.createObjectURL = () => {throw new Error('Unavailable');};
  get('export').click();
  assert.match(get('status').textContent,/Não foi possível guardar/);
});
