import test from 'node:test';
import assert from 'node:assert/strict';
import {createPerIpRateLimiter} from '../lib/ip-rate-limit.mjs';
import {AppError} from '../lib/planner.mjs';

test('bounded eviction preserves active key limits after map floods above cap',()=>{
 const limit=3;
 const maxKeys=4;
 const assertAllowed=createPerIpRateLimiter({limit,maxKeys,windowMs:60_000,message:'slow down'});
 for(let i=0;i<maxKeys;i++)assertAllowed(`flood-${i}`);
 assertAllowed('active');
 assertAllowed('active');
 for(let i=maxKeys;i<maxKeys+maxKeys-1;i++)assertAllowed(`flood-${i}`);
 assertAllowed('active');
 assert.throws(()=>assertAllowed('active'),(err)=>{
  assert.ok(err instanceof AppError);
  assert.equal(err.status,429);
  return true;
 });
 for(let i=0;i<30;i++){
  try{assertAllowed(`tail-${i}`);}catch{/* at limit on some keys */}
 }
 assert.ok(assertAllowed.mapSize()<=maxKeys);
});

test('eviction drops expired windows before oldest keys',()=>{
 const maxKeys=3;
 const assertAllowed=createPerIpRateLimiter({limit:10,maxKeys,windowMs:5,message:'slow down'});
 assertAllowed('keep');
 assertAllowed('stale-a');
 assertAllowed('stale-b');
 assert.equal(assertAllowed.mapSize(),3);
 const waitUntil=Date.now()+10;
 while(Date.now()<waitUntil){/* allow windows to expire */}
 assertAllowed('stale-c');
 assertAllowed('stale-d');
 assertAllowed('keep');
 assert.ok(assertAllowed.mapSize()<=maxKeys);
});
