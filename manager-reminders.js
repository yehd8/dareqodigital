(function(){
 const core=document.createElement('script');
 core.src='manager-reminders-core.js?v=2';
 core.onload=()=>{if(!document.querySelector('script[src^="manager-pro.js"]')){const pro=document.createElement('script');pro.src='manager-pro.js?v=1';document.body.appendChild(pro)}};
 document.body.appendChild(core);
})();
