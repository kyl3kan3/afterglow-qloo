import {AppError} from './planner.mjs';

/** Per-process rolling window: 6 requests per client key per minute by default. */
export function createPerIpRateLimiter({limit=6,windowMs=60000,message}={}){
 const rate=new Map();
 return function assertAllowed(address){
  const key=address??'instance';
  const now=Date.now();
  const entry=rate.get(key)??{count:0,reset:now+windowMs};
  if(entry.reset<now){entry.count=0;entry.reset=now+windowMs;}
  entry.count++;
  if(rate.size>1000)rate.clear();
  rate.set(key,entry);
  if(entry.count>limit)throw new AppError(message,429);
 };
}

export function createLivePlanRateLimiter(){
 return createPerIpRateLimiter({message:'Please wait a minute before making more live plans.'});
}

export function createSearchRateLimiter(){
 return createPerIpRateLimiter({message:'Please wait a minute before making more searches.'});
}
