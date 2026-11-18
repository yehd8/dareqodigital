import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../studio.js',import.meta.url),'utf8');
const copy=JSON.parse(script.match(/^const STUDIO_COPY=(.*);\n/)[1]);
test('Arabic and Arabizi cover every translated homepage element',()=>{
 const keys=[...html.matchAll(/data-t="([^"]+)"/g)].map(m=>m[1]);
 for(const language of ['ar','az'])for(const key of keys)assert.ok(typeof copy[language][key]==='string'&&copy[language][key].trim(),`${language}: ${key}`);
});
test('public site links to the sample manager rather than the owner workspace',()=>{
 assert.ok(html.includes('href="business-manager-demo/"'));
 assert.ok(!/href="(?:\.\/)?(?:manager|document)\.html/.test(html));
});
