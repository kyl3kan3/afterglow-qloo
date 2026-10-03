import {AppError,buildSamplePlan,validateInput} from './planner.mjs';
import {createQlooClient,integrationStatus,searchQloo,buildLivePlan} from './qloo.mjs';
export const securityHeaders={'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"};
export function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...securityHeaders});res.end(JSON.stringify(data));}
async function readBody(req){
 if(req.body!==undefined){if(typeof req.body==='string'){if(req.body.length>12000)throw new AppError('Request is too large.',413);try{return JSON.parse(req.body);}catch{throw new AppError('Send valid JSON.');}}return req.body;}
 let size=0,body='';for await(const chunk of req){size+=chunk.length;if(size>12000)throw new AppError('Request is too large.',413);body+=chunk;}
 try{return JSON.parse(body);}catch{throw new AppError('Send valid JSON.');}
}
export function createApi({env=process.env,client=createQlooClient({env})}={}){
 const rate=new Map();
 return async function(req,res,override){
  try{
   const url=new URL(req.url,'http://localhost'),path=override??url.pathname;
   if(req.headers['sec-fetch-site']==='cross-site')throw new AppError('Cross-site requests are not supported.',403,'CROSS_SITE');
   if(path==='/api/status'&&req.method==='GET')return json(res,200,{...integrationStatus(env),sampleAvailable:true});
   if(path==='/api/plan'&&req.method==='POST'){
    const body=validateInput(await readBody(req));if(body.mode!=='live')return json(res,200,buildSamplePlan(body));
    const address=req.socket?.remoteAddress??'instance',now=Date.now(),entry=rate.get(address)??{count:0,reset:now+60000};if(entry.reset<now){entry.count=0;entry.reset=now+60000;}entry.count++;if(rate.size>1000)rate.clear();rate.set(address,entry);if(entry.count>6)throw new AppError('Please wait a minute before making more live plans.',429);
    return json(res,200,await buildLivePlan(body,client));
   }
   if(path==='/api/search'&&req.method==='GET')return json(res,200,await searchQloo(client,url.searchParams.get('q'),url.searchParams.get('type')));
   return json(res,404,{error:'That endpoint does not exist.',code:'NOT_FOUND'});
  }catch(error){return json(res,error instanceof AppError?error.status:500,{error:error instanceof AppError?error.message:'Something went wrong. Please try again.',code:error instanceof AppError?error.code:'INTERNAL'});}
 };
}
