import {escape as e,formatPrice} from './data.js';
import {clamp,scrollProgress} from './gallery-math.js';
import {frames,frameFor} from './frames.js';

export function galleryMarkup(works,heart){
  const w=works[0];
  if(!w)return '<section class="world-panel empty" data-world-panel><h1>La galerie se prépare.</h1><p>Ajoutez une œuvre dans l’atelier pour préparer son accrochage.</p><a class="button" href="#atelier/nouveau">Ouvrir le configurateur</a></section>';
  return `<section class="gallery-story" id="galerie" style="--stops:${works.length}" aria-label="Visite de la galerie"><div class="gallery-pin"><div class="gallery-view"><a class="gallery-scroll" href="#collection"><span>Défilez pour visiter la galerie</span><span class="scroll-stroke" aria-hidden="true"></span></a></div><div class="gallery-cartel"><div class="gallery-label"><h1 id="gallery-work-title">${e(w.title)}</h1><p id="gallery-work-artist">${e(w.artist)} · ${w.year}</p><p id="gallery-work-medium">${e(w.medium)} · ${frames[frameFor(w)].label}</p></div><div class="gallery-purchase"><span class="gallery-price">${formatPrice(w.price)}</span><span class="gallery-favorite">${heart(w)}</span><a class="button gallery-detail" href="#oeuvre/${encodeURIComponent(w.id)}">Découvrir l’œuvre</a></div><div class="gallery-pagination"><button type="button" class="gallery-previous" aria-label="Œuvre précédente" disabled>←</button><span class="gallery-count" aria-live="polite">01 / ${String(works.length).padStart(2,'0')}</span><button type="button" class="gallery-next" aria-label="Œuvre suivante" ${works.length===1?'disabled':''}>→</button></div></div><div class="gallery-track" aria-hidden="true"><span></span></div></div></section>`;
}

export function mountGallery(section,works,{favorites,initialProgress=0,onPosition,world}){
  if(!section||!works.length)return ()=>{};
  const $=selector=>section.querySelector(selector);
  let index=-1,frame=0,disposed=false,settleTimer=0,progress=initialProgress,travelSize=0;
  let touching=0;
  function caption(state){
    $('.gallery-track span').style.transform=`scaleX(${works.length>1?state.progress/(works.length-1):1})`;
    if(index===state.index)return;index=state.index;const w=works[index];
    $('#gallery-work-title').textContent=w.title;$('#gallery-work-artist').textContent=`${w.artist} · ${w.year}`;
    $('#gallery-work-medium').textContent=`${w.medium} · ${frames[frameFor(w)].label}`;
    $('.gallery-price').textContent=formatPrice(w.price);$('.gallery-detail').href=`#oeuvre/${encodeURIComponent(w.id)}`;
    $('.gallery-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(works.length).padStart(2,'0')}`;
    $('.gallery-previous').disabled=index===0;$('.gallery-next').disabled=index===works.length-1;
    const favorite=$('.gallery-favorite button'),selected=favorites().includes(w.id);
    favorite.dataset.favorite=w.id;favorite.classList.toggle('filled',selected);favorite.setAttribute('aria-pressed',selected);
    favorite.setAttribute('aria-label',`${selected?'Retirer de':'Ajouter à'} ma sélection : ${w.title}`);
  }
  function dimensions(){return {top:section.getBoundingClientRect().top+scrollY,travel:Math.max(0,section.offsetHeight-$('.gallery-pin').offsetHeight)};}
  function update(){frame=0;if(disposed)return;const {top,travel}=dimensions();travelSize=travel;progress=scrollProgress(scrollY,top,travel,works.length);world.visit(progress,caption);}
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  function goTo(point,instant=false){const {top,travel}=dimensions();window.scrollTo({top:top+(works.length>1?clamp(point,0,works.length-1)/(works.length-1):0)*travel,behavior:instant||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  $('.gallery-previous').addEventListener('click',()=>goTo(index-1));$('.gallery-next').addEventListener('click',()=>goTo(index+1));
  section.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goTo(index+(event.key==='ArrowRight'?1:-1));}});
  const observer=new ResizeObserver(()=>{world.layout();schedule();});observer.observe($('.gallery-cartel'));
  function settle(){
    clearTimeout(settleTimer);
    if(disposed||touching||innerWidth>=900||works.length<2||(window.visualViewport?.scale||1)>1)return;
    const {top,travel}=dimensions(),point=scrollProgress(scrollY,top,travel,works.length);
    if(Math.abs(point-Math.round(point))>.025)goTo(Math.round(point));
  }
  function onScroll(){schedule();clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);}
  function onTouch(event){touching=event.touches.length;clearTimeout(settleTimer);if(!touching)settleTimer=setTimeout(settle,180);}
  function onResize(){const {travel}=dimensions();if(travelSize&&Math.abs(travel-travelSize)>1)goTo(progress,true);schedule();}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('scrollend',settle);
  window.addEventListener('resize',onResize);
  document.addEventListener('touchstart',onTouch,{passive:true});document.addEventListener('touchend',onTouch,{passive:true});document.addEventListener('touchcancel',onTouch,{passive:true});
  world.visit(initialProgress,caption);
  requestAnimationFrame(()=>{if(disposed)return;const {top,travel}=dimensions();window.scrollTo({top:top+(works.length>1?initialProgress/(works.length-1)*travel:0),behavior:'instant'});schedule();});
  return ()=>{onPosition(world.position());disposed=true;world.stopVisit();cancelAnimationFrame(frame);clearTimeout(settleTimer);observer.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('scrollend',settle);window.removeEventListener('resize',onResize);document.removeEventListener('touchstart',onTouch);document.removeEventListener('touchend',onTouch);document.removeEventListener('touchcancel',onTouch);};
}
