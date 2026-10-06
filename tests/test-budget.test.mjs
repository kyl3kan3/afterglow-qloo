import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {spawn} from 'node:child_process';import {execFile} from 'node:child_process';import {promisify} from 'node:util';
import {initializeTestBudget,inspectTestBudget,reserveTestRequest} from '../lib/test-budget.mjs';
import {createQlooClient,integrationStatus,requestArguments} from '../lib/qloo.mjs';
const root=mkdtempSync(join(tmpdir(),'afterglow-budget-'));test.after(()=>rmSync(root,{recursive:true,force:true}));let n=0;
function budget(limit=10){const path=join(root,`${++n}.sqlite`);initializeTestBudget(path,{limit,expiresAt:new Date(Date.now()+60000).toISOString(),approvalId:'test-fixture-only'});return path;}
const env=path=>({QLOO_ENABLED:'true',QLOO_API_KEY:'fixture-not-a-credential',QLOO_TEST_LEDGER:path});
const response={stdout:'[]'};
test('budget persists across clients and restarts, counts failed calls, and never resets on init',async()=>{
 const path=budget(2);const a=createQlooClient({env:env(path),access:'stdio',execute:async()=>{throw new Error('timeout');}});
 await assert.rejects(()=>a.request('search',{query:'first'}),e=>e.code==='QLOO_UNAVAILABLE');
 const b=createQlooClient({env:env(path),access:'stdio',execute:async()=>response});await b.request('search',{query:'second'});
 const c=createQlooClient({env:env(path),access:'stdio',execute:async()=>{assert.fail('must not execute');}});
 await assert.rejects(()=>c.request('search',{query:'third'}),e=>e.code==='TEST_BUDGET_EXHAUSTED');assert.equal(inspectTestBudget(path).used,2);
 assert.throws(()=>initializeTestBudget(path,{limit:10,expiresAt:new Date(Date.now()+60000).toISOString(),approvalId:'new'}),e=>e.code==='EEXIST');
});
test('twenty competing OS processes can reserve only ten requests',async()=>{
 const path=budget(),module=fileURLToPath(new URL('../lib/test-budget.mjs',import.meta.url));
 const outcomes=await Promise.all(Array.from({length:20},()=>new Promise((resolve,reject)=>{const p=spawn(process.execPath,['--input-type=module','-e',`import {reserveTestRequest} from ${JSON.stringify(module)};try{reserveTestRequest(process.argv[1]);process.exit(0)}catch{process.exit(2)}`,path],{stdio:'ignore'});p.on('error',reject);p.on('exit',resolve);})));assert.equal(outcomes.filter(c=>c===0).length,10);assert.equal(inspectTestBudget(path).used,10);
});
test('missing, corrupt and expired budgets fail closed without subprocesses',async()=>{
 const missing=join(root,'missing.sqlite'),corrupt=join(root,'corrupt.sqlite');writeFileSync(corrupt,'invalid');
 for(const path of [missing,corrupt]){const c=createQlooClient({env:env(path),access:'stdio',execute:async()=>assert.fail()});await assert.rejects(()=>c.request('search',{}),e=>e.code==='TEST_BUDGET_UNAVAILABLE');}
 const path=budget();const {DatabaseSync}=await import('node:sqlite');const db=new DatabaseSync(path);db.exec('UPDATE budget SET expires=1');db.close();assert.throws(()=>reserveTestRequest(path),e=>e.code==='TEST_BUDGET_EXHAUSTED');
});
test('public, Vercel and production contexts cannot spend even with every live flag set',async()=>{
 const path=budget();for(const [access,extra] of [['http',{}],['stdio',{VERCEL:'1'}],['stdio',{VERCEL_ENV:'preview'}],['stdio',{NODE_ENV:'production'}]]){let calls=0;const configured={...env(path),...extra};const c=createQlooClient({env:configured,access,execute:async()=>{calls++;return response;}});assert.equal(integrationStatus(configured,{access}).enabled,false);await assert.rejects(()=>c.request('search',{}),e=>e.code==='PUBLIC_LIVE_DISABLED');assert.equal(calls,0);}assert.equal(inspectTestBudget(path).used,0);
});
test('cache hits and invalid operations consume no additional reservations',async()=>{
 const path=budget(),c=createQlooClient({env:env(path),access:'stdio',execute:async()=>response});await c.request('search',{query:'same'});await c.request('search',{query:'same'});await assert.rejects(()=>c.request('delete',{}));assert.equal(inspectTestBudget(path).used,1);
});
test('harness guard rejects redirects and a second attempt without sending them',async()=>{
 const {guardedFetch}=await import('../lib/harness-fetch-guard.mjs');let calls=0;const fetch=guardedFetch(async(_url,options)=>{calls++;assert.equal(options.redirect,'error');return {};});
 await assert.rejects(()=>fetch('https://unapproved.example/search'));await fetch('https://hackathon.api.qloo.com/search');await assert.rejects(()=>fetch('https://hackathon.api.qloo.com/search'));assert.equal(calls,1);
});
function transportFixture(path,record,status=200){
 const body=status===200?{results:[{entity_id:'fixture',name:'Fixture entity'}]}:{message:`${status} fixture error`};
 writeFileSync(path,`import https from 'node:https';import {EventEmitter} from 'node:events';import {Readable} from 'node:stream';import {writeFileSync} from 'node:fs';let calls=0;https.request=(url,options,callback)=>{writeFileSync(${JSON.stringify(record)},JSON.stringify({calls:++calls,origin:new URL(url).origin,agent:options.agent}));const req=new EventEmitter();req.end=()=>queueMicrotask(()=>{const res=Readable.from([Buffer.from(${JSON.stringify(JSON.stringify(body))})]);res.statusCode=${status};res.headers={'content-type':'application/json'};callback(res);});req.destroy=error=>queueMicrotask(()=>req.emit('error',error));return req;};`);
}
async function runFixture(fixture){return promisify(execFile)(process.execPath,['--import',fixture,...requestArguments('search',{query:'Nina Simone',take:1})],{env:{PATH:process.env.PATH,HOME:root,QLOO_API_KEY:'fixture-not-a-credential',QLOO_BASE_URL:'https://hackathon.api.qloo.com',QLOO_TRUSTED_BASE_URL:'https://hackathon.api.qloo.com'},timeout:20000});}
test('installed official API harness uses one HTTPS request against a no-network fixture',async()=>{
 const fixture=join(root,'https-fixture.mjs'),record=join(root,'attempts.json');transportFixture(fixture,record);
 const {stdout}=await runFixture(fixture);assert.match(stdout,/Fixture entity/);assert.deepEqual(JSON.parse(readFileSync(record)),{calls:1,origin:'https://hackathon.api.qloo.com',agent:false});
});
test('installed harness rejects redirects and never retries 421, 429 or 5xx at the HTTPS transport boundary',async()=>{
 for(const status of [302,421,429,503]){const fixture=join(root,`error-${status}.mjs`),record=join(root,`attempts-${status}.json`);transportFixture(fixture,record,status);await assert.rejects(()=>runFixture(fixture),e=>e.code===5&&e.stdout.includes(status===302?'blocked an upstream redirect':String(status))&&!`${e.stderr}${e.stdout}`.includes('fixture-not-a-credential'));assert.equal(JSON.parse(readFileSync(record)).calls,1);}
});
