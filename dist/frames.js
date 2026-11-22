export const frames={
  chene:{label:'Chêne naturel',width:0.075,depth:0.085,color:'#ad8350',metalness:0,roughness:0.72},
  noir:{label:'Bois noir',width:0.065,depth:0.075,color:'#252421',metalness:0,roughness:0.52},
  laiton:{label:'Laiton brossé',width:0.045,depth:0.065,color:'#b39455',metalness:0.78,roughness:0.3},
  classique:{label:'Doré mouluré',width:0.15,depth:0.12,color:'#a89261',metalness:0.84,roughness:0.34},
  sans:{label:'Sans cadre',width:0,depth:0.045,color:'#f3eee2',metalness:0,roughness:1}
};
export const frameFor = work => typeof work?.frame==='string'&&Object.hasOwn(frames,work.frame)?work.frame:'chene';
export function displayDimensions(aspect,frame='chene') {
  if(!Number.isFinite(aspect)||aspect<=0) throw Error('Proportions de visuel invalides.');
  const h=Math.min(1.95,2.65/aspect),w=h*aspect;
  const profile=frames[frame]||frames.chene;
  return {w,h,outerW:w+2*profile.width,outerH:h+2*profile.width};
}
