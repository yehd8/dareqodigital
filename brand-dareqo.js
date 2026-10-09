(function(){
 const BRAND='Dareqo Digital',OLD='KelvoDigital',OLD2='Kelvo Digital';
 function replaceText(root=document.body){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){
   if(n.nodeValue&&(n.nodeValue.includes(OLD)||n.nodeValue.includes(OLD2)))n.nodeValue=n.nodeValue.replaceAll(OLD,BRAND).replaceAll(OLD2,BRAND);
  }
  root.querySelectorAll?.('img').forEach(img=>{if((img.getAttribute('src')||'').includes('kelvodigital-logo.svg'))img.src='dareqo-digital-logo.svg';if((img.alt||'').includes('Kelvo'))img.alt=BRAND});
  root.querySelectorAll?.('a[href*="wa.me"]').forEach(a=>{try{a.href=a.href.replaceAll('KelvoDigital','Dareqo%20Digital').replaceAll('Kelvo%20Digital','Dareqo%20Digital')}catch(e){}});
 }
 function apply(){document.title=document.title.replaceAll(OLD,BRAND).replaceAll(OLD2,BRAND);replaceText();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
 new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)replaceText(n);else if(n.nodeType===3&&n.nodeValue?.includes('Kelvo'))n.nodeValue=n.nodeValue.replaceAll(OLD,BRAND).replaceAll(OLD2,BRAND)}))).observe(document.documentElement,{childList:true,subtree:true});
})();