const fs=require('fs');
const key=fs.readFileSync('./pawmartclient321-firebase-adminsdk-fbsvc-454f49385a.json','utf-8');
const base64=Buffer.from(key).toString('base64');
console.log(base64);