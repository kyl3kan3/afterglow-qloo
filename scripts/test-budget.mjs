import {initializeTestBudget,inspectTestBudget} from '../lib/test-budget.mjs';
const [command,path,limit,expiresAt,approvalId]=process.argv.slice(2);
try{
 if(command==='init')console.log(JSON.stringify(initializeTestBudget(path,{limit:Number(limit),expiresAt,approvalId})));
 else if(command==='status')console.log(JSON.stringify(inspectTestBudget(path)));
 else throw new Error('Usage: node scripts/test-budget.mjs init ABSOLUTE_PATH LIMIT ISO_EXPIRY APPROVAL_REFERENCE | status ABSOLUTE_PATH');
}catch(error){console.error(error.code==='EEXIST'?'Budget already exists; initialization cannot reset it.':error.message);process.exitCode=1;}
