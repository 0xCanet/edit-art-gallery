import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const files=readdirSync('dist').filter(file=>file.endsWith('.js')).map(file=>`dist/${file}`);
for(const file of [...files,'tests.mjs']) {
  const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}
const tests=spawnSync(process.execPath,['tests.mjs'],{stdio:'inherit'});
if(tests.status!==0)process.exit(tests.status||1);
console.log('Application syntax and tests passed.');
