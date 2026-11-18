import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
try{
 for(const width of [375,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  await context.route('**/*.supabase.co/**',route=>route.abort());
  for(const path of ['/','/web-design-lebanon.html','/business-management-system-lebanon.html','/local-seo-lebanon.html']){
   const page=await context.newPage();await page.goto(base+path,{waitUntil:'networkidle'});
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   const row={path,width,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incompleteCount:result.incomplete.length};
   report.push(row);await page.close();
  }
  await context.close();
 }
}finally{await browser.close();mkdirSync('qa-results',{recursive:true});writeFileSync('qa-results/accessibility.json',JSON.stringify(report,null,2))}
console.log(JSON.stringify({checks:report.length,violations:report.filter(r=>r.violations.length)},null,2));
if(report.some(r=>r.violations.length))process.exitCode=1;
