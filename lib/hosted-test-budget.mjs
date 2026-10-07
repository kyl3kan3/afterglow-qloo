// Shared-store adapter for a separately approved, protected preview test.
import {AppError} from './planner.mjs';
export const reservationScript=`
local cap = tonumber(redis.call('HGET', KEYS[1], 'cap'))
local used = tonumber(redis.call('HGET', KEYS[1], 'used'))
local expires = tonumber(redis.call('HGET', KEYS[1], 'expires'))
if not cap or not used or not expires or cap < 1 or cap > 10 or cap ~= math.floor(cap) or used < 0 or used ~= math.floor(used) then return {0, 'invalid'} end
local now = tonumber(redis.call('TIME')[1])
if expires <= now or used >= cap then return {0, 'exhausted'} end
local reserved = redis.call('HINCRBY', KEYS[1], 'used', 1)
return {1, reserved, cap}
`;
// For a separately approved one-time setup only; never called by a request.
export const initializationScript=`
if redis.call('EXISTS', KEYS[1]) ~= 0 then return 0 end
local cap = tonumber(ARGV[1])
local expires = tonumber(ARGV[2])
if not cap or cap < 1 or cap > 10 or cap ~= math.floor(cap) or not expires or expires <= tonumber(redis.call('TIME')[1]) then return 0 end
redis.call('HSET', KEYS[1], 'cap', cap, 'used', 0, 'expires', expires)
return 1
`;
const unavailable=()=>new AppError('Shared test quota could not be reserved. No Qloo request was sent.',503,'SHARED_BUDGET_UNAVAILABLE');
export function hostedTestConfiguration(env=process.env){
 let url;
 try{url=new URL(env.QLOO_TEST_REDIS_URL);}catch{return null;}
 if(url.protocol!=='https:'||!/^[-a-z0-9]+\.upstash\.io$/.test(url.hostname)||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash||!env.QLOO_TEST_REDIS_TOKEN||!/^[-a-zA-Z0-9_]{1,80}$/.test(env.QLOO_TEST_BUDGET_ID??''))return null;
 return {url};
}
export async function reserveHostedTestRequest({env=process.env,fetchImpl=fetch}={}){
 const config=hostedTestConfiguration(env);if(!config)throw unavailable();const {url}=config;
 try{
  const response=await fetchImpl(url.href,{method:'POST',redirect:'error',signal:AbortSignal.timeout(3000),headers:{Authorization:`Bearer ${env.QLOO_TEST_REDIS_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',reservationScript,1,`afterglow:qloo:test:${env.QLOO_TEST_BUDGET_ID}`])});
  if(!response.ok)throw unavailable();
  const text=await response.text();if(text.length>4096)throw unavailable();const payload=JSON.parse(text),r=payload.result;
  if(payload.error||!Array.isArray(r))throw unavailable();
  if(r[0]===0&&r[1]==='exhausted')throw new AppError('Shared test quota is exhausted or expired. No Qloo request was sent.',429,'TEST_BUDGET_EXHAUSTED');
  if(r[0]!==1||!Number.isInteger(r[1])||!Number.isInteger(r[2])||r[2]<1||r[2]>10||r[1]<1||r[1]>r[2])throw unavailable();
  return {used:r[1],remaining:r[2]-r[1]};
 }catch(error){if(error instanceof AppError)throw error;throw unavailable();}
}
