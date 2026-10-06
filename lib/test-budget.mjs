import {DatabaseSync} from 'node:sqlite';
import {closeSync,lstatSync,openSync} from 'node:fs';
import {isAbsolute} from 'node:path';
import {AppError} from './planner.mjs';

const unavailable=()=>new AppError('The isolated test budget is missing or unavailable. No Qloo request was sent.',503,'TEST_BUDGET_UNAVAILABLE');
function checkPath(path){if(typeof path!=='string'||!isAbsolute(path))throw unavailable();}
function connect(path){
 checkPath(path);
 // Never recreate missing state, follow a symlink, or fall back to memory.
 if(!lstatSync(path).isFile()||lstatSync(path).isSymbolicLink())throw unavailable();
 const db=new DatabaseSync(path,{timeout:3000,allowExtension:false});
 db.exec('PRAGMA synchronous=FULL; PRAGMA trusted_schema=OFF;');
 return db;
}
export function initializeTestBudget(path,{limit,expiresAt,approvalId}){
 checkPath(path);const expires=Date.parse(expiresAt);
 if(!Number.isInteger(limit)||limit<1||limit>10||!Number.isFinite(expires)||expires<=Date.now()||typeof approvalId!=='string'||!approvalId.trim()||approvalId.length>120)throw new Error('Use a limit from 1 to 10, a future ISO expiry and a non-secret approval reference.');
 // Exclusive creation prevents a second init from resetting spent quota.
 closeSync(openSync(path,'wx',0o600));
 const db=connect(path);
 try{
  db.exec('CREATE TABLE budget(id INTEGER PRIMARY KEY CHECK(id=1), cap INTEGER NOT NULL CHECK(cap BETWEEN 1 AND 10), used INTEGER NOT NULL CHECK(used BETWEEN 0 AND cap), expires INTEGER NOT NULL, approval TEXT NOT NULL);');
  db.prepare('INSERT INTO budget VALUES(1,?,0,?,?)').run(limit,expires,approvalId);
 }finally{db.close();}
 return inspectTestBudget(path);
}
export function inspectTestBudget(path){
 let db;try{db=connect(path);const row=db.prepare('SELECT cap,used,expires,approval FROM budget WHERE id=1').get();if(!row||row.cap<1||row.cap>10||row.used<0||row.used>row.cap)throw unavailable();return{limit:row.cap,used:row.used,remaining:row.cap-row.used,expiresAt:new Date(row.expires).toISOString(),approvalId:row.approval};}catch{throw unavailable();}finally{db?.close();}
}
export function reserveTestRequest(path){
 let db;
 try{
  db=connect(path);
  // A single committed SQLite write reserves quota before any subprocess starts.
  // Every process must share this one database on a durable local filesystem.
  const row=db.prepare('UPDATE budget SET used=used+1 WHERE id=1 AND cap BETWEEN 1 AND 10 AND used>=0 AND used<cap AND expires>? RETURNING used,cap').get(Date.now());
  if(!row)throw new AppError('The isolated test budget is exhausted or expired. No Qloo request was sent.',429,'TEST_BUDGET_EXHAUSTED');
  return{used:row.used,remaining:row.cap-row.used};
 }catch(error){if(error instanceof AppError)throw error;throw unavailable();}finally{db?.close();}
}
