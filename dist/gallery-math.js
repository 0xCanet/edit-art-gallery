export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// A short pause at each painting makes the scroll path readable in both directions.
export function galleryState(progress, count) {
  const point = clamp(progress, 0, Math.max(0, count - 1));
  const from = Math.floor(point);
  const t = clamp((point - from - 0.12) / 0.76, 0, 1);
  const eased = clamp(t * t * t * (t * (t * 6 - 15) + 10),0,1);
  return { index: Math.round(point), position: from + eased, retreat: Math.sin(Math.PI * eased) };
}

// Time-based damping gives the same camera response at 60 Hz and 120 Hz.
export function dampProgress(current, target, elapsedMs) {
  const next = current + (target - current) * (1 - Math.exp(-clamp(elapsedMs,0,64)/105));
  return Math.abs(target-next)<0.0001 ? target : next;
}

export function scrollProgress(scrollY, top, travel, count) {
  return clamp((scrollY - top) / Math.max(1, travel), 0, 1) * Math.max(0, count - 1);
}

export function galleryArc(state,mobile=false) {
  const phase=state.position-Math.floor(state.position);
  return {pullback:state.retreat*(mobile?.7:1.5),sway:Math.sin(2*Math.PI*phase)*.14,rise:state.retreat*.09};
}

export function inspectionView(zoom=1,x=0,y=0) {
  zoom=clamp(Number.isFinite(zoom)?zoom:1,1,4);
  const edge=(1-1/zoom)/2;
  return {zoom,x:clamp(Number.isFinite(x)?x:0,-edge,edge),y:clamp(Number.isFinite(y)?y:0,-edge,edge)};
}
export function zoomInspection(view,zoom,point={x:0,y:0}) {
  const next=inspectionView(zoom);
  return inspectionView(next.zoom,view.x+point.x*(1/view.zoom-1/next.zoom),view.y+point.y*(1/view.zoom-1/next.zoom));
}

// Coordinates use the projected artwork, so one pixel under the finger stays one pixel on screen.
export function transformInspection(view,bounds,area,from,to,scale=1) {
  if(bounds.width<=0||bounds.height<=0)return inspectionView(view.zoom,view.x,view.y);
  const zoom=clamp(view.zoom*scale,1,4),baseW=bounds.width/view.zoom,baseH=bounds.height/view.zoom;
  const centerX=bounds.left+bounds.width/2+view.x*bounds.width;
  const centerY=bounds.top+bounds.height/2-view.y*bounds.height;
  const anchorX=(from.x-bounds.left)/bounds.width-.5,anchorY=.5-(from.y-bounds.top)/bounds.height;
  const edgeX=Math.max(0,(1-area.width/(baseW*zoom))/2),edgeY=Math.max(0,(1-area.height/(baseH*zoom))/2);
  return {zoom,x:clamp(anchorX-(to.x-centerX)/(baseW*zoom),-edgeX,edgeX),y:clamp(anchorY+(to.y-centerY)/(baseH*zoom),-edgeY,edgeY)};
}
export function inspectionGesture(view,start,end,bounds,area) {
  if(!start.length||start.length!==end.length)return {...view};
  const center=points=>({x:(points[0].x+(points[1]?.x??points[0].x))/2,y:(points[0].y+(points[1]?.y??points[0].y))/2});
  const distance=points=>points.length>1?Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y):0;
  const initial=distance(start),scale=initial>8?distance(end)/initial:1;
  return transformInspection(view,bounds,area,center(start),center(end),scale);
}
