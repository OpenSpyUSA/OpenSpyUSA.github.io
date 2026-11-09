(()=>{
const root=document.documentElement,bar=document.querySelector('.reading-tools');
if(!bar)return;
let mode=matchMedia('(max-width:620px)').matches?'panels':'page';
try{mode=localStorage.getItem('comic-reading-mode')||mode}catch(e){}
if(!['panels','page'].includes(mode))mode='panels';
function apply(){root.dataset.comicMode=mode;bar.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));try{localStorage.setItem('comic-reading-mode',mode)}catch(e){}}
const arts=[...document.querySelectorAll('.panel-art[data-rect]')];
const dialog=document.createElement('dialog');dialog.className='comic-zoom';dialog.setAttribute('aria-label','漫画格放大阅读');
dialog.innerHTML='<div class="zoom-controls"><button type="button" data-zoom="close" autofocus>关闭</button><button type="button" data-zoom="prev" aria-label="上一格">←</button><span class="zoom-title" aria-live="polite"></span><button type="button" data-zoom="next" aria-label="下一格">→</button><button type="button" data-zoom="out" aria-label="缩小画面">−</button><button type="button" data-zoom="in" aria-label="放大画面">＋</button></div><p class="zoom-hint">拖动画面阅读 · 左右箭头换格</p><div class="zoom-viewport" tabindex="0"><div class="zoom-stage"><img alt="" draggable="false"></div></div>';
document.body.append(dialog);
const view=dialog.querySelector('.zoom-viewport'),stage=dialog.querySelector('.zoom-stage'),img=stage.querySelector('img');
let selected=0,scale=2,opener=null;
function draw(reset=true){const art=arts[selected],[x,y,w,h]=JSON.parse(art.dataset.rect),width=Math.max(1,view.clientWidth)*scale;stage.style.width=width+'px';stage.style.height=(width*h/w)+'px';img.src=art.querySelector('img').src;img.alt=art.querySelector('img').alt;img.style.cssText=`width:${1024/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%;`;dialog.querySelector('.zoom-title').textContent=img.alt;dialog.querySelector('[data-zoom=prev]').disabled=selected===0;dialog.querySelector('[data-zoom=next]').disabled=selected===arts.length-1;dialog.querySelector('[data-zoom=out]').disabled=scale<=1;dialog.querySelector('[data-zoom=in]').disabled=scale>=4;if(reset){view.scrollTop=0;view.scrollLeft=0}}
function open(art,trigger){if(!art)return;selected=arts.indexOf(art);opener=trigger||art;scale=2;dialog.showModal();root.classList.add('zoom-is-open');draw();}
function currentArt(){return arts.find(a=>{const b=a.getBoundingClientRect();return b.bottom>bar.getBoundingClientRect().bottom&&b.top<innerHeight})||arts[0]}
arts.forEach(a=>{a.tabIndex=0;a.setAttribute('role','button');a.setAttribute('aria-label',a.querySelector('img').alt+'，点击放大');a.addEventListener('click',()=>open(a,a));a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(a,a)}})});
bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.mode){const current=[...document.querySelectorAll('.comic-page')].find(f=>{const r=f.getBoundingClientRect();return r.bottom>bar.getBoundingClientRect().bottom&&r.top<innerHeight})||currentArt()?.closest('.comic-page');mode=b.dataset.mode;apply();if(current)current.scrollIntoView({block:'start',behavior:'instant'})}else if(b.hasAttribute('data-open-zoom'))open(currentArt(),b)});
function action(key){if(key==='close'){dialog.close();return}if(key==='prev'||key==='next'){selected=Math.max(0,Math.min(arts.length-1,selected+(key==='next'?1:-1)));draw();return}if(key==='in'||key==='out'){const before=scale;scale=Math.max(1,Math.min(4,scale+(key==='in' ? 0.5 : -0.5)));const cx=(view.scrollLeft+view.clientWidth/2)/before,cy=(view.scrollTop+view.clientHeight/2)/before;draw(false);view.scrollLeft=cx*scale-view.clientWidth/2;view.scrollTop=cy*scale-view.clientHeight/2}}
dialog.addEventListener('click',e=>{const b=e.target.closest('[data-zoom]');if(b)action(b.dataset.zoom)});
dialog.addEventListener('close',()=>{root.classList.remove('zoom-is-open');opener?.focus({preventScroll:true})});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();action(e.key==='ArrowRight'?'next':'prev')}});
window.addEventListener('resize',()=>{if(dialog.open)draw(false)});apply();
})();
