let expenses=[],efilter='all',selectedExpense=null;
function expenseForProject(id){return expenses.filter(e=>e.project_id===id).reduce((a,e)=>a+Number(e.amount||0),0)}
function totalExpenses(){return expenses.reduce((a,e)=>a+Number(e.amount||0),0)}
function expenseTable(list){if(!list.length)return '<div class="empty">No expenses recorded yet.</div>';return '<div class="tablewrap"><table><thead><tr><th>Date</th><th>Expense</th><th>Category</th><th>Project</th><th>Supplier</th><th>Method</th><th>Amount</th></tr></thead><tbody>'+list.map(e=>{const pr=projects.find(x=>x.id===e.project_id);return `<tr class="clickrow expenserow" data-id="${e.id}"><td>${esc(e.expense_date||'—')}</td><td><b>${esc(e.expense_name)}</b><br><span class="muted">${esc(e.notes||'')}</span></td><td>${esc(e.category||'Other')}</td><td>${esc(pr?.project_name||'Business')}</td><td>${esc(e.supplier||'—')}</td><td>${esc(e.payment_method||'—')}</td><td><b>${money(e.amount)}</b></td></tr>`}).join('')+'</tbody></table></div>'}

setPage=function(name){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));$('page-'+name).classList.remove('hidden');document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('active',x.dataset.page===name));$('pageTitle').textContent=({dashboard:'Home',requests:'Requests',add:'Add Request',projects:'Projects',documents:'Documents',customers:'Customers',income:'Money',expenses:'Expenses',settings:'Settings'})[name]||'Business Manager';render()}

renderIncome=function(){const paid=payments.reduce((a,p)=>a+Number(p.amount||0),0),value=projects.filter(x=>x.status!=='cancelled').reduce((a,x)=>a+Number(x.agreed_price||0),0),out=projects.filter(x=>x.status!=='cancelled').reduce((a,p)=>a+remainingForProject(p),0),exp=totalExpenses(),profit=paid-exp;$('incomeTotal').textContent=money(paid);$('expenseTotal').textContent=money(exp);$('netProfit').textContent=money(profit);$('outstandingTotal').textContent=money(out);$('projectValue').textContent=money(value);$('paymentsTable').innerHTML=paymentTable();$('expensesPageTotal').textContent=money(exp);$('businessExpenseTotal').textContent=money(expenses.filter(e=>!e.project_id).reduce((a,e)=>a+Number(e.amount||0),0));$('projectExpenseTotal').textContent=money(expenses.filter(e=>e.project_id).reduce((a,e)=>a+Number(e.amount||0),0));let el=expenses;if(efilter==='business')el=expenses.filter(e=>!e.project_id);else if(efilter==='project')el=expenses.filter(e=>e.project_id);$('expensesTable').innerHTML=expenseTable(el)}

bindRows=function(){document.querySelectorAll('.requestrow').forEach(r=>r.onclick=()=>openDetail(r.dataset.id));document.querySelectorAll('.projectrow').forEach(r=>r.onclick=()=>openProject(r.dataset.id));document.querySelectorAll('.documentrow').forEach(r=>r.onclick=()=>openDocument(r.dataset.id));document.querySelectorAll('.expenserow').forEach(r=>r.onclick=()=>openExpense(r.dataset.id))}

render=function(){if(!profile)return;const pending=requests.filter(x=>x.status==='pending').length,active=projects.filter(x=>!['completed','cancelled'].includes(x.status)).length,paid=payments.reduce((a,p)=>a+Number(p.amount||0),0),exp=totalExpenses(),profit=paid-exp,out=projects.filter(x=>x.status!=='cancelled').reduce((a,p)=>a+remainingForProject(p),0);$('pending').textContent=pending;$('activeProjects').textContent=active;$('income').textContent=money(paid);$('expenseTotalDash').textContent=money(exp);$('netProfitDash').textContent=money(profit);$('outstanding').textContent=money(out);$('dashboardProjects').innerHTML=projectTable(projects.filter(x=>!['completed','cancelled'].includes(x.status)).slice(0,6));$('dashboardDocuments').innerHTML=documentTable(documents.slice(0,6));let rl=requests;if(filter==='quote'||filter==='booking')rl=requests.filter(x=>x.request_type===filter);else if(filter!=='all')rl=requests.filter(x=>x.status===filter);$('requestsTable').innerHTML=requestTable(rl);let pl=pfilter==='all'?projects:projects.filter(x=>x.status===pfilter);$('projectsTable').innerHTML=projectTable(pl);let dl=dfilter==='all'?documents:documents.filter(x=>x.document_type===dfilter);$('documentsTable').innerHTML=documentTable(dl);bindRows();renderCustomers();renderIncome()}

refresh=async function(){const [rq,pq,pyq,dq,eq]=await Promise.all([client.from('requests').select('*').eq('business_id',profile.business_id).order('created_at',{ascending:false}),client.from('projects').select('*').eq('business_id',profile.business_id).order('created_at',{ascending:false}),client.from('payments').select('*').eq('business_id',profile.business_id).order('payment_date',{ascending:false}).order('created_at',{ascending:false}),client.from('documents').select('*').eq('business_id',profile.business_id).order('created_at',{ascending:false}),client.from('expenses').select('*').eq('business_id',profile.business_id).order('expense_date',{ascending:false}).order('created_at',{ascending:false})]);for(const q of [rq,pq,pyq,dq,eq])if(q.error){$('globalMsg').className='msg err';$('globalMsg').textContent=q.error.message;return}requests=rq.data||[];projects=pq.data||[];payments=pyq.data||[];documents=dq.data||[];expenses=eq.data||[];$('globalMsg').textContent='';render()}

function renderProjectExpenses(){if(!selectedProject)return;const list=expenses.filter(e=>e.project_id===selectedProject.id),total=expenseForProject(selectedProject.id),paid=paidForProject(selectedProject.id),profit=paid-total;$('pExpenses').textContent=money(total);$('pRevenue').textContent=money(paid);$('pProfit').textContent=money(profit);$('pProfit').className=profit>=0?'good':'';$('projectExpensesList').innerHTML=list.length?'<div class="tablewrap" style="margin-top:10px"><table><thead><tr><th>Date</th><th>Expense</th><th>Category</th><th>Amount</th></tr></thead><tbody>'+list.map(e=>`<tr class="clickrow projectExpenseRow" data-id="${e.id}"><td>${esc(e.expense_date||'—')}</td><td>${esc(e.expense_name)}</td><td>${esc(e.category||'Other')}</td><td>${money(e.amount)}</td></tr>`).join('')+'</tbody></table></div>':'<div class="muted" style="margin-top:10px">No project expenses yet.</div>';document.querySelectorAll('.projectExpenseRow').forEach(r=>r.onclick=()=>{show('projectModal',false);openExpense(r.dataset.id)})}
const baseOpenProject=openProject;openProject=function(id){baseOpenProject(id);if(selectedProject){show('projectExpenseBox',true);renderProjectExpenses()}}
const baseBlankProject=blankProject;blankProject=function(){baseBlankProject();show('projectExpenseBox',false)}
const baseProjectFromRequest=projectFromRequest;projectFromRequest=function(){baseProjectFromRequest();show('projectExpenseBox',false)}
$('newProjectBtn').onclick=blankProject;$('createProjectBtn').onclick=projectFromRequest;

function populateExpenseProjectSelect(value){$('eProject').innerHTML='<option value="">Business expense (no project)</option>'+projects.map(p=>`<option value="${p.id}">${esc(p.project_name)} — ${esc(p.customer_name)}</option>`).join('');$('eProject').value=value||''}
function blankExpense(project=null){selectedExpense=null;$('expenseHeading').textContent='Add Expense';$('expenseSub').textContent=project?'Project expense: '+project.project_name:'KelvoDigital expense';$('eName').value='';$('eAmount').value='';$('eDate').value=new Date().toISOString().slice(0,10);$('eCategory').value='Other';populateExpenseProjectSelect(project?.id||'');$('eMethod').value='Personally';$('eSupplier').value='';$('eNotes').value='';$('expenseMsg').textContent='';show('deleteExpense',false);show('expenseModal',true)}
function openExpense(id){const e=expenses.find(x=>x.id===id);if(!e)return;selectedExpense=e;$('expenseHeading').textContent='Edit Expense';$('expenseSub').textContent=e.expense_name||'';$('eName').value=e.expense_name||'';$('eAmount').value=e.amount??'';$('eDate').value=e.expense_date||'';$('eCategory').value=e.category||'Other';populateExpenseProjectSelect(e.project_id||'');$('eMethod').value=e.payment_method||'Personally';$('eSupplier').value=e.supplier||'';$('eNotes').value=e.notes||'';$('expenseMsg').textContent='';show('deleteExpense',true);show('expenseModal',true)}
async function saveExpense(){const payload={business_id:profile.business_id,project_id:$('eProject').value||null,expense_name:$('eName').value.trim(),amount:Number($('eAmount').value||0),expense_date:$('eDate').value||new Date().toISOString().slice(0,10),category:$('eCategory').value,payment_method:$('eMethod').value||null,supplier:$('eSupplier').value.trim()||null,notes:$('eNotes').value.trim()||null};if(!payload.expense_name||!(payload.amount>0)){$('expenseMsg').className='msg err';$('expenseMsg').textContent='Expense name and an amount greater than 0 are required.';return}let q;if(selectedExpense?.id)q=await client.from('expenses').update(payload).eq('id',selectedExpense.id).eq('business_id',profile.business_id).select().single();else q=await client.from('expenses').insert(payload).select().single();if(q.error){$('expenseMsg').className='msg err';$('expenseMsg').textContent=q.error.message;return}$('expenseMsg').className='msg ok';$('expenseMsg').textContent='Expense saved. Profit updated.';await refresh();selectedExpense=expenses.find(e=>e.id===q.data.id)||q.data;openExpense(selectedExpense.id)}

document.querySelectorAll('[data-efilter]').forEach(b=>b.onclick=()=>{efilter=b.dataset.efilter;document.querySelectorAll('[data-efilter]').forEach(x=>x.classList.toggle('active',x===b));render()});
$('closeExpense').onclick=()=>show('expenseModal',false);$('newExpenseBtn').onclick=()=>blankExpense();$('addProjectExpense').onclick=()=>{const pr=selectedProject;show('projectModal',false);blankExpense(pr)};$('saveExpense').onclick=saveExpense;
$('deleteExpense').onclick=async()=>{if(!selectedExpense?.id||!confirm('Delete this expense?'))return;const projectId=selectedExpense.project_id;const q=await client.from('expenses').delete().eq('id',selectedExpense.id).eq('business_id',profile.business_id);if(q.error){$('expenseMsg').className='msg err';$('expenseMsg').textContent=q.error.message;return}show('expenseModal',false);await refresh();if(projectId)openProject(projectId);else setPage('expenses')};

(function simplifyManagerUI(){
 const style=document.createElement('style');
 style.textContent=`
 .navgroup{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#6f829d;padding:18px 12px 6px;font-weight:800}
 .quickbox{background:linear-gradient(135deg,#111f34,#0b1728);border:1px solid #344963;border-radius:16px;padding:18px;margin:0 0 18px}
 .quickbox h2{margin:0 0 5px}.quickgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin-top:14px}
 .quickaction{background:#172a45;border:1px solid #345074;border-radius:12px;padding:14px;text-align:left;min-height:78px}
 .quickaction strong{display:block;font-size:15px;margin-bottom:4px}.quickaction span{display:block;font-size:12px;color:#9cabc0;font-weight:500;line-height:1.35}
 .pageintro{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap}
 .simple-details{margin-top:14px;border:1px solid #293c58;border-radius:12px;background:#0a1524;padding:0 14px}
 .simple-details summary{cursor:pointer;font-weight:800;padding:13px 0;color:#dce7f7}
 .simple-details[open]{padding-bottom:14px}
 .simple-hint{font-size:12px;color:#91a2b8;margin-top:5px}
 .money-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 18px}
 @media(max-width:700px){.quickgrid{grid-template-columns:1fr 1fr}.quickaction{min-height:70px}.navgroup{display:none}}
 `;
 document.head.appendChild(style);

 const nav=document.querySelector('.navwrap');
 if(nav){
   const byPage=p=>nav.querySelector(`[data-page="${p}"]`);
   const dashboard=byPage('dashboard'), requestsBtn=byPage('requests'), addBtn=byPage('add'), projectsBtn=byPage('projects'), docsBtn=byPage('documents'), customersBtn=byPage('customers'), incomeBtn=byPage('income'), expensesBtn=byPage('expenses'), settingsBtn=byPage('settings');
   if(dashboard) dashboard.textContent='Home';
   if(incomeBtn) incomeBtn.textContent='Money';
   if(addBtn) addBtn.style.display='none';
   if(expensesBtn) expensesBtn.style.display='none';
   if(!nav.querySelector('.navgroup')){
     const g1=document.createElement('div');g1.className='navgroup';g1.textContent='Work';
     const g2=document.createElement('div');g2.className='navgroup';g2.textContent='Business';
     if(requestsBtn) nav.insertBefore(g1,requestsBtn);
     if(customersBtn) nav.insertBefore(g2,customersBtn);
   }
 }

 const dash=$('page-dashboard');
 if(dash&&!$('simpleQuickActions')){
   const q=document.createElement('div');q.id='simpleQuickActions';q.className='quickbox';
   q.innerHTML=`<h2>What do you want to do?</h2><div class="simple-hint">Use these shortcuts for the most common jobs.</div><div class="quickgrid">
   <button class="quickaction" id="qaRequest"><strong>+ New Request</strong><span>Add a customer request manually</span></button>
   <button class="quickaction" id="qaProjects"><strong>Projects</strong><span>Continue client work</span></button>
   <button class="quickaction" id="qaInvoice"><strong>Create Invoice</strong><span>Make an unpaid invoice</span></button>
   <button class="quickaction" id="qaExpense"><strong>Add Expense</strong><span>Record a business cost</span></button>
   <button class="quickaction" id="qaMoney"><strong>Money</strong><span>Income, expenses and profit</span></button>
   </div>`;
   dash.insertBefore(q,dash.firstChild);
   $('qaRequest').onclick=()=>setPage('add');
   $('qaProjects').onclick=()=>setPage('projects');
   $('qaInvoice').onclick=()=>newDocument('invoice');
   $('qaExpense').onclick=()=>blankExpense();
   $('qaMoney').onclick=()=>setPage('income');
 }

 const requestsPage=$('page-requests');
 if(requestsPage&&!$('simpleRequestIntro')){
   const h=document.createElement('div');h.id='simpleRequestIntro';h.className='pageintro';h.innerHTML='<div><h2 style="margin:0">Requests</h2><div class="simple-hint">Review new leads, contact them, then confirm when ready.</div></div><button id="simpleAddRequest">+ New Request</button>';
   requestsPage.insertBefore(h,requestsPage.firstChild);$('simpleAddRequest').onclick=()=>setPage('add');
 }

 const money=$('page-income');
 if(money&&!$('simpleMoneyActions')){
   const a=document.createElement('div');a.id='simpleMoneyActions';a.className='money-actions';a.innerHTML='<button id="moneyAddExpense">+ Add Expense</button><button id="moneyViewExpenses" class="secondary">View Expenses</button><button id="moneyInvoice" class="secondary">Create Invoice</button>';
   const section=money.querySelector('.section');if(section)section.insertBefore(a,section.children[1]||null);
   $('moneyAddExpense').onclick=()=>blankExpense();$('moneyViewExpenses').onclick=()=>setPage('expenses');$('moneyInvoice').onclick=()=>newDocument('invoice');
 }

 const expensesPage=$('page-expenses');
 if(expensesPage&&!$('backToMoney')){
   const top=expensesPage.querySelector('.topbar');if(top){const b=document.createElement('button');b.id='backToMoney';b.className='secondary';b.textContent='← Back to Money';b.onclick=()=>setPage('income');top.querySelector('.actions')?.appendChild(b);top.appendChild(b)}
 }

 const projectModal=$('projectModal');
 if(projectModal&&!$('projectMoreDetails')){
   const box=projectModal.querySelector('.modalbox');
   const grid=box?.querySelector(':scope > .grid2');
   if(grid){
     const details=document.createElement('details');details.id='projectMoreDetails';details.className='simple-details';details.innerHTML='<summary>More project details</summary><div class="grid2" id="projectExtraGrid"></div>';
     grid.after(details);const target=details.querySelector('#projectExtraGrid');
     ['pPhone','pEmail','pStart','pDue'].forEach(id=>{const el=$(id);if(el?.parentElement)target.appendChild(el.parentElement)});
   }
   if($('paymentBox')){$('paymentBox').insertAdjacentHTML('afterbegin','<h3 style="margin:0 0 8px">Payment</h3><div class="simple-hint">Record what the customer paid, then complete the project when finished.</div>')}
   if($('projectExpenseBox')){$('projectExpenseBox').insertAdjacentHTML('afterbegin','<h3 style="margin:0 0 8px">Private costs & profit</h3><div class="simple-hint">Only you see these internal expenses.</div>')}
   if($('projectDocs')){$('projectDocs').insertAdjacentHTML('afterbegin','<h3 style="margin:0 0 8px">Customer documents</h3>')}
 }

 const docModal=$('documentModal');
 if(docModal&&!$('docSimpleHelp')){
   const head=docModal.querySelector('.modalhead');const help=document.createElement('div');help.id='docSimpleHelp';help.className='notice';help.style.margin='14px 0 0';help.innerHTML='<b>Simple flow:</b> choose the document type, check the client and amount, save it, then Preview or Send by WhatsApp/Email.';head?.after(help);
 }
})();
