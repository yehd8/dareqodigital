import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || 'qa-results';
mkdirSync(output,{recursive:true});
const browser = await chromium.launch({...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),headless:true,args:['--no-sandbox']});
const report={base,at:new Date().toISOString(),pages:[],workflows:[],errors:[],failures:[]};
const pages=['/','/web-design-lebanon.html','/business-management-system-lebanon.html','/local-seo-lebanon.html'];
try{
 for(const width of [320,375,768,1024,1440,1920]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  // No test request may reach the production database.
  await context.route('**/*.supabase.co/**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"message":"Synthetic QA failure"}'}));
  for(const path of pages){
   const page=await context.newPage();const errors=[];const failed=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
   page.on('requestfailed',r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
   const response=await page.goto(base+path,{waitUntil:'networkidle'});
   // Load lazy gallery images with actual scrolling.
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=800)await page.evaluate(y=>scrollTo(0,y),y);
   await page.evaluate(()=>scrollTo(0,0));
   const dom=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title,description:document.querySelector('meta[name="description"]')?.getAttribute('content'),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),overflowElements:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width&&r.right>innerWidth+1&&c.position!=='fixed'&&c.visibility!=='hidden'&&c.display!=='none'}).slice(0,6).map(e=>({tag:e.tagName,class:e.className})),navigation:performance.getEntriesByType('navigation').map(n=>({duration:n.duration,domContentLoaded:n.domContentLoadedEventEnd}))}));
   const row={path,width,status:response.status(),...dom,errors,failed};report.pages.push(row);
   if(response.status()!==200||dom.scrollWidth>width||dom.h1!==1||!dom.description||dom.brokenImages.length||errors.length)report.failures.push(row);
   if(path==='/'){
    await page.screenshot({path:`${output}/home-${width}.png`,fullPage:true});
    if (await page.locator('[data-filter]').count()) {
     await page.locator('[data-filter="system"]').click();
     assert.equal(await page.locator('[data-category]:visible').count(),1);
     await page.locator('[data-filter="website"]').click();
     assert.equal(await page.locator('[data-category]:visible').count(),6);
     await page.locator('[data-filter="all"]').click();
     assert.equal(await page.locator('[data-category]:visible').count(),7);
     report.workflows.push({width,filters:'all, websites and systems passed'});
    }
    if(width<=820){
     const toggle=page.getByRole('button',{name:'Open navigation menu'});await toggle.click();
     await page.locator('#mobileMenu .mobileMenuLinks a').last().focus();await page.keyboard.press('Tab');
     assert.equal(await page.evaluate(()=>document.activeElement.id),'mobileMenuClose');
     await page.keyboard.press('Shift+Tab');
     assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#request');
     await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
     assert.equal(await page.evaluate(()=>document.activeElement.id),'menuToggle');
     await toggle.click();await page.locator('#mobileMenu a[href="#request"]').click();
     assert.equal(await toggle.getAttribute('aria-expanded'),'false');
     report.workflows.push({width,menu:'focus cycle, Escape and section navigation passed'});
    }
    await page.locator('#lang').selectOption('ar');
    const rtl=await page.evaluate(()=>({dir:document.documentElement.dir,overflow:document.documentElement.scrollWidth>innerWidth}));assert.equal(rtl.dir,'rtl');assert.equal(rtl.overflow,false);await page.locator('#lang').selectOption('en');
    await page.locator('#requestSubmit').click();assert.equal(await page.locator('input[name="customer_name"]').evaluate(e=>e.validity.valueMissing),true);
    report.workflows.push({width,rtl:'no horizontal overflow',validation:'required name blocks empty submission'});
   }
   await page.close();
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:375,height:900}});let rpcCount=0;
 await context.route('**/*.supabase.co/**',route=>{rpcCount++;return route.fulfill({status:503,contentType:'application/json',body:'{"message":"Synthetic QA failure"}'})});
 const page=await context.newPage();await page.goto(base);
 await page.locator('[name="customer_name"]').fill('QA Example');await page.locator('[name="phone"]').fill('+96100000000');await page.locator('[name="service"]').fill('QA website');
 await page.locator('#requestSubmit').click();await page.getByText('We could not confirm delivery.',{exact:false}).waitFor();assert.equal(await page.locator('#requestSubmit').isEnabled(),true);assert.equal(await page.locator('[name="customer_name"]').inputValue(),'QA Example');assert.equal(rpcCount,1);
 await context.unroute('**/*.supabase.co/**');await context.route('**/*.supabase.co/**',route=>route.fulfill({status:204,body:''}));
 await page.locator('#requestSubmit').click();await page.getByText('Request sent. Dareqo Digital will review it and contact you.',{exact:true}).waitFor();assert.equal(await page.locator('[name="customer_name"]').inputValue(),'');report.workflows.push({form:'mocked HTTP failure preserves input; mocked success clears input'});
 await context.close();
}catch(error){report.errors.push(error.stack);process.exitCode=1}finally{await browser.close();writeFileSync(`${output}/results.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({pages:report.pages.length,workflows:report.workflows.length,failures:report.failures,errors:report.errors},null,2));
if(report.failures.length)process.exitCode=1;
