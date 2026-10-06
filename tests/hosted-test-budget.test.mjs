import test from 'node:test';import assert from 'node:assert/strict';
import {reserveHostedTestRequest,reservationScript} from '../lib/hosted-test-budget.mjs';
const env={QLOO_TEST_REDIS_URL:'https://fixture.upstash.io',QLOO_TEST_REDIS_TOKEN:'fixture-not-a-credential',QLOO_TEST_BUDGET_ID:'fixture-approval'};
test('shared-store contract uses one atomic reservation and sends no Qloo credential',async()=>{
 let calls=0;const result=await reserveHostedTestRequest({env:{...env,QLOO_API_KEY:'fixture-qloo-value'},fetchImpl:async(url,options)=>{calls++;assert.equal(url,'https://fixture.upstash.io/');assert.equal(options.redirect,'error');assert.deepEqual(JSON.parse(options.body),['EVAL',reservationScript,1,'afterglow:qloo:test:fixture-approval']);assert.ok(!JSON.stringify(options).includes('fixture-qloo-value'));return new Response(JSON.stringify({result:[1,3,10]}));}});assert.deepEqual(result,{used:3,remaining:7});assert.equal(calls,1);
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
