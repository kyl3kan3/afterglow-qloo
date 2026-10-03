import {mkdir,cp} from 'node:fs/promises';await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});console.log('Built static client in dist/; serverless routes are in api/.');
