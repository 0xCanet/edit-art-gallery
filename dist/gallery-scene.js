import * as THREE from './vendor/three.module.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {frames,frameFor,displayDimensions} from './frames.js';
import {galleryArc} from './gallery-math.js';

export async function createGalleryScene(canvas,works,onProgress=()=>{}) {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.96;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate=false;
  const room=new THREE.Scene();
  room.background=new THREE.Color('#f4f1eb');
  room.fog=new THREE.Fog('#f4f1eb',22,55);
  const camera=new THREE.PerspectiveCamera(46,1,0.08,80);
  const resources=new Set(),displays=[],bays=[],dividers=[],versions=works.map(()=>0);
  let disposed=false,width=0,height=0,step=6,activeIndex=0;
  const material=options=>{const result=new THREE.MeshStandardMaterial(options);resources.add(result);return result;};
  const plaster=material({color:'#efefeb',roughness:0.96});
  const stone=material({color:'#bdbbb2',roughness:0.78,metalness:0.02});
  const seam=material({color:'#c7c7bf',roughness:1});
  const dark=material({color:'#292a27',roughness:0.45,metalness:0.45});
  const brass=material({color:'#a88b55',roughness:0.3,metalness:0.75});
  const linen=material({color:'#f0e8d8',roughness:1});
  const glow=new THREE.MeshBasicMaterial({color:'#fff9e9',toneMapped:false});resources.add(glow);
  const environment=new RoomEnvironment();
  const pmrem=new THREE.PMREMGenerator(renderer);
  const env=pmrem.fromScene(environment,0.06,0.1,100);
  room.environment=env.texture;room.environmentIntensity=0.65;
  environment.dispose();pmrem.dispose();

  function texture(kind) {
    const c=document.createElement('canvas');c.width=c.height=512;
    const ctx=c.getContext('2d'),pixels=ctx.createImageData(512,512);
    let random=37;
    for(let y=0;y<512;y++) for(let x=0;x<512;x++) {
      random=(random*1664525+1013904223)>>>0;
      const noise=(random%100)/100;
      const cloud=Math.sin(x*.023+Math.cos(y*.031))*Math.cos(y*.017+x*.006);
      const grain=Math.sin(x*.48+Math.sin(y*.012)*4+Math.sin(x*.021)*2);
      const value=kind==='wood'?155+grain*16+cloud*12+noise*15:kind==='stone'?213+cloud*7+noise*11:kind==='metal'?212+Math.sin(y*2.9)*14+noise*8:220+noise*20;
      const at=(y*512+x)*4;
      pixels.data[at]=value;pixels.data[at+1]=value;pixels.data[at+2]=value;pixels.data[at+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    if(kind==='stone') {
      for(let i=0;i<5000;i++){random=(random*1664525+1013904223)>>>0;const x=random%512;random=(random*1664525+1013904223)>>>0;ctx.fillStyle=i%2?'#c5c3ba33':'#ffffff44';ctx.beginPath();ctx.ellipse(x,random%512,.3+(random%20)/20,.5,random,0,Math.PI*2);ctx.fill();}
    }
    const map=new THREE.CanvasTexture(c);map.wrapS=map.wrapT=THREE.RepeatWrapping;resources.add(map);return map;
  }
  const woodTexture=texture('wood'),plasterTexture=texture('plaster'),stoneTexture=texture('stone'),metalTexture=texture('metal');
  plasterTexture.repeat.set(7,3);plaster.bumpMap=plasterTexture;plaster.bumpScale=0.004;
  stoneTexture.repeat.set(Math.max(works.length,1)*3,6);stone.map=stoneTexture;stone.bumpMap=stoneTexture;stone.bumpScale=0.006;
  const oak=material({color:'#af926a',roughness:0.58,map:woodTexture,bumpMap:woodTexture,bumpScale:.007});
  const frameMaterials=Object.fromEntries(Object.entries(frames).map(([id,profile])=>[id,material({color:profile.color,metalness:profile.metalness,roughness:profile.roughness,...(id==='chene'||id==='noir'?{map:woodTexture,bumpMap:woodTexture,bumpScale:.004}:id==='sans'?{}:{roughnessMap:metalTexture,bumpMap:metalTexture,bumpScale:.001})})]));
  function softContact() {
    const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
    ctx.shadowColor='rgba(35,32,27,.4)';ctx.shadowBlur=22;ctx.shadowOffsetY=7;ctx.fillStyle='#29261f';ctx.fillRect(27,27,202,202);
    const map=new THREE.CanvasTexture(c);resources.add(map);return map;
  }
  const contactMap=softContact();
  const contact= new THREE.MeshBasicMaterial({map:contactMap,transparent:true,opacity:.25,depthWrite:false,toneMapped:false});resources.add(contact);

  function mesh(geometry,surface,x,y,z,parent=room,casts=true) {
    resources.add(geometry);const object=new THREE.Mesh(geometry,surface);
    object.position.set(x,y,z);object.castShadow=casts;object.receiveShadow=true;parent.add(object);return object;
  }
  const box=(w,h,d,surface,x,y,z,parent=room,casts=true)=>mesh(new THREE.BoxGeometry(w,h,d),surface,x,y,z,parent,casts);
  const length=Math.max(works.length,1)*6+10,center=Math.max(0,works.length-1)*3;
  box(length,4.3,.24,plaster,center,2.15,-.2);
  const floor=mesh(new THREE.PlaneGeometry(length,12),stone,center,-.014,4.8,room,false);floor.rotation.x=-Math.PI/2;
  box(length,.18,5.6,plaster,center,4.18,7.8);
  box(length,.18,.75,plaster,center,4.18,.25);
  box(.24,.5,10,plaster,-5,.25,4.5);
  box(.24,.65,10,plaster,-5,3.98,4.5);
  box(.24,3.4,1.3,plaster,-5,2.1,.15);
  box(.24,3.4,3.5,plaster,-5,2.1,7.85);
  box(.24,4.3,10,plaster,(works.length-1)*6+5,2.15,4.5);
  box(length,.10,.07,stone,center,.05,-.035);
  for(let x=-5;x<length-5;x+=1.5) box(.009,.006,11,seam,x,-.014,4.5,room,false);
  for(let z=1;z<10;z+=1.5) box(length,.006,.009,seam,center,-.014,z,room,false);
  box(length,.035,.16,dark,center,3.93,2.2);

  room.add(new THREE.HemisphereLight('#eef5ff','#d8d1c2',.85));
  const daylight=new THREE.DirectionalLight('#fff8ee',2.15);
  daylight.position.set(center-4,8,4);daylight.target.position.set(center,0,1.4);
  daylight.castShadow=true;daylight.shadow.mapSize.set(2048,2048);
  daylight.shadow.camera.left=-length/2-3;daylight.shadow.camera.right=length/2+3;
  daylight.shadow.camera.top=9;daylight.shadow.camera.bottom=-8;
  daylight.shadow.normalBias=.018;daylight.shadow.bias=-.00008;daylight.shadow.radius=6;daylight.shadow.blurSamples=12;
  room.add(daylight,daylight.target);

  for(let i=0;i<works.length;i++) {
    const bay=new THREE.Group();bay.position.x=i*6;room.add(bay);bays.push(bay);
    dividers.push(box(.18,4.1,.55,plaster,3,2.05,.15,bay));
    const glass=material({color:'#ecf4fa',roughness:.3,transparent:true,opacity:.18,metalness:.15});
    box(4.6,.025,3.7,glass,0,4.28,2.75,bay,false);
    for(const z of [1.05,2.75,4.45]) box(4.7,.065,.055,plaster,0,4.16,z,bay);
    box(.08,.065,3.5,plaster,0,4.16,2.75,bay);
    box(.10,.20,6,plaster,2.4,4.06,2.8,bay);
    box(4.6,.10,.10,plaster,0,4.06,.8,bay);
    for(const dx of [-.7,.7]) {
      const spot=new THREE.SpotLight('#fff8ef',8,8,Math.PI/4.5,1,2);
      spot.position.set(dx,3.75,2.2);spot.target.position.set(0,1.7,.1);bay.add(spot,spot.target);
      const fixture=mesh(new THREE.CylinderGeometry(.095,.095,.27,20),dark,dx,3.72,2.2,bay);
      fixture.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-dx,-2.05,-2.1).normalize());
      const bulb=mesh(new THREE.CircleGeometry(.07,20),glow,dx,3.6,2.08,bay,false);
      bulb.rotation.x=-Math.PI/4;
    }
    box(1.65,.10,.54,oak,2.15,.48,2.8,bay);
    box(.07,.42,.40,dark,1.55,.22,2.8,bay);
    box(.07,.42,.40,dark,2.75,.22,2.8,bay);
    box(.28,.13,.017,linen,1.55,1.25,.005,bay,false);
    box(.18,.008,.004,seam,1.55,1.27,.017,bay,false);
    box(.13,.006,.004,seam,1.525,1.24,.017,bay,false);
  }
  box(.65,.95,.65,plaster,-3.4,.47,1.8);
  const sculpture=mesh(new THREE.TorusKnotGeometry(.25,.065,90,12,2,3),brass,-3.4,1.28,1.8);
  sculpture.rotation.z=.25;
  const sky=new THREE.MeshBasicMaterial({color:'#edf5fc',toneMapped:false});resources.add(sky);
  box(.06,2.9,4.2,sky,-5.15,2.0,3.4,room,false);
  for(const z of [1.5,3.4,5.3]) box(.09,3.15,.07,plaster,-4.77,2,z);
  box(.09,.07,3.9,plaster,-4.77,2,3.4);

  function ring(w,h,border,depth,surface,z,parent) {
    const shape=new THREE.Shape();shape.moveTo(-w/2,-h/2);shape.lineTo(w/2,-h/2);shape.lineTo(w/2,h/2);shape.lineTo(-w/2,h/2);shape.closePath();
    const hole=new THREE.Path();hole.moveTo(-w/2+border,-h/2+border);hole.lineTo(-w/2+border,h/2-border);hole.lineTo(w/2-border,h/2-border);hole.lineTo(w/2-border,-h/2+border);hole.closePath();shape.holes.push(hole);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:Math.min(.012,border/4),bevelThickness:.008,curveSegments:1});
    const object=new THREE.Mesh(geometry,surface);object.position.z=z;object.castShadow=true;object.receiveShadow=true;parent.add(object);return geometry;
  }

  async function updateWork(index,work) {
    if(disposed||!bays[index])return;
    const revision=++versions[index],previous=displays[index];
    let texture=previous?.image===work.image?previous.texture:null;
    if(work.image&&!texture) texture=await new THREE.TextureLoader().loadAsync(work.image);
    if(disposed||revision!==versions[index]) {if(texture&&texture!==previous?.texture)texture.dispose();return;}
    if(texture){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}
    const size=displayDimensions(texture?texture.image.width/texture.image.height:.8,frameFor(work));
    const root=new THREE.Group();root.position.set(0,1.7,.025);root.userData.workId=work.id;
    const local=new Set();
    const addBox=(w,h,d,surface,z)=>{const geometry=new THREE.BoxGeometry(w,h,d);local.add(geometry);const object=new THREE.Mesh(geometry,surface);object.position.z=z;object.castShadow=true;object.receiveShadow=true;root.add(object);};
    addBox(size.w,size.h,.055,linen,.04);
    const imageGeometry=new THREE.PlaneGeometry(size.w,size.h);local.add(imageGeometry);
    const imageMaterial=texture?new THREE.MeshBasicMaterial({map:texture,toneMapped:false}):new THREE.MeshStandardMaterial({color:'#ded5c4',roughness:1});local.add(imageMaterial);
    const painting=new THREE.Mesh(imageGeometry,imageMaterial);painting.position.z=.073;root.add(painting);
    const id=frameFor(work),profile=frames[id];
    if(id!=='sans') {
      local.add(ring(size.outerW,size.outerH,profile.width,profile.depth,frameMaterials[id],.01,root));
      if(id==='classique') {
        local.add(ring(size.outerW-.045,size.outerH-.045,.025,.035,frameMaterials[id],.13,root));
        local.add(ring(size.w+.075,size.h+.075,.026,.025,frameMaterials[id],.13,root));
        for(const x of [-1,1]) for(const y of [-1,1]) {
          const geometry=new THREE.SphereGeometry(.027,12,8);local.add(geometry);
          const bead=new THREE.Mesh(geometry,frameMaterials[id]);bead.position.set(x*(size.outerW/2-.065),y*(size.outerH/2-.065),.16);root.add(bead);
        }
      } else local.add(ring(size.w+.025,size.h+.025,.008,.014,dark,.074,root));
    }
    const shadowGeometry=new THREE.PlaneGeometry(size.outerW*1.21,size.outerH*1.15);local.add(shadowGeometry);const shadow=new THREE.Mesh(shadowGeometry,contact);shadow.position.set(.015,-.025,-.075);root.add(shadow);
    bays[index].add(root);
    if(previous){previous.root.removeFromParent();previous.local.forEach(item=>item.dispose());if(previous.texture&&previous.texture!==texture)previous.texture.dispose();}
    displays[index]={root,local,texture,image:work.image,size};
    renderer.shadowMap.needsUpdate=true;
  }

  function dispose() {
    if(disposed)return;disposed=true;
    displays.forEach(display=>{display?.local.forEach(item=>item.dispose());display?.texture?.dispose();});
    resources.forEach(item=>item.dispose());daylight.shadow.dispose();env.dispose();renderer.dispose();
  }
  // shortcut: all works are loaded for this small exhibition; stream bays for a large catalogue.
  let completed=0;
  try {await Promise.all(works.map(async(work,index)=>{await updateWork(index,work);onProgress(++completed/Math.max(1,works.length));}));} catch(error){dispose();throw error;}
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  return {
    updateWork,
    render(state,nextWidth,nextHeight,layout={right:0,bottom:150,top:88}) {
      if(disposed||!nextWidth||!nextHeight)return;
      const mobile=nextWidth<900,newStep=mobile?4.8:6;
      if(width!==nextWidth||height!==nextHeight) {
        width=nextWidth;height=nextHeight;const moved=newStep!==step;step=newStep;
        const ratio=Math.min(devicePixelRatio||1,mobile?1.4:1.75);if(renderer.getPixelRatio()!==ratio)renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);camera.aspect=width/height;
        if(moved){bays.forEach((bay,index)=>{bay.position.x=index*step;dividers[index].position.x=step/2;});renderer.shadowMap.needsUpdate=true;}
      }
      const freeW=Math.max(width*.30,width-layout.right),freeH=Math.max(height*.22,height-layout.top-layout.bottom);
      // Keep the visible mobile room's lens stable when a sheet covers the lower canvas.
      camera.fov=mobile?THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(23))*height/freeH)):46;
      const focus=state.focus||0,fill=THREE.MathUtils.lerp(.46,.78,focus);
      const fit=size=>Math.max(size.outerH/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*(freeH/height)*fill),size.outerW/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect*(freeW/width)*fill));
      const from=Math.min(displays.length-1,Math.floor(state.position)),to=Math.min(displays.length-1,from+1);
      const arc=galleryArc(state,mobile),entrance=state.entrance||0,zoom=state.zoom||1;
      const distance=THREE.MathUtils.lerp(fit(displays[from].size),fit(displays[to].size),state.position-from)/zoom+arc.pullback*(1-focus)+entrance*.85;
      activeIndex=Math.round(state.position);const size=displays[activeIndex].size;
      const x=state.position*step+(state.panX||0)*size.w,y=1.7+(state.panY||0)*size.h;
      const yaw=(1-focus)*arc.sway+(state.angle||0)*.32;
      camera.setViewOffset(width,height,layout.right/2,(layout.bottom-layout.top)/2,width,height);
      camera.position.set(x+Math.sin(yaw)*distance,y+arc.rise*(1-focus),Math.cos(yaw)*distance+.09);
      camera.lookAt(x,y,.09);
      renderer.render(room,camera);
    },
    artworkBounds() {
      const display=displays[activeIndex];if(!width||!display)return null;
      const {root,size}=display;
      const points=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>new THREE.Vector3(x*size.w/2,y*size.h/2,.073).applyMatrix4(root.matrixWorld).project(camera));
      const xs=points.map(p=>(p.x+1)*width/2),ys=points.map(p=>(1-p.y)*height/2);
      const left=Math.min(...xs),top=Math.min(...ys);
      return {left,top,width:Math.max(...xs)-left,height:Math.max(...ys)-top};
    },
    pick(x,y) {
      pointer.set(x/width*2-1,-y/height*2+1);raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(room.children,true)[0];
      if(!hit)return null;let root=hit.object;while(root&&!root.userData.workId)root=root.parent;return root?.userData.workId||null;
    },
    dispose
  };
}
