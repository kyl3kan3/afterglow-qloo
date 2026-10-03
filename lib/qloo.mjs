import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {AppError,validateInput,balanceScore,schedule} from './planner.mjs';
const run=promisify(execFile);
const BASE='https://hackathon.api.qloo.com';
const cli=fileURLToPath(new URL('../node_modules/@qloo/qloo-harness/dist/bin.js',import.meta.url));
export function integrationStatus(env=process.env){return {enabled:env.QLOO_ENABLED==='true'&&Boolean(env.QLOO_API_KEY),provider:'Qloo via @qloo/qloo-harness 0.1.26',endpoint:BASE};}
export function requestArguments(operation,params){
 if(!['search','insights'].includes(operation))throw new AppError('Unsupported Qloo operation.');
 const required=operation==='insights'?['--type',params['filter.type']]:['--query',params.query];
 return [cli,'api',operation,...required,'--params',JSON.stringify(params),'--json'];
}
export function extractEntities(data){
 const entities=Array.isArray(data)?data:(Array.isArray(data?.results)?data.results:data?.results?.entities??data?.entities??data?.data?.entities);
 if(!Array.isArray(entities))throw new AppError('Qloo returned an unexpected response format. No sample results were substituted.',502,'UPSTREAM_FORMAT');
 return entities.filter(e=>e&&typeof e.entity_id==='string'&&typeof e.name==='string');
}
export function createQlooClient({env=process.env,execute=run}={}){
 let requests=0;const cache=new Map();
 return {async request(operation,params){
  if(!integrationStatus(env).enabled)throw new AppError('Live Qloo is not connected. Explore the clearly labeled sample while the server credential is configured.',503,'QLOO_NOT_CONFIGURED');
  if(env.QLOO_BASE_URL && env.QLOO_BASE_URL!==BASE)throw new AppError('This build only supports the approved hackathon Qloo endpoint.',503,'QLOO_ENDPOINT_BLOCKED');
  const key=JSON.stringify([operation,params]),existing=cache.get(key);if(existing&&existing.until>Date.now())return existing.data;
  if(requests>=100)throw new AppError('This server instance has reached its conservative live-request limit. Check the event quota before continuing.',429,'LOCAL_QUOTA');
  requests++;
  try{
   const {stdout}=await execute(process.execPath,requestArguments(operation,params),{timeout:20000,maxBuffer:2*1024*1024,windowsHide:true,env:{PATH:env.PATH??'',HOME:'/tmp/afterglow-qloo-empty-home',QLOO_API_KEY:env.QLOO_API_KEY,QLOO_BASE_URL:BASE,QLOO_TRUSTED_BASE_URL:BASE,NO_COLOR:'1',CI:'true'}});
   const data=JSON.parse(stdout);extractEntities(data);if(cache.size>=50)cache.delete(cache.keys().next().value);cache.set(key,{until:Date.now()+60000,data});return data;
  }catch(error){
   if(error instanceof AppError)throw error;
   const diagnostic=String(error.stderr||error.stdout||error.message||'');
   if(/429|rate.limit|quota/i.test(diagnostic))throw new AppError('Qloo is rate limited. Please wait before trying again; no automatic retry was made.',429,'QLOO_RATE_LIMIT');
   if(/401|403|unauthori|API.key|authenticat/i.test(diagnostic))throw new AppError('Qloo rejected the event credential. Check its access and expiry on the server.',502,'QLOO_AUTH');
   throw new AppError('The Qloo request did not complete. Your tastes are still here; try again when the connection is ready.',502,'QLOO_UNAVAILABLE');
  }
 }};
}
export async function searchQloo(client,query,type){
 if(typeof query!=='string'||query.trim().length<2||query.length>80)throw new AppError('Search with 2–80 characters.');
 if(!['artist','movie','book','person'].includes(type))throw new AppError('Choose music, film, books, or a creator.');
 const result=await client.request('search',{query:query.trim(),types:`urn:entity:${type}`,take:6});
 return {source:'Qloo search',entities:extractEntities(result).map(e=>({id:e.entity_id,name:e.name,kind:e.subtype??type,description:typeof e.properties?.description==='string'?e.properties.description.slice(0,180):''}))};
}
export async function buildLivePlan(raw,client){
 const input=validateInput({...raw,mode:'live'});
 const params={'filter.type':'urn:entity:place','filter.location.query':input.location,'filter.location.radius':0,'filter.price_level.max':input.budget<90?1:input.budget<160?2:3,take:20};
 // Two independent taste queries keep each person's public cultural signals visible.
 const responses=await Promise.all(input.people.map(ids=>client.request('insights',{...params,'signal.interests.entities':ids.join(',')})));
 const lists=responses.map(extractEntities),byId=new Map();
 lists.forEach((list,p)=>list.forEach((e,i)=>{
  const existing=byId.get(e.entity_id)??{entity:e,ranks:[null,null],affinity:[null,null]};
  existing.ranks[p]=i+1;const affinity=e.query?.affinity??e.affinity;existing.affinity[p]=typeof affinity==='number'?affinity:null;byId.set(e.entity_id,existing);
 }));
 const candidates=[...byId.values()].filter(v=>v.ranks.every(Boolean)).map(({entity:e,ranks,affinity},i)=>{
  const scores=ranks.map((r,p)=>Math.round(100*(lists[p].length-r+1)/lists[p].length));
  const tags=(Array.isArray(e.tags)?e.tags:[]).map(t=>typeof t==='string'?t:t.name??'').filter(Boolean).slice(0,5);
  return {id:e.entity_id,name:e.name,category:'discovery',label:tags[0]||'Qloo place recommendation',tags,cost:null,minutes:60,area:typeof e.properties?.address==='string'?e.properties.address:input.location,x:25+(i%3)*23,y:65-Math.floor(i/3)*10,description:typeof e.properties?.description==='string'?e.properties.description.slice(0,280):'A place returned for both sets of cultural interests. Check venue details before making plans.',scores,score:balanceScore(...scores),qlooRanks:ranks,qlooAffinity:affinity};
 }).sort((a,b)=>b.score-a.score);
 if(candidates.length<3)throw new AppError('Qloo found fewer than three shared places. Try broader cultural interests or a different city. No fictional stops were added.',422,'NO_SHARED_RESULTS');
 return {id:crypto.randomUUID(),mode:'live',input,title:'Find your common ground',stops:schedule(candidates.slice(0,3),input.startTime),candidates,cost:null,score:Math.round(candidates.slice(0,3).reduce((sum,v)=>sum+v.score,0)/3),source:'Qloo place results · Afterglow route interpretation',trace:[{step:'Explore',detail:'Fetched separate Qloo place recommendations for two sets of public cultural signals'},{step:'Intersect',detail:`Found ${candidates.length} places returned for both profiles`},{step:'Balance',detail:'Ranked shared places using the lower of the two list-rank indices'},{step:'Compose',detail:'Suggested three stops for you to review; no booking or travel-time check'}],warnings:['Qloo describes aggregate cultural affinity, not individual compatibility or predicted enjoyment.','Scores are Afterglow list-rank indices, not Qloo probabilities. Vibe is a planning note in live mode; it is not sent as an invented Qloo filter.','The budget sets a restaurant price-tier ceiling only. Total prices, availability, opening hours, route geography and travel times are unverified. Times are suggested.']};
}
