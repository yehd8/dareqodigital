(function(){
 function loadBrand(){if(!document.querySelector('script[src^="brand-dareqo.js"]')){const b=document.createElement('script');b.src='brand-dareqo.js?v=1';document.body.appendChild(b)}}
 const core=document.createElement('script');
 core.src='manager-reminders-core.js?v=2';
 core.onload=()=>{
   if(!document.querySelector('script[src^="manager-pro.js"]')){
     const pro=document.createElement('script');
     pro.src='manager-pro.js?v=1';
     pro.onload=()=>{if(!document.querySelector('script[src^="manager-ux.js"]')){const ux=document.createElement('script');ux.src='manager-ux.js?v=1';ux.onload=loadBrand;document.body.appendChild(ux)}else loadBrand()};
     document.body.appendChild(pro);
   }else if(!document.querySelector('script[src^="manager-ux.js"]')){
     const ux=document.createElement('script');ux.src='manager-ux.js?v=1';ux.onload=loadBrand;document.body.appendChild(ux);
   }else loadBrand();
 };
 document.body.appendChild(core);
})();