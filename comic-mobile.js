(()=>{
const root=document.documentElement,bar=document.querySelector('.reading-tools');
let mode=matchMedia('(max-width:620px)').matches?'panels':'page',size=20;
try{mode=localStorage.getItem('comic-reading-mode')||mode;size=Number(localStorage.getItem('comic-font-size'))||20}catch(e){}
if(!['panels','page'].includes(mode))mode='panels';size=Math.max(16,Math.min(28,size));
function apply(){root.dataset.comicMode=mode;root.style.setProperty('--comic-font',size+'px');bar.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));bar.querySelector('[data-size=down]').disabled=size<=16;bar.querySelector('[data-size=up]').disabled=size>=28;try{localStorage.setItem('comic-reading-mode',mode);localStorage.setItem('comic-font-size',String(size))}catch(e){}}
bar.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;let current=document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('.comic-page');if(b.dataset.mode)mode=b.dataset.mode;if(b.dataset.size)size=Math.max(16,Math.min(28,size+(b.dataset.size==='up'?2:-2)));apply();if(current&&b.dataset.mode)current.scrollIntoView({block:'start',behavior:'instant'})});apply();
})();