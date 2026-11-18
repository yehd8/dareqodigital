import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import vm from 'node:vm';
const failures=[];let count=0;
function scan(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','dist','.openai'].includes(entry.name))continue;const path=join(dir,entry.name);if(entry.isDirectory()){scan(path);continue;}if(!/\.(html|js|css|json|sql)$/.test(path))continue;const text=readFileSync(path,'utf8');if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:ghp_|github_pat_|sb_secret_)[A-Za-z0-9_]{15,}/.test(text))failures.push(`${path}: possible private credential`);if(path.endsWith('.js'))new vm.Script(text,{filename:path});if(!path.endsWith('.html'))continue;count++;for(const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/src=|ld\+json/.test(m[1]))continue;new vm.Script(m[2],{filename:path});}for(const m of text.matchAll(/(?:href|src)="([^"#]+)"/g)){const target=m[1].split(/[?#]/)[0];if(/^(https?:|mailto:|tel:|data:|javascript:|\/)/.test(target))continue;if(!existsSync(resolve(dirname(path),target)))failures.push(`${path}: missing local target ${target}`);}}
}
scan('.');if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`Syntax, local-link and credential-pattern checks passed across ${count} HTML pages.`);
