(function(){
 const style=document.createElement('style');
 style.textContent=`
 .modalbox{position:relative}
 .modalhead{position:sticky;top:0;z-index:60;background:#0e1b2c;padding:8px 0 10px;margin-top:-8px;border-bottom:1px solid transparent}
 .modalbox:has(.modalhead){scroll-padding-top:78px}
 .modalhead .close{flex:0 0 auto;position:sticky;top:8px;z-index:65;box-shadow:0 4px 14px #0005}
 .project-table-compact th,.project-table-compact td{padding:11px 9px}
 .project-table-compact th:nth-child(n+4),.project-table-compact td:nth-child(n+4){white-space:nowrap;width:1%}
 .project-table-compact th:first-child,.project-table-compact td:first-child{min-width:220px}
 .project-table-compact th:nth-child(2),.project-table-compact td:nth-child(2){min-width:150px}
 .deposit-action{cursor:pointer;display:inline-block;transition:transform .12s ease,filter .12s ease}
 .deposit-action:hover{transform:translateY(-1px);filter:brightness(1.12)}
 .payment-flash{animation:paymentFlash 1.1s ease}
 @keyframes paymentFlash{0%,100%{box-shadow:none}35%{box-shadow:0 0 0 3px #5b7cff88}}
 @media(max-width:900px){.project-table-compact th,.project-table-compact td{padding:10px 8px}.project-table-compact th:first-child,.project-table-compact td:first-child{min-width:190px}}
 `;
 document.head.appendChild(style);

 function depInfo(p){
   const agreed=Number(p.agreed_price||0),pct=Number(p.deposit_percent??50),required=agreed*pct/100,paid=paidForProject(p.id),remaining=remainingForProject(p);
   if(agreed<=0)return {label:'No price',cls:''};
   if(remaining<=0)return {label:'Paid in Full',cls:'deposit-paid'};
   if(paid<=0)return {label:'Deposit Due '+money(required),cls:'deposit-due'};
   if(paid+0.001<required)return {label:'Deposit '+money(paid)+'/'+money(required),cls:'deposit-partial'};
   return {label:'Deposit Paid',cls:'deposit-paid'};
 }
 function daysUntil(date){if(!date)return null;const a=new Date();a.setHours(0,0,0,0);const b=new Date(date+'T00:00:00');return Math.round((b-a)/86400000)}
 function due(date){const d=daysUntil(date);if(d===null)return '—';if(d<0)return `<span class="pill due-overdue">${Math.abs(d)}d overdue</span>`;if(d===0)return '<span class="pill due-overdue">Due today</span>';if(d<=3)return `<span class="pill due-soon">Due in ${d}d</span>`;return `<span class="muted">${esc(date)}</span>`}

 projectTable=function(list){
   list=(list||[]).filter(x=>!x.archived_at);
   if(!list.length)return '<div class="empty">No projects yet.</div>';
   return '<div class="tablewrap"><table class="project-table-compact"><thead><tr><th>Project</th><th>Customer</th><th>Status</th><th>Deposit</th><th>Paid</th><th>Balance</th><th>Due</th></tr></thead><tbody>'+list.map(x=>{const dep=depInfo(x);return `<tr class="clickrow projectrow" data-id="${x.id}"><td><b>${esc(x.project_name)}</b><br><span class="muted">${esc(x.service||'')}</span></td><td>${esc(x.customer_name)}</td><td><span class="pill">${esc(pretty(x.status))}</span></td><td><span class="pill ${dep.cls} deposit-action" data-deposit-project="${x.id}" title="Open payment section">${esc(dep.label)}</span></td><td class="good">${money(paidForProject(x.id))}</td><td>${money(remainingForProject(x))}</td><td>${x.due_date?due(x.due_date):'—'}</td></tr>`}).join('')+'</tbody></table></div>';
 }

 function focusPayment(projectId){
   openProject(projectId);
   setTimeout(()=>{
     const box=$('paymentBox');
     if(!box)return;
     box.scrollIntoView({behavior:'smooth',block:'center'});
     box.classList.remove('payment-flash');
     void box.offsetWidth;
     box.classList.add('payment-flash');
     const amount=$('paymentAmount');
     if(amount)amount.focus({preventScroll:true});
   },80);
 }

 document.addEventListener('click',e=>{
   const badge=e.target.closest('[data-deposit-project]');
   if(!badge)return;
   e.preventDefault();e.stopPropagation();
   focusPayment(badge.dataset.depositProject);
 },true);

 const baseBindRows=bindRows;
 bindRows=function(){baseBindRows();document.querySelectorAll('[data-deposit-project]').forEach(b=>b.setAttribute('title','Click to record/view payment'))};

 const baseRender=render;
 render=function(){baseRender();bindRows()};
 if(profile)render();
})();