import {AppError,buildSamplePlan,validateInput} from './planner.mjs';
import {createQlooClient,integrationStatus,searchQloo,buildLivePlan} from './qloo.mjs';
import {assertPreviewRequest} from './preview-access.mjs';
import {readJsonBody} from './json-body.mjs';
import {securityHeaders} from './security-headers.mjs';
export {securityHeaders};
export function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...securityHeaders});res.end(JSON.stringify(data));}
export function createApi({env=process.env,client=createQlooClient({env})}={}){
 const rate=new Map();
 return async function(req,res,override){
  try{
   assertPreviewRequest(req,env);
   const url=new URL(req.url,'http://localhost'),path=override??url.pathname;
   if(req.headers['sec-fetch-site']==='cross-site')throw new AppError('Cross-site requests are not supported.',403,'CROSS_SITE');
   if(path==='/api/status'&&req.method==='GET')return json(res,200,{...integrationStatus(env),sampleAvailable:true});
   if(path==='/api/plan'&&req.method==='POST'){
    const body=validateInput(await readJsonBody(req));if(body.mode!=='live')return json(res,200,buildSamplePlan(body));
    const address=req.socket?.remoteAddress??'instance',now=Date.now(),entry=rate.get(address)??{count:0,reset:now+60000};if(entry.reset<now){entry.count=0;entry.reset=now+60000;}entry.count++;if(rate.size>1000)rate.clear();rate.set(address,entry);if(entry.count>6)throw new AppError('Please wait a minute before making more live plans.',429);
    return json(res,200,await buildLivePlan(body,client));
   }
   if(path==='/api/search'&&req.method==='GET')return json(res,200,await searchQloo(client,url.searchParams.get('q'),url.searchParams.get('type')));
   return json(res,404,{error:'That endpoint does not exist.',code:'NOT_FOUND'});
  }catch(error){return json(res,error instanceof AppError?error.status:500,{error:error instanceof AppError?error.message:'Something went wrong. Please try again.',code:error instanceof AppError?error.code:'INTERNAL'});}
 };
}
