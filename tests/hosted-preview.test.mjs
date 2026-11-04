import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {createApi} from '../lib/http.mjs';
import {createMcpHttpHandler} from '../lib/mcp.mjs';
import {createQlooClient,integrationStatus} from '../lib/qloo.mjs';
import {protectedPreviewOrigin} from '../lib/preview-access.mjs';

const env={VERCEL:'1',VERCEL_ENV:'preview',VERCEL_URL:'afterglow-qloo-fixture.vercel.app',AFTERGLOW_PROTECTED_PREVIEW:'true',QLOO_ENABLED:'true',QLOO_API_KEY:'fixture-not-a-credential',QLOO_TEST_REDIS_URL:'https://fixture.upstash.io',QLOO_TEST_REDIS_TOKEN:'fixture-not-a-credential',QLOO_TEST_BUDGET_ID:'fixture-approval'};
const entities=[1,2,3].map(i=>({entity_id:`10000000-0000-0000-0000-00000000000${i}`,name:`Fixture ${i}`}));
const input={mode:'live',people:[['00000000-0000-0000-0000-000000000001'],['00000000-0000-0000-0000-000000000002']],budget:140,vibe:'intimate',location:'New York City',startTime:'18:00'};
function fixture({limit=10,used=0,configuration=env}={}){
 let reservations=used,executions=0;
 const fetchImpl=async(_url,options)=>{
  const command=JSON.parse(options.body);
  assert.equal(command.length,5);assert.equal(command[3],`afterglow:qloo:test:${configuration.QLOO_TEST_BUDGET_ID}`);
  const expected=Number(command[4]);
  const result=expected!==limit?[0,'cap-mismatch']:reservations>=limit?[0,'exhausted']:[1,++reservations,limit];
  return new Response(JSON.stringify({result}));
 };
 const execute=async()=>{executions++;return {stdout:JSON.stringify(entities)};};
 return {env:configuration,client:()=>createQlooClient({env:configuration,fetchImpl,execute}),counts:()=>({reservations,executions})};
}
test('preview requires every explicit gate and production stays blocked',()=>{
 assert.equal(integrationStatus(env).enabled,true);
 assert.equal(integrationStatus(env).maxTestRequests,10);
 assert.equal(integrationStatus({...env,QLOO_TEST_APPROVED_CAP:'100'}).maxTestRequests,100);
 for(const change of [{VERCEL:undefined},{VERCEL_ENV:'production'},{VERCEL_ENV:'development'},{AFTERGLOW_PROTECTED_PREVIEW:'false'},{VERCEL_URL:'other-app.vercel.app'},{VERCEL_URL:'afterglow-qloo-fixture.vercel.app:443'},{VERCEL_URL:'afterglow-qloo-fixture.vercel.app.attacker.example'},{QLOO_TEST_REDIS_TOKEN:undefined},{QLOO_TEST_BUDGET_ID:undefined},{QLOO_TEST_REDIS_URL:'https://unapproved.example'},{QLOO_TEST_APPROVED_CAP:'101'}])assert.equal(integrationStatus({...env,...change}).enabled,false);
 assert.equal(protectedPreviewOrigin(env),`https://${env.VERCEL_URL}`);
 assert.equal(integrationStatus({...env,VERCEL:undefined,VERCEL_ENV:undefined,QLOO_TEST_LEDGER:'/fixture'},{access:'stdio'}).enabled,false,'a configured shared test cannot fall back to a separate SQLite ledger');
});
test('independent preview clients reserve before execution and share the same ten-call fixture cap',async()=>{
 const f=fixture();const results=await Promise.allSettled(Array.from({length:20},(_,i)=>f.client().request('search',{query:`Fixture ${i}`})));
 assert.equal(results.filter(r=>r.status==='fulfilled').length,10);assert.deepEqual(f.counts(),{reservations:10,executions:10});
});

test('configured hundred-request hosted cap preserves one spent slot across competing clients',async()=>{
 const f=fixture({limit:100,used:1,configuration:{...env,QLOO_TEST_APPROVED_CAP:'100'}});
 const results=await Promise.allSettled(Array.from({length:110},(_,i)=>f.client().request('search',{query:`Fixture ${i}`})));
 assert.equal(results.filter(r=>r.status==='fulfilled').length,99);
 assert.ok(results.filter(r=>r.status==='rejected').every(r=>r.reason.code==='TEST_BUDGET_EXHAUSTED'));
 assert.deepEqual(f.counts(),{reservations:100,executions:99});
});

test('hosted runtime and stored cap mismatches never reserve or execute Qloo',async()=>{
 for(const [limit,configuration] of [[10,{...env,QLOO_TEST_APPROVED_CAP:'100'}],[100,env]]){
  const f=fixture({limit,used:1,configuration});
  await assert.rejects(()=>f.client().request('search',{query:'Fixture'}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE');
  assert.deepEqual(f.counts(),{reservations:1,executions:0});
 }
});
test('shared quota failure prevents harness execution, and failed harness attempts keep their slot',async()=>{
 let attempts=0;const broken=createQlooClient({env,fetchImpl:async()=>{throw new Error('fixture failure');},execute:async()=>assert.fail('must not execute')});
 await assert.rejects(()=>broken.request('search',{query:'Fixture'}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE');
 const failed=createQlooClient({env:{...env,QLOO_TEST_APPROVED_CAP:'1'},fetchImpl:async()=>new Response(JSON.stringify({result:++attempts===1?[1,1,1]:[0,'exhausted']})),execute:async()=>{throw new Error('fixture timeout');}});
 await assert.rejects(()=>failed.request('search',{query:'first'}),e=>e.code==='QLOO_UNAVAILABLE');
 await assert.rejects(()=>failed.request('search',{query:'second'}),e=>e.code==='TEST_BUDGET_EXHAUSTED');assert.equal(attempts,2);
});
async function serverFor(f){
 const env=f.env;
 const api=createApi({env,client:f.client()}),mcp=createMcpHttpHandler({env,client:f.client()});
 const server=http.createServer((req,res)=>req.url==='/api/mcp'?mcp(req,res):api(req,res));
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 return {base:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(r=>server.close(r))};
}
// Native HTTP preserves the explicit Host fixture; fetch rewrites Host to the
// loopback address, which would make the success case fail for the wrong reason.
async function fixtureFetch(url,options){
 const request=new Request(url,options),body=Buffer.from(await request.arrayBuffer());
 return new Promise((resolve,reject)=>{
  const req=http.request(request.url,{method:request.method,headers:Object.fromEntries(request.headers)},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve(new Response(res.statusCode===204?null:Buffer.concat(chunks),{status:res.statusCode,headers:res.headers})));});
  req.on('error',reject);req.end(body);
 });
}
test('HTTP and MCP reject aliases, localhost, ports, forwarded hosts and foreign origins before quota use',async()=>{
 const f=fixture(),s=await serverFor(f);
 try{
  for(const extra of [{host:'afterglow-qloo.vercel.app'},{host:'localhost'},{host:`${env.VERCEL_URL}:443`},{host:'unapproved.example','x-forwarded-host':env.VERCEL_URL},{origin:'https://unapproved.example'},{origin:`http://${env.VERCEL_URL}`},{'sec-fetch-site':'cross-site'}]){
   const headers={host:env.VERCEL_URL,...extra};
   const api=await fixtureFetch(`${s.base}/api/search?q=Fixture&type=artist`,{headers});assert.equal(api.status,403);
   const mcp=await fixtureFetch(`${s.base}/api/mcp`,{method:'POST',headers,body:'{}'});assert.equal(mcp.status,403);
  }
  assert.deepEqual(f.counts(),{reservations:0,executions:0});
 }finally{await s.close();}
});
test('valid preview HTTP search, plan and actual MCP tool calls use the same reservation path',async()=>{
 const f=fixture(),s=await serverFor(f),headers={host:env.VERCEL_URL,origin:`https://${env.VERCEL_URL}`};
 const c=new Client({name:'preview-fixture',version:'1.0.0'});
 try{
  const search=await fixtureFetch(`${s.base}/api/search?q=Fixture&type=artist`,{headers});assert.equal(search.status,200);
  const plan=await fixtureFetch(`${s.base}/api/plan`,{method:'POST',headers,body:JSON.stringify(input)});assert.equal(plan.status,200);assert.equal((await plan.json()).mode,'live');
  await c.connect(new StreamableHTTPClientTransport(new URL(`${s.base}/api/mcp`),{requestInit:{headers},fetch:fixtureFetch}));
  const result=await c.callTool({name:'afterglow_plan_evening',arguments:input});assert.equal(result.structuredContent.mode,'live');
  assert.deepEqual(f.counts(),{reservations:5,executions:5});
 }finally{await c.close();await s.close();}
});

test('MCP discovery and status report the configured hosted maximum without spending quota',async()=>{
 const f=fixture({limit:100,used:1,configuration:{...env,QLOO_TEST_APPROVED_CAP:'100'}}),s=await serverFor(f);
 const headers={host:env.VERCEL_URL,origin:`https://${env.VERCEL_URL}`},c=new Client({name:'cap-status-fixture',version:'1.0.0'});
 try{
  await c.connect(new StreamableHTTPClientTransport(new URL(`${s.base}/api/mcp`),{requestInit:{headers},fetch:fixtureFetch}));
  const tools=await c.listTools(),statusTool=tools.tools.find(tool=>tool.name==='afterglow_status');
  assert.match(statusTool.description,/100-request maximum/);assert.match(statusTool.description,/public production live is disabled/);
  const status=await c.callTool({name:'afterglow_status',arguments:{}});
  assert.equal(status.structuredContent.maxTestRequests,100);assert.equal(status.structuredContent.enabled,true);
  assert.deepEqual(f.counts(),{reservations:1,executions:0});
 }finally{await c.close();await s.close();}
});
