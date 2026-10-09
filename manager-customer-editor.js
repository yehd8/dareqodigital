(function(){
  const style=document.createElement('style');
  style.textContent=`
    .modalbox{position:relative!important}
    .modalhead{position:sticky!important;top:-22px!important;z-index:40!important;margin:-22px -22px 14px!important;padding:18px 22px 14px!important;background:#fff!important;border-bottom:1px solid #e7ebf1!important;box-shadow:0 8px 18px rgba(45,62,85,.08)!important}
    .modalhead .close{position:relative!important;z-index:41!important;flex:0 0 auto!important}
    .customerrow{cursor:pointer}
    .customerrow:hover{background:#f5f8ff!important}
    .customer-edit-note{margin:4px 0 16px;color:#6d7d92;font-size:13px}
    .customer-related{margin-top:16px;padding:12px 14px;background:#f7f9fc;border:1px solid #e2e8f0;border-radius:12px;color:#63748a;font-size:12px;line-height:1.45}
    @media(max-width:520px){.modalhead{top:-16px!important;margin:-16px -16px 12px!important;padding:14px 16px 12px!important}}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.id='customerModal';
  modal.className='modal hidden';
  modal.innerHTML=`<div class="modalbox"><div class="modalhead"><div><h2 id="customerHeading">Customer</h2><div id="customerSub" class="muted">Edit customer details</div></div><button id="closeCustomer" class="close">✕</button></div><p class="customer-edit-note">Update contact details here. The change will also update matching leads and linked projects so you do not have to edit the same customer in several places.</p><div class="grid2"><div><label>Name</label><input id="customerName"></div><div><label>Phone / WhatsApp</label><input id="customerPhone"></div><div><label>Email</label><input id="customerEmail" type="email"></div><div><label>Main service</label><input id="customerService"></div></div><label>Customer notes</label><textarea id="customerNotes" placeholder="Anything useful to remember about this customer"></textarea><div id="customerRelated" class="customer-related"></div><div class="toolbar"><button id="saveCustomer">Save Customer</button><a id="customerWhatsApp" class="btn secondary" target="_blank">WhatsApp</a><a id="customerEmailLink" class="btn secondary">Email</a></div><div id="customerMsg" class="msg"></div></div>`;
  document.body.appendChild(modal);

  let currentCustomer=null;
  let currentMatchIds=[];
  let currentProjectIds=[];

  function norm(v){return String(v||'').trim().toLowerCase()}
  function customerMatches(base,row){
    if(base.email&&row.email&&norm(base.email)===norm(row.email))return true;
    if(base.phone&&row.phone&&phoneDigits(base.phone)===phoneDigits(row.phone))return true;
    return !base.email&&!base.phone&&norm(base.customer_name)&&norm(base.customer_name)===norm(row.customer_name);
  }
  function projectMatches(base,p,requestIds){
    if(p.request_id&&requestIds.includes(p.request_id))return true;
    if(base.email&&p.email&&norm(base.email)===norm(p.email))return true;
    if(base.phone&&p.phone&&phoneDigits(base.phone)===phoneDigits(p.phone))return true;
    return norm(base.customer_name)&&norm(base.customer_name)===norm(p.customer_name);
  }
  function updateCustomerLinks(){
    const phone=phoneDigits($('customerPhone').value);
    const email=$('customerEmail').value.trim();
    $('customerWhatsApp').href=phone?'https://wa.me/'+phone:'#';
    $('customerWhatsApp').style.pointerEvents=phone?'auto':'none';
    $('customerEmailLink').href=email?'mailto:'+encodeURIComponent(email):'#';
    $('customerEmailLink').style.pointerEvents=email?'auto':'none';
  }

  window.openCustomer=function(id){
    const base=requests.find(x=>x.id===id);
    if(!base)return;
    currentCustomer={...base};
    currentMatchIds=requests.filter(r=>customerMatches(base,r)).map(r=>r.id);
    currentProjectIds=projects.filter(p=>projectMatches(base,p,currentMatchIds)).map(p=>p.id);
    $('customerHeading').textContent=base.customer_name||'Customer';
    $('customerSub').textContent=base.service?'Customer · '+base.service:'Customer details';
    $('customerName').value=base.customer_name||'';
    $('customerPhone').value=base.phone||base.whatsapp||'';
    $('customerEmail').value=base.email||'';
    $('customerService').value=base.service||'';
    $('customerNotes').value=base.notes||'';
    $('customerMsg').textContent='';
    const relatedLeadCount=currentMatchIds.length;
    const relatedProjectCount=currentProjectIds.length;
    $('customerRelated').textContent=`Linked records: ${relatedLeadCount} lead${relatedLeadCount===1?'':'s'} · ${relatedProjectCount} project${relatedProjectCount===1?'':'s'}. Saving updates matching contact details across these records.`;
    updateCustomerLinks();
    show('customerModal',true);
  };

  $('closeCustomer').onclick=()=>show('customerModal',false);
  ['customerPhone','customerEmail'].forEach(id=>$(id).oninput=updateCustomerLinks);
  modal.addEventListener('click',e=>{if(e.target===modal)show('customerModal',false)});

  $('saveCustomer').onclick=async function(){
    if(!currentCustomer)return;
    const name=$('customerName').value.trim();
    if(!name){$('customerMsg').className='msg err';$('customerMsg').textContent='Customer name is required.';return}
    const phone=$('customerPhone').value.trim()||null;
    const email=$('customerEmail').value.trim()||null;
    const service=$('customerService').value.trim()||null;
    const notes=$('customerNotes').value.trim()||null;
    this.disabled=true;
    $('customerMsg').className='msg';$('customerMsg').textContent='Saving…';
    const leadPatch={customer_name:name,phone,whatsapp:phone,email,service,notes};
    let q={error:null};
    if(currentMatchIds.length)q=await client.from('requests').update(leadPatch).in('id',currentMatchIds).eq('business_id',profile.business_id);
    if(q.error){this.disabled=false;$('customerMsg').className='msg err';$('customerMsg').textContent=q.error.message;return}
    if(currentProjectIds.length){
      const pq=await client.from('projects').update({customer_name:name,phone,email,service}).in('id',currentProjectIds).eq('business_id',profile.business_id);
      if(pq.error){this.disabled=false;$('customerMsg').className='msg err';$('customerMsg').textContent=pq.error.message;return}
      const matchingDocs=documents.filter(d=>currentProjectIds.includes(d.project_id)||((currentCustomer.email&&d.customer_email&&norm(currentCustomer.email)===norm(d.customer_email))||(currentCustomer.phone&&d.customer_phone&&phoneDigits(currentCustomer.phone)===phoneDigits(d.customer_phone))||norm(currentCustomer.customer_name)===norm(d.customer_name))).map(d=>d.id);
      if(matchingDocs.length)await client.from('documents').update({customer_name:name,business_name:name,customer_email:email,customer_phone:phone,service}).in('id',matchingDocs).eq('business_id',profile.business_id);
    }
    this.disabled=false;
    $('customerMsg').className='msg ok';$('customerMsg').textContent='Customer updated.';
    await refresh();
    currentCustomer=requests.find(r=>currentMatchIds.includes(r.id))||currentCustomer;
    setTimeout(()=>show('customerModal',false),350);
  };

  const baseRenderCustomers=renderCustomers;
  renderCustomers=function(){
    const map=new Map();
    requests.filter(x=>!x.archived).forEach(x=>{const key=(x.email||x.phone||x.customer_name||'').toLowerCase();if(!map.has(key))map.set(key,x)});
    const list=[...map.values()];
    $('customersList').innerHTML=list.length?'<div class="tablewrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Service</th></tr></thead><tbody>'+list.map(x=>`<tr class="customerrow" data-customer-id="${x.id}"><td><b>${esc(x.customer_name)}</b><br><span class="muted">Click to edit</span></td><td>${esc(x.phone||'—')}</td><td>${esc(x.email||'—')}</td><td>${esc(x.service||'—')}</td></tr>`).join('')+'</tbody></table></div>':'<div class="empty">No active customers yet.</div>';
    document.querySelectorAll('.customerrow').forEach(r=>r.onclick=()=>openCustomer(r.dataset.customerId));
  };

  const baseRender=render;
  render=function(){baseRender();if(profile)renderCustomers()};

  // Close buttons stay visible while scrolling any manager modal.
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('keydown',e=>{if(e.key==='Escape')show(m.id,false)}));
  if(profile)renderCustomers();
})();