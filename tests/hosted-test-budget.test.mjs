import test from 'node:test';import assert from 'node:assert/strict';
import {reserveHostedTestRequest,reservationScript,hostedTestConfiguration,amendmentCommand,amendmentScript} from '../lib/hosted-test-budget.mjs';
const env={QLOO_TEST_REDIS_URL:'https://fixture.upstash.io',QLOO_TEST_REDIS_TOKEN:'fixture-not-a-credential',QLOO_TEST_BUDGET_ID:'fixture-approval'};
test('shared-store contract uses one atomic reservation and sends no Qloo credential',async()=>{
 let calls=0;const result=await reserveHostedTestRequest({env:{...env,QLOO_API_KEY:'fixture-qloo-value'},fetchImpl:async(url,options)=>{calls++;assert.equal(url,'https://fixture.upstash.io/');assert.equal(options.redirect,'error');assert.deepEqual(JSON.parse(options.body),['EVAL',reservationScript,1,'afterglow:qloo:test:fixture-approval','10']);assert.ok(!JSON.stringify(options).includes('fixture-qloo-value'));return new Response(JSON.stringify({result:[1,3,10]}));}});assert.deepEqual(result,{used:3,remaining:7});assert.equal(calls,1);
});

test('hosted approval defaults to ten and requires a canonical explicit cap up to one hundred',async()=>{
 assert.equal(hostedTestConfiguration(env).cap,10);
 for(const cap of ['1','10','100'])assert.equal(hostedTestConfiguration({...env,QLOO_TEST_APPROVED_CAP:cap}).cap,Number(cap));
 for(const cap of ['',null,100,'0','101','-1','1.5','1e2','01',' 100','100 ','Infinity']){
  const invalid={...env,QLOO_TEST_APPROVED_CAP:cap};assert.equal(hostedTestConfiguration(invalid),null);
  await assert.rejects(()=>reserveHostedTestRequest({env:invalid,fetchImpl:async()=>assert.fail('invalid approval must not send')}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE');
 }
});

test('hosted one-hundred cap is bound to the reservation and response including its last slot',async()=>{
 const configured={...env,QLOO_TEST_APPROVED_CAP:'100'};let calls=0;
 const fetchImpl=async(_url,options)=>{calls++;assert.deepEqual(JSON.parse(options.body),['EVAL',reservationScript,1,'afterglow:qloo:test:fixture-approval','100']);return new Response(JSON.stringify({result:[1,100,100]}));};
 assert.deepEqual(await reserveHostedTestRequest({env:configured,fetchImpl}),{used:100,remaining:0});assert.equal(calls,1);
 for(const result of [[0,'cap-mismatch'],[1,2,10],[1,101,100],[1,1,101],[1,1,'100'],[1,1,100,'extra']])await assert.rejects(()=>reserveHostedTestRequest({env:configured,fetchImpl:async()=>new Response(JSON.stringify({result}))}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE');
});

test('exhausted or expired hosted approvals never retry, including at cap one hundred',async()=>{
 let calls=0;await assert.rejects(()=>reserveHostedTestRequest({env:{...env,QLOO_TEST_APPROVED_CAP:'100'},fetchImpl:async()=>{calls++;return new Response(JSON.stringify({result:[0,'exhausted']}));}}),e=>e.code==='TEST_BUDGET_EXHAUSTED');assert.equal(calls,1);
});

test('operator command binds the reviewed existing state and rejects invalid targets or audit references',()=>{
 const fixture={key:'afterglow:qloo:test:fixture-only',expectedCap:10,expectedUsed:1,expectedExpires:1893456000,cap:100,expires:1893369600,revision:'fixture-revision',approval:'fixture-owner-approval'};
 assert.deepEqual(amendmentCommand(fixture),['EVAL',amendmentScript,1,'afterglow:qloo:test:fixture-only','10','1','1893456000','100','1893369600','fixture-revision','fixture-owner-approval']);
 for(const change of [{key:'unapproved-key'},{expectedCap:0},{expectedUsed:-1},{expectedUsed:11},{expectedExpires:Infinity},{cap:9},{cap:101},{expires:0},{expires:1893456001},{expires:1.5}])assert.throws(()=>amendmentCommand({...fixture,...change}));
 for(const revision of ['',null,'space not allowed','x'.repeat(81)])assert.throws(()=>amendmentCommand({...fixture,revision}));
 for(const approval of ['',null,'   ','line\nbreak','x'.repeat(201),'\u00e9'.repeat(101)])assert.throws(()=>amendmentCommand({...fixture,approval}));
});
test('shared-store missing, expired, malformed and over-cap responses fail closed',async()=>{
 for(const result of [[0,'invalid'],[0,'exhausted'],[1,11,10],[1,1,20],[1,-1,10],null])await assert.rejects(()=>reserveHostedTestRequest({env,fetchImpl:async()=>new Response(JSON.stringify({result}))}),e=>['SHARED_BUDGET_UNAVAILABLE','TEST_BUDGET_EXHAUSTED'].includes(e.code));
});
test('shared-store errors never leak credentials or retry uncertain writes',async()=>{
 let calls=0;await assert.rejects(()=>reserveHostedTestRequest({env,fetchImpl:async()=>{calls++;throw new Error(`timeout ${env.QLOO_TEST_REDIS_TOKEN}`);}}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE'&&!e.message.includes(env.QLOO_TEST_REDIS_TOKEN));assert.equal(calls,1);
});
test('unapproved quota URLs are rejected before credential transmission',async()=>{
 for(const url of ['https://evil.example','http://fixture.upstash.io','https://fixture.upstash.io/other','https://fixture.upstash.io?secret=x','https://user:password@fixture.upstash.io'])await assert.rejects(()=>reserveHostedTestRequest({env:{...env,QLOO_TEST_REDIS_URL:url},fetchImpl:async()=>assert.fail('must not send')}),e=>e.code==='SHARED_BUDGET_UNAVAILABLE');
});
