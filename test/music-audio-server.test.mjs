import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('catalogue serves seekable WAV audio with valid ranges and unchanged static pages',async t=>{
 const server=spawn(process.execPath,['scripts/showcase-server.mjs'],{env:{...process.env,PORT:'0',HOST:'127.0.0.1'},stdio:['ignore','pipe','pipe']});
 t.after(()=>server.kill());
 const url=await new Promise((resolve,reject)=>{
  let output='';
  const timeout=setTimeout(()=>reject(new Error('Server startup timed out')),5000);
  server.on('error',error=>{clearTimeout(timeout);reject(error);});
  server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timeout);resolve(match[0]);}});
  server.on('exit',code=>{clearTimeout(timeout);reject(new Error(`Server exited ${code}`));});
 });
 const audio=`${url}/src/entrelinha-music/assets/track-0.wav`;
 const full=await fetch(audio);assert.equal(full.status,200);assert.equal(full.headers.get('content-type'),'audio/wav');
 const data=Buffer.from(await full.arrayBuffer());
 for(const [range,start,end] of [['bytes=0-43',0,43],['bytes=100-',100,data.length-1],['bytes=-20',data.length-20,data.length-1]]){
  const result=await fetch(audio,{headers:{Range:range}});assert.equal(result.status,206);
  assert.equal(result.headers.get('content-range'),`bytes ${start}-${end}/${data.length}`);
  assert.deepEqual(Buffer.from(await result.arrayBuffer()),data.subarray(start,end+1));
 }
 for(const range of ['bytes=9999999-','bytes=20-10','bytes=-','bytes=-0']){
  const result=await fetch(audio,{headers:{Range:range}});assert.equal(result.status,416);await result.arrayBuffer();
 }
 const head=await fetch(audio,{method:'HEAD',headers:{Range:'bytes=0-43'}});assert.equal(head.status,206);assert.equal((await head.arrayBuffer()).byteLength,0);
 const html=await fetch(`${url}/src/entrelinha-music/index.html`);assert.equal(html.status,200);assert.match(await html.text(),/Entrelinha/);
 server.kill();await once(server,'exit');
});
