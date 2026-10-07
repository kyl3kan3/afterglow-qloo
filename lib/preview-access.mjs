import {AppError} from './planner.mjs';

// Routing guard only. Vercel Authentication must independently protect this
// deployment before an operator enables the test flag; this is not login proof.
export function protectedPreviewOrigin(env=process.env){
 if(env.VERCEL!=='1'||env.VERCEL_ENV!=='preview'||env.AFTERGLOW_PROTECTED_PREVIEW!=='true')return null;
 const host=env.VERCEL_URL;
 if(typeof host!=='string'||!/^afterglow-qloo-[a-z0-9-]+\.vercel\.app$/.test(host))return null;
 return `https://${host}`;
}
export function assertPreviewRequest(req,env=process.env){
 const origin=protectedPreviewOrigin(env);
 if(!origin)return;
 // Require the platform's unique deployment hostname, never forwarded headers,
 // custom domains, aliases, alternate ports or localhost.
 if(req.headers.host!==env.VERCEL_URL||req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&req.headers.origin!==origin))throw new AppError('This test is available only through its protected preview URL.',403,'PREVIEW_ACCESS_REQUIRED');
}
