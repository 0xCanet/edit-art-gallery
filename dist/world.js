import {frameFor,frames} from './frames.js';
import {arrivalState,advanceLoad,MIN_LOAD_MS} from './arrival.js';
import {clamp,dampProgress,galleryState,inspectionView,transformInspection,inspectionGesture} from './gallery-math.js';

export function createWorld(host,onSelect) {
  const cross='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  host.innerHTML=`<div class="world-visual" role="img" aria-label="Galerie PEINTURE"><div class="world-fallback"><img alt="" hidden><p>Importez un visuel pour préparer l’accrochage.</p></div><canvas aria-hidden="true"></canvas></div><div class="world-tools"><a class="world-exit" href="#galerie" hidden>${cross}Quitter l’œuvre</a><button type="button" class="world-inspect" hidden>Explorer les détails</button><button type="button" class="world-mode" aria-pressed="false">Vue sans animation</button><button type="button" class="world-angle" aria-pressed="false">Voir le cadre de côté</button><p class="world-status" role="status"></p></div><div class="inspection-controls" hidden><button type="button" class="inspection-back">Revenir à la fiche</button><div class="inspection-zoom" role="group" aria-label="Explorer les détails du tableau"><button type="button" data-zoom="out" aria-label="Dézoomer">−</button><output aria-label="Niveau de zoom">100 %</output><button type="button" data-zoom="in" aria-label="Zoomer">+</button><button type="button" data-zoom="reset">Recentrer</button></div><p><span class="inspection-touch-hint">Pincez pour zoomer · Glissez pour explorer</span><span class="inspection-pointer-hint">Molette pour zoomer · Faites glisser pour explorer</span></p></div>`;
  const canvas=host.querySelector('canvas'),image=host.querySelector('img'),status=host.querySelector('.world-status'),toggle=host.querySelector('.world-mode');
  const inspectButton=host.querySelector('.world-inspect'),inspectionControls=host.querySelector('.inspection-controls'),back=host.querySelector('.inspection-back');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let flat=motion.matches,scene=null,desired=[],loaded=[],identity='',loadingIdentity='',generation=0,frame=0,lastTime=0;
  let mode='visit',panel=null,callback=null,inspecting=false,arrivalCancelled=false;
  const loader=document.querySelector('#arrival-loader'),progressbar=document.querySelector('#arrival-progress'),count=loader.querySelector('.loader-count span');
  const started=performance.now();
  let loadingProgress=0,displayedProgress=0,readyAt=null,fontsReady=false,fallbackReady=false,sceneReady=false,loaderRemoved=false;
  document.body.classList.add('is-loading');host.inert=true;document.querySelector('.skip').inert=true;document.querySelector('#main').inert=true;document.querySelector('#header').inert=true;
  Promise.allSettled([document.fonts.load('400 64px Newsreader'),document.fonts.load('400 16px "DM Sans"')]).then(()=>{fontsReady=true;loadingProgress=Math.max(loadingProgress,.1);schedule();});
  let current={progress:0,focus:0,angle:0,right:0,bottom:150,top:88,zoom:1,x:0,y:0,entrance:1},target={...current};
  const key=work=>JSON.stringify([work.id,work.image,frameFor(work)]);
  const observer=new ResizeObserver(layout),pointers=new Map();
  let gesture=null,dragged=false,tap=null,lastTap=null,lastScroll=0,renderedView=inspectionView(),rebound=false,viewportWidth=innerWidth;
  const mobileLayout=()=>innerWidth<900&&!(innerHeight<500&&innerWidth>innerHeight);

  function schedule(){host.dataset.settled='false';if(!frame)frame=requestAnimationFrame(draw);}
  function layout(){
    const mobile=mobileLayout();
    target.top=(document.querySelector('#header')?.getBoundingClientRect().height||72)+(mobile&&mode==='detail'?12:64);
    const bounds=!inspecting&&panel?.getBoundingClientRect();
    target.right=bounds&&!mobile?Math.max(0,innerWidth-bounds.left):0;
    const hint=inspecting&&mobile?inspectionControls.querySelector('p').getBoundingClientRect():null;
    target.bottom=inspecting?(mobile&&hint?.height?innerHeight-hint.top+12:100):bounds&&mobile?Math.max(0,innerHeight-bounds.top):mode==='visit'?(document.querySelector('.gallery-cartel')?.getBoundingClientRect().height||150):0;
    schedule();
  }
  function stopArrival(){arrivalCancelled=true;target.entrance=0;host.dataset.arriving='false';}
  document.querySelector('#arrival-continue').addEventListener('click',()=>{flat=true;updateMode();readyAt=performance.now()-started;});
  function draw(time=performance.now()){
    frame=0;
    const dt=lastTime?time-lastTime:16.67,snap=flat||motion.matches||!scene;
    const resourcesReady=fontsReady&&(flat?fallbackReady:sceneReady);
    displayedProgress=advanceLoad(displayedProgress,resourcesReady?1:loadingProgress,dt);
    if(readyAt===null&&resourcesReady&&displayedProgress>=1&&time-started>=MIN_LOAD_MS)readyAt=time-started;
    const intro=arrivalState(time-started,displayedProgress,readyAt,flat||motion.matches);
    target.entrance=mode==='visit'&&!arrivalCancelled?intro.entrance:0;
    let moving=!loaderRemoved||(!arrivalCancelled&&intro.phase!=='settled');
    for(const field of Object.keys(current)){current[field]=snap?target[field]:dampProgress(current[field],target[field],dt);if(current[field]!==target[field])moving=true;}
    host.dataset.arriving=String(mode==='visit'&&!arrivalCancelled&&readyAt!==null&&current.entrance>0);
    if(!loaderRemoved){
      loader.dataset.phase=intro.phase;loader.style.opacity=intro.veil;
      loader.querySelector('.loader-copy').style.opacity=intro.copy;
      count.textContent=intro.percent;progressbar.setAttribute('aria-valuenow',String(intro.percent));
      loader.querySelector('.loader-track span').style.transform=`scaleX(${intro.percent/100})`;
      document.querySelector('#arrival-continue').hidden=!intro.canContinue;
      if(intro.percent===100&&intro.veil===0){loader.hidden=true;loaderRemoved=true;host.inert=false;document.querySelector('.skip').inert=false;document.body.classList.remove('is-loading');document.querySelector('#main').inert=inspecting;document.querySelector('#header').inert=false;}
    }
    const state=galleryState(current.progress,Math.max(1,desired.length)),work=desired[state.index];
    if(work){
      if(image.dataset.source!==work.image){image.dataset.source=work.image||'';fallbackReady=!work.image;if(work.image){image.src=work.image;image.decode().catch(()=>{}).then(()=>{fallbackReady=true;schedule();});}else image.removeAttribute('src');}
      image.hidden=!work.image;host.querySelector('.world-fallback p').hidden=!!work.image;
      host.querySelector('.world-visual').setAttribute('aria-label',`Galerie PEINTURE : ${work.title||'Aperçu'}, ${frames[frameFor(work)].label}`);
      host.dataset.frame=frameFor(work);
    }
    host.style.setProperty('--world-right',`${current.right}px`);host.style.setProperty('--world-bottom',`${current.bottom}px`);host.style.setProperty('--world-top',`${current.top}px`);
    image.style.transform=inspecting?`scale(${current.zoom}) translate(${-current.x*100}%,${current.y*100}%)`:'';
    if(scene&&!flat){scene.render({...state,focus:current.focus,angle:current.angle,entrance:current.entrance,zoom:current.zoom,panX:current.x,panY:current.y,inspecting},innerWidth,innerHeight,current);sceneReady=true;loadingProgress=Math.max(loadingProgress,.96);}
    renderedView={zoom:current.zoom,x:current.x,y:current.y};
    if(rebound&&!moving){
      rebound=false;const bounds=artworkBounds();
      if(bounds){const center={x:bounds.left+bounds.width/2+current.x*bounds.width,y:bounds.top+bounds.height/2-current.y*bounds.height};
        const limited=transformInspection(renderedView,bounds,area(),center,center);
        if(Math.abs(limited.x-target.x)+Math.abs(limited.y-target.y)>.0001){view(limited);moving=true;}
      }
    }
    if(mode==='visit')callback?.({...state,progress:current.progress});
    if(moving&&(!loaderRemoved||(!flat&&scene))){lastTime=time;schedule();}else{lastTime=0;host.dataset.settled='true';}
  }
  async function sync(next){
    desired=next.length?next.map(work=>({...work})):[{id:'empty-gallery',title:'La galerie se prépare',image:'',frame:'chene'}];
    target.progress=clamp(target.progress,0,desired.length-1);
    if(flat){schedule();return;}
    const nextIdentity=JSON.stringify(desired.map(work=>work.id));
    if(scene&&identity===nextIdentity){
      const active=scene;
      await Promise.all(desired.map(async(work,index)=>{const nextKey=key(work);if(loaded[index]===nextKey)return;loaded[index]=nextKey;try{await active.updateWork(index,work);}catch(error){loaded[index]='';throw error;}}));
      if(scene===active){status.textContent='';schedule();}return;
    }
    if(loadingIdentity===nextIdentity)return;
    const request=++generation,snapshot=desired.map(work=>({...work}));
    loadingIdentity=nextIdentity;scene?.dispose();scene=null;sceneReady=false;if(!loaderRemoved&&Number(progressbar.getAttribute('aria-valuenow'))<100)readyAt=null;host.classList.remove('world-ready');
    status.textContent='Préparation de la galerie…';schedule();
    try{
      const {createGalleryScene}=await import('./gallery-scene.js');
      if(request!==generation)return;
      loadingProgress=Math.max(loadingProgress,.2);
      const nextScene=await createGalleryScene(canvas,snapshot,value=>{if(request===generation){loadingProgress=Math.max(loadingProgress,.2+.65*value);schedule();}});
      if(request!==generation){nextScene.dispose();return;}
      scene=nextScene;identity=nextIdentity;loadingIdentity='';loaded=snapshot.map(key);
      await sync(desired);host.classList.add('world-ready');status.textContent='';
      schedule();
    }catch(error){
      if(request!==generation)return;
      console.warn('Galerie indisponible :',error);loadingIdentity='';scene?.dispose();scene=null;
      flat=true;updateMode();status.textContent='La visite continue en vue fixe. Les fiches et l’atelier restent accessibles.';
    }
  }
  function updateMode(){stopArrival();host.classList.toggle('world-flat',flat);toggle.setAttribute('aria-pressed',String(flat));toggle.textContent=flat?'Activer la 3D':'Vue sans animation';lastTime=0;schedule();}
  function setInspection(active,focus=true){
    if(active&&mode!=='detail')return;
    inspecting=active;stopArrival();document.body.classList.toggle('is-inspecting',active);document.querySelector('#main').inert=active;
    inspectionControls.hidden=!active;inspectButton.hidden=mode!=='detail'||active;
    Object.assign(target,inspectionView(active&&!mobileLayout()?1.5:1),{angle:0});
    pointers.clear();gesture=null;lastTap=null;canvas.style.cursor='';host.dataset.inspecting=String(active);
    if(focus)(active?back:inspectButton).focus({preventScroll:true});layout();
  }
  function view(next,direct=false){
    Object.assign(target,next);if(direct)Object.assign(current,next);
    const zoom=Math.round(target.zoom*100);host.querySelector('output').textContent=`${zoom} %`;
    host.querySelector('[data-zoom="out"]').disabled=target.zoom<=1;host.querySelector('[data-zoom="in"]').disabled=target.zoom>=4;schedule();
  }
  function enterInspection(){setInspection(true);view(inspectionView(mobileLayout()?1:1.5));}
  function artworkBounds(){
    if(scene&&!flat)return scene.artworkBounds();
    const bounds=image.getBoundingClientRect(),style=getComputedStyle(image);
    const left=(parseFloat(style.borderLeftWidth)||0)*current.zoom,top=(parseFloat(style.borderTopWidth)||0)*current.zoom;
    return {left:bounds.left+left,top:bounds.top+top,width:bounds.width-left*2,height:bounds.height-top*2};
  }
  function area(){return {width:Math.max(1,innerWidth-current.right),height:Math.max(1,innerHeight-current.top-current.bottom)};}
  function zoomAt(zoom,point=null){
    const bounds=artworkBounds();if(!bounds)return;
    // Interrupt button easing from the view actually on screen before a new gesture.
    const base={...renderedView},center=point||{x:bounds.left+bounds.width/2+base.x*bounds.width,y:bounds.top+bounds.height/2-base.y*bounds.height};
    view(transformInspection(base,bounds,area(),center,center,zoom/base.zoom));
  }
  inspectButton.addEventListener('click',enterInspection);
  back.addEventListener('click',()=>setInspection(false));
  host.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>button.dataset.zoom==='reset'?view(inspectionView()):zoomAt(target.zoom*(button.dataset.zoom==='in'?1.3:1/1.3))));
  toggle.addEventListener('click',()=>{flat=!flat;updateMode();if(!flat)sync(desired);});
  host.querySelector('.world-angle').addEventListener('click',event=>{target.angle=target.angle?0:1;event.currentTarget.setAttribute('aria-pressed',String(!!target.angle));event.currentTarget.textContent=target.angle?'Vue frontale':'Voir le cadre de côté';schedule();});
  motion.addEventListener('change',()=>{if(motion.matches){flat=true;updateMode();}});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();generation++;scene?.dispose();scene=null;loadingIdentity='';flat=true;host.classList.remove('world-ready');updateMode();status.textContent='Le rendu 3D a été interrompu. Vous pouvez continuer en vue fixe.';});
  canvas.addEventListener('click',event=>{
    if(inspecting||dragged||mode==='editor')return;
    if(flat){if(mode==='detail'){enterInspection();}return;}
    const id=scene?.pick(event.clientX,event.clientY);
    if(id&&desired.some(work=>work.id===id)){stopArrival();if(mode==='detail'&&id===desired[Math.round(target.progress)]?.id){enterInspection();}else onSelect(id);}
  });
  canvas.addEventListener('wheel',event=>{
    if(!inspecting){stopArrival();return;}event.preventDefault();
    const rect=area(),delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?rect.height:1);
    zoomAt(target.zoom*Math.exp(-clamp(delta,-200,200)*.002),{x:event.clientX,y:event.clientY});
  },{passive:false});
  function beginGesture(){
    const bounds=artworkBounds();
    view({...renderedView},true);
    gesture=bounds?{points:[...pointers.values()],view:{...renderedView},bounds,area:area()}:null;
  }
  canvas.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    stopArrival();
    if(!pointers.size){dragged=false;tap={id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY,blocked:event.pointerType==='touch'&&mode==='visit'&&performance.now()-lastScroll<140};}
    if(!inspecting)return;
    if(pointers.size>=2)return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});canvas.setPointerCapture(event.pointerId);beginGesture();
    if(pointers.size>1){dragged=true;lastTap=null;}
  });
  canvas.addEventListener('pointermove',event=>{
    if(tap?.id===event.pointerId&&Math.hypot(event.clientX-tap.x,event.clientY-tap.y)>7)dragged=true;
    if(!inspecting){
      if(event.pointerType==='mouse')canvas.style.cursor=!flat&&scene&&mode!=='editor'&&scene.pick(event.clientX,event.clientY)?'pointer':'default';
      return;
    }
    if(!pointers.has(event.pointerId)||!gesture)return;
    canvas.style.cursor='grabbing';pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    view(inspectionGesture(gesture.view,gesture.points,[...pointers.values()],gesture.bounds,gesture.area),true);
  });
  function endGesture(event){
    if(event.type==='lostpointercapture'&&!pointers.has(event.pointerId))return;
    if(tap?.id===event.pointerId&&tap.blocked)dragged=true;
    if(event.type==='pointercancel'||event.type==='lostpointercapture'){dragged=true;lastTap=null;}
    if(!pointers.delete(event.pointerId))return;
    if(pointers.size)beginGesture();else{
      gesture=null;canvas.style.cursor=inspecting?'grab':'';
      if(inspecting&&!dragged&&event.pointerType==='touch'&&event.type==='pointerup'){
        const now=performance.now();
        if(lastTap&&now-lastTap.time<300&&Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<24){zoomAt(target.zoom>1.05?1:2.5,{x:event.clientX,y:event.clientY});lastTap=null;}
        else lastTap={x:event.clientX,y:event.clientY,time:now};
      }
    }
  }
  canvas.addEventListener('pointerup',endGesture);canvas.addEventListener('pointercancel',endGesture);canvas.addEventListener('lostpointercapture',endGesture);
  window.addEventListener('scroll',()=>{if(mode==='visit')lastScroll=performance.now();},{passive:true});
  window.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(event.key==='Escape'){if(inspecting){event.preventDefault();setInspection(false);}else if(mode==='detail')location.hash='#galerie';}
    if(!inspecting)return;
    const moves={ArrowLeft:[-.06,0],ArrowRight:[.06,0],ArrowUp:[0,.06],ArrowDown:[0,-.06]};
    if(moves[event.key]){event.preventDefault();const [x,y]=moves[event.key];const bounds=artworkBounds();if(bounds){const base={...renderedView};view(transformInspection(base,bounds,area(),{x:0,y:0},{x:-x*bounds.width/base.zoom,y:y*bounds.height/base.zoom}));}}
    else if(['+','=','-','0'].includes(event.key)){event.preventDefault();if(event.key==='0')view(inspectionView());else zoomAt(target.zoom*(event.key==='-'?1/1.3:1.3));}
  });
  window.addEventListener('resize',()=>{if(inspecting&&innerWidth!==viewportWidth){pointers.clear();gesture=null;lastTap=null;rebound=true;}viewportWidth=innerWidth;layout();});
  host.classList.toggle('world-flat',flat);toggle.setAttribute('aria-pressed',String(flat));if(flat)toggle.textContent='Activer la 3D';
  return {
    show(works,id,nextMode,nextPanel=null){
      if(inspecting)setInspection(false,false);
      mode=nextMode;panel=nextPanel;callback=null;observer.disconnect();if(panel)observer.observe(panel);
      const index=Math.max(0,works.findIndex(work=>work.id===id));
      if(mode!=='visit'){target.progress=index;stopArrival();}
      target.focus=mode==='detail'?1:mode==='editor'?.82:mode==='overview'?.15:0;
      Object.assign(target,inspectionView(),{angle:0});
      host.querySelector('.world-angle').textContent='Voir le cadre de côté';host.querySelector('.world-angle').setAttribute('aria-pressed','false');
      host.querySelector('.world-exit').hidden=mode!=='detail';inspectButton.hidden=mode!=='detail';host.dataset.mode=mode;
      sync(works).catch(()=>{status.textContent='Ce visuel ne peut pas être chargé. Choisissez une autre image ou réessayez la 3D.';});layout();
    },
    inspect:enterInspection,
    preview(works,work){mode='editor';target.progress=0;sync([work,...works.filter(item=>item.id!==work.id)]).catch(()=>{status.textContent='Le visuel n’a pas pu être chargé. Vos informations restent dans le formulaire.';});schedule();},
    visit(progress,onFrame){if(Math.abs(target.progress-progress)>.02)stopArrival();mode='visit';callback=onFrame;target.progress=clamp(progress,0,Math.max(0,desired.length-1));schedule();},
    position(){return current.progress;},layout,stopVisit(){callback=null;}
  };
}
