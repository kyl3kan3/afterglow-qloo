import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const vercel=JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)),'..','vercel.json'),'utf8'));
const route=vercel.headers?.find(entry=>entry.source==='/(.*)');
if(!route?.headers?.length)throw new Error('vercel.json must define headers for /(.*).');
export const securityHeaders=Object.fromEntries(route.headers.map(({key,value})=>[key,value]));
