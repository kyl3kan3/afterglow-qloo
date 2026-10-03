import { createApi } from '../lib/http.mjs';
const handler=createApi();
export default (req,res)=>handler(req,res,'/api/search');
