(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 820px)');
  const shells = [...document.querySelectorAll('.motion-shell')];
  const chapters = [...document.querySelectorAll('.story-chapter')];
  const progress = document.querySelector('.story-progress');
  const visible = new Set();
  let frame = 0;
  let measures = [];
  let height = 0;
  let suspended = false;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = x => x*x*(3-2*x);

  // The near-center portion is a slow, continuous drift. Entry/exit have more travel.
  function path(position) {
    if (position > .72) return 6 + 72*smooth(clamp((position-.72)/.65,0,1));
    if (position < .22) return -6 - 37*smooth(clamp((.22-position)/.55,0,1));
    return 24*(position-.47);
  }

  function measure() {
    height = Math.max(1, innerHeight);
    const y = scrollY;
    // Measure layout shells, never the moving text: no transform/measurement feedback.
    measures = shells.map((shell, index) => {
      const moving = shell.firstElementChild;
      const r = shell.getBoundingClientRect();
      const sign = shell.closest('[data-chapter="manager"]') ? -1 : index%2 ? -1 : 1;
      const margin = Math.max(0,Math.min(r.left,innerWidth-r.right)-8);
      return {shell, moving, top:r.top+y, size:r.height, sign, margin, last:''};
    });
    schedule();
  }

  function draw() {
    frame = 0;
    if (suspended || document.hidden) return;
    const y = scrollY;
    if (reduce.matches) {
      document.documentElement.classList.remove('story-motion');
      measures.forEach(({moving}) => {
        if (moving) ['--story-x','--story-y','--story-r'].forEach(n=>moving.style.removeProperty(n));
      });
      return;
    }
    document.documentElement.classList.add('story-motion');
    const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
    const compact = small.matches;
    for (const m of measures) {
      if (!m.moving || !visible.has(m.shell)) continue;
      if (m.shell.matches(':focus-within') || m.shell.classList.contains('motion-held')) continue;
      const center = (m.top-y+Math.min(m.size,height*.68)*.5)/height;
      const travel = path(center);
      const card = m.shell.dataset.motion === 'card';
      const limit = Math.min(m.margin,compact?13:76);
      const x = clamp(travel*(compact?.15:card?.62:.85)*m.sign*dir,-limit,limit);
      const vertical = clamp(travel*(compact?.31:.28),compact?-22:-30,compact?22:30);
      const angle = compact?0:clamp(travel*(card?.012:.003),-.6,.6);
      const next = [x.toFixed(2),vertical.toFixed(2),angle.toFixed(3)].join('|');
      if (next===m.last) continue;
      m.moving.style.setProperty('--story-x',x.toFixed(2)+'px');
      m.moving.style.setProperty('--story-y',vertical.toFixed(2)+'px');
      m.moving.style.setProperty('--story-r',angle.toFixed(3)+'deg');
      m.last=next;
    }
    const distance = document.documentElement.scrollHeight-height;
    if(progress) progress.style.transform=`scaleX(${distance>0?clamp(y/distance,0,1):0})`;
  }
  function schedule() { if(!frame) frame=requestAnimationFrame(draw); }
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const e of entries) {
      if(e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
    }
    schedule();
  }, {rootMargin:'180px 0px',threshold:0});
  const chapterObserver = new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('chapter-visible',e.isIntersecting)),{rootMargin:'100px 0px'});
  chapters.forEach(c=>chapterObserver.observe(c));
  shells.forEach(shell => {
    observer.observe(shell);
    shell.addEventListener('pointerenter', e => {if(e.pointerType==='mouse') shell.classList.add('motion-held');});
    shell.addEventListener('pointerleave',()=>{shell.classList.remove('motion-held');schedule();});
    shell.addEventListener('focusout',schedule);
  });
  chapters.forEach(chapter => chapter.querySelectorAll('.code-float,.code-link').forEach((el,i)=>el.style.setProperty('--code-index',i)));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', measure);
  addEventListener('load', measure, {once:true});
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('selectionchange',()=>{
    suspended=Boolean(String(getSelection()).trim());
    if(!suspended)schedule();
  });
  new MutationObserver(measure).observe(document.documentElement,{attributes:true,attributeFilter:['dir','lang']});
  const sizing = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
  chapters.forEach(c=>sizing?.observe(c));
  reduce.addEventListener('change',measure);
  small.addEventListener('change',measure);
  measure();
})();
