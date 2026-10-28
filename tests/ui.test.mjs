import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{JSDOM}from'jsdom';import{buildSamplePlan}from'../lib/planner.mjs';import{tastes,vibes}from'../public/catalog.js';import{scheduleStops}from'../public/schedule-stops.js';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8'),script=(await readFile(new URL('../public/app.js',import.meta.url),'utf8')).replace("import {tastes,vibes} from './catalog.js';",'').replace("import {scheduleStops} from './schedule-stops.js';",'');
const wait=()=>new Promise(r=>setTimeout(r,15));
const loadApp=w=>w.eval(`const scheduleStops=${scheduleStops.toString()};${script}`);
function setup({liveEnabled=false,searchResponse}={}){const dom=new JSDOM(html,{url:'http://localhost:4177',runScripts:'outside-only'}),w=dom.window;w.tastes=tastes;w.vibes=vibes;w.structuredClone=structuredClone;w.AbortController=AbortController;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.fetch=async(url,opts)=>{if(url==='/api/status')return{ok:true,json:async()=>({enabled:liveEnabled})};if(url.startsWith('/api/search')&&searchResponse)return searchResponse(url,opts);try{return{ok:true,json:async()=>buildSamplePlan(JSON.parse(opts.body))};}catch(e){return{ok:false,json:async()=>({error:e.message})};}};loadApp(w);return {dom,w,doc:w.document,click:s=>w.document.querySelector(s).click()};}
test('UI initial rendering, honest mode disclosure and missing integration',async()=>{const {w,doc,click}=setup();await wait();assert.equal(doc.querySelectorAll('.stop-card').length,3);assert.match(doc.querySelector('#sample-note').textContent,/fictional/);click('#source-button');assert.ok(doc.querySelector('#about-dialog').open);assert.equal(doc.querySelector('#use-live').disabled,true);assert.match(doc.querySelector('#connection-status').textContent,/not connected/);w.close();});
test('UI add/remove, save/open, swap and save revision flows',async()=>{const {w,doc,click}=setup();await wait();click('.add-taste');click('[data-taste="nature"]');assert.match(doc.querySelector('#tastes-a').textContent,/Mary Oliver/);click('#taste-dialog .close-dialog');click('[data-remove="nature"]');assert.doesNotMatch(doc.querySelector('#tastes-a').textContent,/Mary Oliver/);click('#save-plan');click('#saved-tab');assert.equal(doc.querySelectorAll('.saved-card').length,1);click('[data-open]');const old=doc.querySelector('.stop-card h4').textContent;click('[data-swap="0"]');click('.alternative');assert.notEqual(doc.querySelector('.stop-card h4').textContent,old);const changed=doc.querySelector('.stop-card h4').textContent;assert.match(doc.querySelector('#save-plan').textContent,/Save changes/);click('#save-plan');assert.match(doc.querySelector('#save-plan').textContent,/Saved/);click('#saved-tab');click('[data-open]');assert.equal(doc.querySelector('.stop-card h4').textContent,changed);assert.equal(JSON.parse(w.localStorage.getItem('afterglow.saved.v1')).length,1);w.close();});
test('UI cannot select more than five tastes',async()=>{const {w,doc,click}=setup();await wait();click('.add-taste');click('[data-taste="nature"]');click('[data-taste="pop"]');click('[data-taste="food"]');assert.equal(doc.querySelector('#count-a').textContent,'5 / 5');assert.match(doc.querySelector('#toast').textContent,/Five/);w.close();});

test('both live profile choosers reuse recent Qloo candidates after one search',async t=>{
 const entities=[{id:'00000000-0000-0000-0000-000000000001',name:'Fixture artist A',kind:'artist'},{id:'00000000-0000-0000-0000-000000000002',name:'Fixture artist B',kind:'artist'}];
 let searches=0;
 const {w,doc,click}=setup({liveEnabled:true,searchResponse:async()=>{searches++;return{ok:true,json:async()=>({entities})};}});
 t.after(()=>w.close());await wait();click('#source-button');click('#use-live');click('.add-taste[data-person="0"]');
 assert.equal(doc.querySelectorAll('#taste-options button').length,0);
 doc.querySelector('#taste-search').value='Fixture artist';click('#search-button');await wait();
 assert.equal(searches,1);assert.equal(doc.querySelectorAll('#taste-options button').length,2);click(`[data-taste="${entities[0].id}"]`);
 click('#taste-dialog .close-dialog');click('.add-taste[data-person="1"]');
 assert.match(doc.querySelector('#search-feedback').textContent,/Recent Qloo search results/);assert.equal(doc.querySelectorAll('#taste-options button').length,2);
 assert.equal(doc.querySelector(`[data-taste="${entities[0].id}"]`).getAttribute('aria-pressed'),'false');click(`[data-taste="${entities[1].id}"]`);
 assert.match(doc.querySelector('#tastes-a').textContent,/Fixture artist A/);assert.match(doc.querySelector('#tastes-b').textContent,/Fixture artist B/);
 assert.equal(doc.querySelector('#count-a').textContent,'1 / 5');assert.equal(doc.querySelector('#count-b').textContent,'1 / 5');
 click('#taste-dialog .close-dialog');click('.add-taste[data-person="0"]');
 assert.equal(doc.querySelector(`[data-taste="${entities[0].id}"]`).getAttribute('aria-pressed'),'true');assert.equal(doc.querySelector(`[data-taste="${entities[1].id}"]`).getAttribute('aria-pressed'),'false');
 assert.match(doc.querySelector('#search-feedback').textContent,/Recent Qloo search results/);assert.equal(searches,1);
 click('#taste-dialog .close-dialog');click('#source-button');click('#use-sample');await wait();click('.add-taste[data-person="0"]');
 assert.equal(doc.querySelector('#search-feedback').textContent,'');assert.equal(doc.querySelector('[data-taste="jazz"]')!==null,true);assert.doesNotMatch(doc.querySelector('#taste-options').textContent,/Fixture artist/);assert.equal(searches,1);
});

test('reopened taste dialog ignores an earlier search and permits a new search',async t=>{
 const pending=[];
 const {w,doc,click}=setup({liveEnabled:true,searchResponse:()=>new Promise(resolve=>pending.push(resolve))});
 t.after(()=>w.close());await wait();click('#source-button');click('#use-live');click('.add-taste[data-person="0"]');
 doc.querySelector('#taste-search').value='First artist';click('#search-button');assert.equal(doc.querySelector('#search-button').disabled,true);
 click('#taste-dialog .close-dialog');click('.add-taste[data-person="1"]');assert.equal(doc.querySelector('#search-button').disabled,false);
 doc.querySelector('#taste-search').value='Second artist';click('#search-button');assert.equal(pending.length,2);
 pending[0]({ok:true,json:async()=>({entities:[{id:'fixture-old',name:'Old search result',kind:'artist'}]})});await wait();
 assert.equal(doc.querySelectorAll('#taste-options button').length,0);assert.equal(doc.querySelector('#search-button').disabled,true);assert.match(doc.querySelector('#search-feedback').textContent,/Searching Qloo/);
 pending[1]({ok:true,json:async()=>({entities:[{id:'fixture-current',name:'Current search result',kind:'artist'}]})});await wait();
 assert.equal(doc.querySelector('#search-button').disabled,false);assert.match(doc.querySelector('#taste-options').textContent,/Current search result/);assert.doesNotMatch(doc.querySelector('#taste-options').textContent,/Old search result/);
 click('[data-taste="fixture-current"]');assert.equal(doc.querySelector('#count-a').textContent,'0 / 5');assert.equal(doc.querySelector('#count-b').textContent,'1 / 5');
 click('#taste-dialog .close-dialog');click('.add-taste[data-person="0"]');assert.match(doc.querySelector('#search-feedback').textContent,/Recent Qloo search results/);assert.equal(doc.querySelectorAll('#taste-options button').length,1);assert.match(doc.querySelector('#taste-options').textContent,/Current search result/);assert.doesNotMatch(doc.querySelector('#taste-options').textContent,/Old search result/);assert.equal(pending.length,2);
});
test('UI invalid profile displays error and preserves old itinerary',async()=>{const {w,doc,click}=setup();await wait();const before=doc.querySelector('.result-title').textContent;while(doc.querySelector('#tastes-a button'))doc.querySelector('#tastes-a button').click();doc.querySelector('#date-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await wait();assert.equal(doc.querySelector('#form-error').classList.contains('hidden'),false);assert.match(doc.querySelector('#form-error').textContent,/one and five/);assert.equal(doc.querySelector('.result-title').textContent,before);assert.equal(doc.querySelector('#generate').disabled,false);w.close();});

test('UI waits for a plan completing after two slow sequential upstream calls',async t=>{
 const {w,doc}=setup();t.after(()=>w.close());await wait();
 const timers=new Map();let now=0,nextTimer=0,complete,signal;
 w.setTimeout=(callback,delay)=>{const id=++nextTimer;timers.set(id,{callback,at:now+delay});return id;};w.clearTimeout=id=>timers.delete(id);
 w.fetch=(_url,options)=>new Promise((resolve,reject)=>{signal=options.signal;signal.addEventListener('abort',()=>reject(Object.assign(new Error('Fixture abort'),{name:'AbortError'})),{once:true});complete=()=>resolve({ok:true,json:async()=>({...buildSamplePlan(JSON.parse(options.body)),title:'Slow fixture completed'})});});
 doc.querySelector('#date-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 // Two 20s upstream operations plus two 3s shared-store checks can reach 46s.
 now=46000;for(const [id,timer] of timers)if(timer.at<=now){timers.delete(id);timer.callback();}
 assert.equal(signal.aborted,false);complete();await wait();
 assert.equal(doc.querySelector('.result-title').textContent,'Slow fixture completed');assert.equal(doc.querySelector('#form-error').classList.contains('hidden'),true);assert.equal(doc.querySelector('#generate').disabled,false);assert.equal(timers.size,0);
});
test('UI $50 budget submission and no fabricated cost overrun',async()=>{const {w,doc}=setup();await wait();doc.querySelector('#budget').value='50';doc.querySelector('#budget').dispatchEvent(new w.Event('input'));doc.querySelector('#date-form').dispatchEvent(new w.Event('submit',{cancelable:true}));await wait();assert.equal(doc.querySelector('#budget-value').textContent,'$50');assert.ok(Number(doc.querySelector('.budget-summary strong').textContent.slice(1))<=50);w.close();});
test('UI save removal exposes empty state',async()=>{const {w,doc,click}=setup();await wait();click('#save-plan');click('#saved-tab');click('[data-delete]');assert.equal(doc.querySelectorAll('.saved-card').length,0);assert.ok(doc.querySelector('.empty-saved'));assert.equal(w.localStorage.getItem('afterglow.saved.v1'),'[]');w.close();});
test('UI original plan explanations do not change with unsent form edits',async()=>{const {w,doc,click}=setup();await wait();const before=doc.querySelector('.why-box').textContent;while(doc.querySelector('#tastes-a button'))doc.querySelector('#tastes-a button').click();click('#save-plan');assert.equal(doc.querySelector('.why-box').textContent,before);w.close();});
test('untrusted display content is escaped in place cards',async()=>{const {w,doc,click}=setup();await wait();click('#save-plan');const saved=JSON.parse(w.localStorage.getItem('afterglow.saved.v1'));saved[0].title='<img src=x onerror=alert(1)>';w.localStorage.setItem('afterglow.saved.v1',JSON.stringify(saved));loadApp(w);await wait();click('#saved-tab');assert.equal(doc.querySelectorAll('#saved-list img').length,0);assert.match(doc.querySelector('#saved-list').textContent,/<img/);w.close();});
