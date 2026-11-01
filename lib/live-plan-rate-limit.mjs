import {AppError} from './planner.mjs';

/** Per-process live plan throttle: 6 requests per client key per rolling minute. */
export function createLivePlanRateLimiter(){
 const rate=new Map();
 return function assertLivePlanAllowed(address){
  const key=address??'instance';
  const now=Date.now();
  const entry=rate.get(key)??{count:0,reset:now+60000};
  if(entry.reset<now){entry.count=0;entry.reset=now+60000;}
  entry.count++;
  if(rate.size>1000)rate.clear();
  rate.set(key,entry);
  if(entry.count>6)throw new AppError('Please wait a minute before making more live plans.',429);
 };
}
