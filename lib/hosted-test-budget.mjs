// One shared approval counter for a separately approved, protected preview.
import {AppError} from './planner.mjs';
export const DEFAULT_APPROVED_CAP=10,MAX_APPROVED_CAP=100;
export const reservationScript=`
if #KEYS ~= 1 or #ARGV ~= 1 then return {0, 'invalid'} end
local expected = tonumber(ARGV[1])
local cap = tonumber(redis.call('HGET', KEYS[1], 'cap'))
local used = tonumber(redis.call('HGET', KEYS[1], 'used'))
local expires = tonumber(redis.call('HGET', KEYS[1], 'expires'))
if not expected or expected < 1 or expected > ${MAX_APPROVED_CAP} or expected ~= math.floor(expected) or not cap or not used or not expires or cap < 1 or cap > ${MAX_APPROVED_CAP} or cap ~= math.floor(cap) or used < 0 or used > cap or used ~= math.floor(used) or expires < 1 or expires > 9007199254740991 or expires ~= math.floor(expires) then return {0, 'invalid'} end
if cap ~= expected then return {0, 'cap-mismatch'} end
local now = tonumber(redis.call('TIME')[1])
if expires <= now or used >= cap then return {0, 'exhausted'} end
local reserved = redis.call('HINCRBY', KEYS[1], 'used', 1)
return {1, reserved, cap}
`;
// Legacy first-time ten-request setup only; never use to amend existing quota.
// Neither initialization nor the operator amendment below is called by a request.
export const initializationScript=`
if redis.call('EXISTS', KEYS[1]) ~= 0 then return 0 end
local cap = tonumber(ARGV[1])
local expires = tonumber(ARGV[2])
if not cap or cap < 1 or cap > 10 or cap ~= math.floor(cap) or not expires or expires <= tonumber(redis.call('TIME')[1]) then return 0 end
redis.call('HSET', KEYS[1], 'cap', cap, 'used', 0, 'expires', expires)
return 1
`;
// Operator only: compare the reviewed existing state, increase its total cap,
// retain/shorten expiry and append audit metadata. Never writes used or TTL.
// Deployment-specific targets and approval references belong outside source.
export const amendmentScript=`
if #KEYS ~= 1 or #KEYS[1] > 100 or not string.match(KEYS[1], '^afterglow:qloo:test:[-a-zA-Z0-9_]+$') or #ARGV ~= 7 then return {0, 'invalid-arguments'} end
local expectedCap = tonumber(ARGV[1])
local expectedUsed = tonumber(ARGV[2])
local expectedExpires = tonumber(ARGV[3])
local targetCap = tonumber(ARGV[4])
local targetExpires = tonumber(ARGV[5])
local revision = ARGV[6]
local approval = ARGV[7]
if not expectedCap or not expectedUsed or not expectedExpires or not targetCap or not targetExpires or expectedCap < 1 or expectedCap > ${MAX_APPROVED_CAP} or expectedCap ~= math.floor(expectedCap) or expectedUsed < 0 or expectedUsed > expectedCap or expectedUsed ~= math.floor(expectedUsed) or expectedExpires < 1 or expectedExpires > 9007199254740991 or expectedExpires ~= math.floor(expectedExpires) or targetCap < expectedCap or targetCap > ${MAX_APPROVED_CAP} or targetCap ~= math.floor(targetCap) or targetExpires < 1 or targetExpires > expectedExpires or targetExpires ~= math.floor(targetExpires) then return {0, 'invalid-arguments'} end
if #revision < 1 or #revision > 80 or not string.match(revision, '^[-a-zA-Z0-9_]+$') or #approval < 1 or #approval > 200 or string.match(approval, '^%s*$') or string.find(approval, '%c') then return {0, 'invalid-arguments'} end
if redis.call('EXISTS', KEYS[1]) ~= 1 then return {0, 'missing'} end
local cap = tonumber(redis.call('HGET', KEYS[1], 'cap'))
local used = tonumber(redis.call('HGET', KEYS[1], 'used'))
local expires = tonumber(redis.call('HGET', KEYS[1], 'expires'))
if not cap or not used or not expires or cap < 1 or cap > ${MAX_APPROVED_CAP} or cap ~= math.floor(cap) or used < 0 or used > cap or used ~= math.floor(used) or expires < 1 or expires > 9007199254740991 or expires ~= math.floor(expires) then return {0, 'invalid'} end
local auditField = 'amendment:' .. revision
local existing = redis.call('HGET', KEYS[1], auditField)
if existing then
 local ok, audit = pcall(cjson.decode, existing)
 if not ok or type(audit) ~= 'table' or audit.revision ~= revision or audit.approval ~= approval or type(audit.previous) ~= 'table' or audit.previous.cap ~= expectedCap or audit.previous.used ~= expectedUsed or audit.previous.expires ~= expectedExpires or type(audit.target) ~= 'table' or audit.target.cap ~= targetCap or audit.target.expires ~= targetExpires or type(audit.appliedAt) ~= 'number' or audit.appliedAt ~= math.floor(audit.appliedAt) or audit.appliedAt < 1 or audit.appliedAt >= targetExpires then return {0, 'audit-mismatch'} end
 if cap ~= targetCap or used < expectedUsed or expires ~= targetExpires then return {0, 'state-mismatch'} end
 return {1, 'already-amended', used, cap, expires}
end
if cap ~= expectedCap or used ~= expectedUsed or expires ~= expectedExpires then return {0, 'compare-mismatch'} end
local now = tonumber(redis.call('TIME')[1])
if targetExpires <= now then return {0, 'expired'} end
local audit = cjson.encode({revision=revision, approval=approval, previous={cap=cap, used=used, expires=expires}, target={cap=targetCap, expires=targetExpires}, appliedAt=now})
redis.call('HSET', KEYS[1], 'cap', targetCap, 'expires', targetExpires, auditField, audit)
return {1, 'amended', used, targetCap, targetExpires}
`;
// Pure command builder for the owner-operated Redis CLI. Does not execute it.
export function amendmentCommand({key,expectedCap,expectedUsed,expectedExpires,cap,expires,revision,approval}){
 if(typeof key!=='string'||!/^afterglow:qloo:test:[-a-zA-Z0-9_]{1,80}$/.test(key)||!Number.isInteger(expectedCap)||expectedCap<1||expectedCap>MAX_APPROVED_CAP||!Number.isInteger(expectedUsed)||expectedUsed<0||expectedUsed>expectedCap||!Number.isSafeInteger(expectedExpires)||expectedExpires<1||!Number.isInteger(cap)||cap<expectedCap||cap>MAX_APPROVED_CAP||!Number.isSafeInteger(expires)||expires<1||expires>expectedExpires)throw new Error('Use the reviewed existing counter state, a total cap no greater than 100 and an unchanged or earlier expiry.');
 if(typeof revision!=='string'||!/^[-a-zA-Z0-9_]{1,80}$/.test(revision)||typeof approval!=='string'||!approval.trim()||Buffer.byteLength(approval,'utf8')>200||/[\x00-\x1f\x7f]/.test(approval))throw new Error('Use a unique non-secret revision ID and the exact non-secret approval reference.');
 return ['EVAL',amendmentScript,1,key,String(expectedCap),String(expectedUsed),String(expectedExpires),String(cap),String(expires),revision,approval];
}
const unavailable=()=>new AppError('Shared test quota could not be reserved. No Qloo request was sent.',503,'SHARED_BUDGET_UNAVAILABLE');
// The quota store may be configured under the QLOO_TEST_REDIS_* names or the
// provider's own UPSTASH_REDIS_REST_* names; both are read identically.
const redisUrl=env=>env.QLOO_TEST_REDIS_URL??env.UPSTASH_REDIS_REST_URL;
const redisToken=env=>env.QLOO_TEST_REDIS_TOKEN??env.UPSTASH_REDIS_REST_TOKEN;
export function hostedTestConfiguration(env=process.env){
 const rawCap=env.QLOO_TEST_APPROVED_CAP;
 if(rawCap!==undefined&&(typeof rawCap!=='string'||!/^(?:[1-9][0-9]?|100)$/.test(rawCap)))return null;
 const cap=rawCap===undefined?DEFAULT_APPROVED_CAP:Number(rawCap);let url;
 try{url=new URL(redisUrl(env));}catch{return null;}
 if(url.protocol!=='https:'||!/^[-a-z0-9]+\.upstash\.io$/.test(url.hostname)||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash||!redisToken(env)||!/^[-a-zA-Z0-9_]{1,80}$/.test(env.QLOO_TEST_BUDGET_ID??''))return null;
 return {url,cap};
}
export async function reserveHostedTestRequest({env=process.env,fetchImpl=fetch}={}){
 const config=hostedTestConfiguration(env);if(!config)throw unavailable();const {url,cap}=config;
 try{
  const response=await fetchImpl(url.href,{method:'POST',redirect:'error',signal:AbortSignal.timeout(3000),headers:{Authorization:`Bearer ${redisToken(env)}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',reservationScript,1,`afterglow:qloo:test:${env.QLOO_TEST_BUDGET_ID}`,String(cap)])});
  if(!response.ok)throw unavailable();
  const text=await response.text();if(text.length>4096)throw unavailable();const payload=JSON.parse(text),r=payload.result;
  if(payload.error||!Array.isArray(r))throw unavailable();
  if(r[0]===0&&r[1]==='exhausted')throw new AppError('Shared test quota is exhausted or expired. No Qloo request was sent.',429,'TEST_BUDGET_EXHAUSTED');
  if(r.length!==3||r[0]!==1||!Number.isInteger(r[1])||r[2]!==cap||r[1]<1||r[1]>cap)throw unavailable();
  return {used:r[1],remaining:r[2]-r[1]};
 }catch(error){if(error instanceof AppError)throw error;throw unavailable();}
}
