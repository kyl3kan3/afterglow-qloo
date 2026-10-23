import {AppError} from './planner.mjs';
const MAX_BYTES=12000;
export async function readJsonBody(req,{objectBody='as-is'}={}){
 if(req.body!==undefined){
  if(typeof req.body==='string'){
   if(req.body.length>MAX_BYTES)throw new AppError('Request is too large.',413);
   try{return JSON.parse(req.body);}catch{throw new AppError('Send valid JSON.');}
  }
  if(objectBody==='as-is')return req.body;
  const serialized=JSON.stringify(req.body);
  if(serialized.length>MAX_BYTES)throw new AppError('Request is too large.',413);
  try{return JSON.parse(serialized);}catch{throw new AppError('Send valid JSON.');}
 }
 let size=0,body='';
 for await(const chunk of req){size+=chunk.length;if(size>MAX_BYTES)throw new AppError('Request is too large.',413);body+=chunk;}
 try{return JSON.parse(body);}catch{throw new AppError('Send valid JSON.');}
}
