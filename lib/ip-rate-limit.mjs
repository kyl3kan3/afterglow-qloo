import {AppError} from './planner.mjs';

const DEFAULT_MAX_KEYS=1000;

function trimRateLimitMap(rate,now,maxKeys,key){
 const addingNew=!rate.has(key);
 const overCap=rate.size>maxKeys||(addingNew&&rate.size>=maxKeys);
 if(!overCap)return;
 for(const [k,entry] of rate){
  if(entry.reset<now)rate.delete(k);
 }
 const target=addingNew?maxKeys-1:maxKeys;
 while(rate.size>target){
  const oldest=rate.keys().next().value;
  if(oldest===undefined)break;
  rate.delete(oldest);
 }
}

/** Per-process rolling window: 6 requests per client key per minute by default. */
export function createPerIpRateLimiter({limit=6,windowMs=60000,message,maxKeys=DEFAULT_MAX_KEYS}={}){
 const rate=new Map();
 function assertAllowed(address){
  const key=address??'instance';
  const now=Date.now();
  const entry=rate.get(key)??{count:0,reset:now+windowMs};
  if(entry.reset<now){entry.count=0;entry.reset=now+windowMs;}
  entry.count++;
  trimRateLimitMap(rate,now,maxKeys,key);
  rate.set(key,entry);
  if(entry.count>limit)throw new AppError(message,429);
 }
 assertAllowed.mapSize=()=>rate.size;
 return assertAllowed;
}

export function createLivePlanRateLimiter(){
 return createPerIpRateLimiter({message:'Please wait a minute before making more live plans.'});
}

export function createSearchRateLimiter(){
 return createPerIpRateLimiter({message:'Please wait a minute before making more searches.'});
}
