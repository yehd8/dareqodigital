import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('../request-form.js',import.meta.url),'utf8');
function setup(fetchImpl,valid=true,language="en"){
 class Element{setAttribute(k,v){this[k]=v}removeAttribute(k){delete this[k]}}
 class Form extends Element{reportValidity(){return valid}addEventListener(_,fn){this.submit=fn}reset(){this.resetCalled=true}}
 class Button extends Element{disabled=false}
 const form=new Form(),msg=new Element(),button=new Button();let calls=0;
 const fields={customer_name:'QA Example',phone:'+96100000000',service:'Website'};
 const context={document:{querySelector:s=>({'#requestForm':form,'#requestMsg':msg,'#requestSubmit':button,'#lang':{value:language}}[s])},HTMLFormElement:Form,HTMLElement:Element,HTMLButtonElement:Button,FormData:class{get(k){return fields[k]}},AbortController,setTimeout,clearTimeout,fetch:async(...args)=>{calls++;return fetchImpl(...args)}};
 vm.runInNewContext(source,context);
 return {form,msg,button,fields,calls:()=>calls,submit:()=>form.submit({preventDefault(){}})};
}
test('success sends expected payload and clears form',async()=>{let payload;const s=setup(async(_,options)=>{payload=JSON.parse(options.body);return {ok:true}});await s.submit();assert.equal(payload.p_service,'Website');assert.equal(payload.p_email,null);assert.equal(s.form.resetCalled,true);assert.equal(s.button.disabled,false);assert.match(s.msg.textContent,/Request sent/)});
test('network rejection preserves details and restores submit',async()=>{const s=setup(async()=>{throw Error('offline')});await s.submit();assert.equal(s.form.resetCalled,undefined);assert.equal(s.button.disabled,false);assert.match(s.msg.textContent,/could not confirm delivery/);assert.equal(s.form['aria-busy'],undefined)});
test('HTTP errors preserve details',async()=>{const s=setup(async()=>({ok:false}));await s.submit();assert.equal(s.form.resetCalled,undefined);assert.match(s.msg.className,/err/)});
test('invalid native fields never send',async()=>{const s=setup(async()=>({ok:true}),false);await s.submit();assert.equal(s.calls(),0)});
test('whitespace-only required values never send',async()=>{const s=setup(async()=>({ok:true}));s.fields.customer_name='  ';await s.submit();assert.equal(s.calls(),0)});
test('repeated submission during pending request is ignored',async()=>{let finish;const s=setup(()=>new Promise(resolve=>{finish=resolve}));const pending=s.submit();await s.submit();assert.equal(s.calls(),1);finish({ok:true});await pending;assert.equal(s.button.disabled,false)});

test('Arabic network feedback follows the selected language',async()=>{const s=setup(async()=>({ok:false}),true,'ar');await s.submit();assert.match(s.msg.textContent,/لم نتمكن/);assert.equal(s.button.disabled,false)});
