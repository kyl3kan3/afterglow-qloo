import { tastes, venues, vibes } from '../public/catalog.js';
export class AppError extends Error { constructor(message,status=400,code='INVALID_INPUT'){super(message);this.status=status;this.code=code;} }
export function validateInput(body) {
 if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AppError('Send a date-night request.');
 const mode=body.mode??'sample'; if(!['sample','live'].includes(mode)) throw new AppError('Choose sample or live mode.');
 const people=body.people;
 if(!Array.isArray(people)||people.length!==2||people.some(p=>!Array.isArray(p)||p.length<1||p.length>5||p.some(id=>typeof id!=='string'||id.length>100)))throw new AppError('Choose between one and five tastes for each person.');
 if(mode==='sample' && people.flat().some(id=>!tastes.some(t=>t.id===id)))throw new AppError('That sample taste is not in our catalog.');
 if(mode==='live' && people.flat().some(id=>!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)))throw new AppError('Select verified Qloo search results for both people.');
 const budget=Number(body.budget); if(!Number.isInteger(budget)||budget<50||budget>250)throw new AppError('Choose a budget between $50 and $250 for two.');
 const vibe=body.vibe; if(!Object.hasOwn(vibes,vibe))throw new AppError('Choose one of the available vibes.');
 const location=body.location??'New York City'; if(typeof location!=='string'||location.trim().length<2||location.length>100)throw new AppError('Enter a city, up to 100 characters.');
 if(mode==='sample' && location!=='New York City')throw new AppError('The fictional sample is set in New York City. Live mode supports other cities.');
 const startTime=body.startTime??'18:00'; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime))throw new AppError('Choose a valid start time.');
 return {mode,people:people.map(p=>[...new Set(p)]),budget,vibe,location:location.trim(),startTime};
}
export function balanceScore(a,b) { return Math.round((Math.min(a,b)*0.7+(a+b)/2*0.3)*100)/100; }
function tasteFit(person,venue) {
 const tags=new Set(person.flatMap(id=>tastes.find(t=>t.id===id)?.tags??[]));
 return Math.round(25+75*venue.tags.filter(t=>tags.has(t)).length/venue.tags.length);
}
export function rankSample(input) {
 return venues.map(v=>{const scores=input.people.map(p=>tasteFit(p,v));return {...v,scores,score:balanceScore(...scores)+(v.tags.includes(input.vibe)?8:0)};}).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
export function candidatePlans(candidates,budget,exclude=[]) {
 const pools=['dinner','activity','finale'].map(c=>candidates.filter(v=>v.category===c&&!exclude.includes(v.id)));
 const combos=[];for(const a of pools[0])for(const b of pools[1])for(const c of pools[2]){const cost=a.cost+b.cost+c.cost;if(cost<=budget)combos.push({stops:[a,b,c],cost,score:a.score+b.score+c.score});}
 return combos.sort((a,b)=>b.score-a.score||a.cost-b.cost);
}
export function schedule(stops,startTime) {
 let minutes=Number(startTime.slice(0,2))*60+Number(startTime.slice(3));
 return stops.map((s,i)=>{const dayOffset=Math.floor(minutes/1440);const time=`${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;minutes+=s.minutes+(i<stops.length-1?15:0);return {...s,time,dayOffset};});
}
export function buildSamplePlan(raw) {
 const input=validateInput({...raw,mode:'sample'}),ranked=rankSample(input),plans=candidatePlans(ranked,input.budget);
 if(!plans.length)throw new AppError('No complete sample itinerary fits that budget. Try a higher budget.',422,'NO_RESULTS');
 const best=plans[0];return {id:crypto.randomUUID(),mode:'sample',input,title:{intimate:'A night in the in-between',creative:'A little out of the ordinary',playful:'Follow your playful side',relaxed:'An evening without a rush'}[input.vibe],stops:schedule(best.stops,input.startTime),candidates:ranked,cost:best.cost,score:Math.round(best.stops.reduce((s,v)=>s+balanceScore(...v.scores),0)/3),source:'Fictional sample catalog · local scoring',trace:[{step:'Understand',detail:`Balanced ${input.people[0].length} + ${input.people[1].length} sample taste signals`},{step:'Explore',detail:`Scored ${ranked.length} fictional places for both people`},{step:'Balance',detail:'Weighted the lower taste-fit score to keep both people in the picture'},{step:'Compose',detail:`Compared ${plans.length} three-stop routes within the sample budget`}],warnings:['All venues and costs are fictional examples. Times and map are illustrative.','Sample scores are a local ranking index, not Qloo output or a prediction about either person.']};
}
