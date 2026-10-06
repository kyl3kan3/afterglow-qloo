import https from 'node:https';
// Native fetch can replay GET on HTTP 421 within one fetch() call. Use one
// ClientRequest instead: no automatic redirects, retry, proxy or pooled socket.
export function singleAttemptFetch(input,options={}){
 return new Promise((resolve,reject)=>{
  let request,timer;const fail=error=>{clearTimeout(timer);reject(error);};
  try{
   request=https.request(input,{method:'GET',headers:{...Object.fromEntries(new Headers(options.headers)),'Accept-Encoding':'identity'},signal:options.signal,agent:false},response=>{
    const status=response.statusCode??0;
    if(status>=300&&status<400){response.destroy();return fail(new Error('Afterglow blocked an upstream redirect.'));}
    let size=0;const chunks=[];
    response.on('data',chunk=>{size+=chunk.length;if(size>2*1024*1024){const error=new Error('Qloo response exceeded its size limit.');fail(error);request.destroy(error);return;}chunks.push(chunk);});
    response.on('aborted',()=>fail(new Error('Qloo response was interrupted.')));
    response.on('error',fail);
    response.on('end',()=>{clearTimeout(timer);try{const headers=new Headers();for(const [name,value] of Object.entries(response.headers))if(value!==undefined)headers.set(name,Array.isArray(value)?value.join(', '):value);resolve(new Response([204,205,304].includes(status)?null:Buffer.concat(chunks),{status,headers}));}catch(error){fail(error);}});
   });
   request.on('error',fail);
   timer=setTimeout(()=>request.destroy(new Error('Qloo request timed out.')),20000);
   request.end();
  }catch(error){fail(error);}
 });
}
// Preloaded only in the official harness child. One reserved CLI invocation may
// make at most one HTTP attempt, to the exact hackathon origin.
export function guardedFetch(fetchImpl){
 let attempted=false;
 return async(input,options={})=>{
  const url=new URL(typeof input==='string'||input instanceof URL?input:input.url);
  const method=options.method??input?.method??'GET';
  if(attempted||url.origin!=='https://hackathon.api.qloo.com'||!['/search','/v2/insights'].includes(url.pathname)||url.username||url.password||method!=='GET')throw new Error('Afterglow blocked an unexpected or repeated upstream attempt.');
  attempted=true;
  return fetchImpl(input,{...options,redirect:'error'});
 };
}
globalThis.fetch=guardedFetch(singleAttemptFetch);
