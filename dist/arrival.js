import {clamp} from './gallery-math.js';

export const MIN_LOAD_MS=1500;
export const WHITE_HOLD_MS=250;
export const REVEAL_MS=1400;
export const APPROACH_MS=3600;
const smooth=value=>{const t=clamp(value,0,1);return t*t*t*(t*(t*6-15)+10);};

export function advanceLoad(current,available,elapsedFrame) {
  return Math.max(current,Math.min(clamp(available,0,1),current+clamp(elapsedFrame,0,64)/MIN_LOAD_MS));
}

// Readiness is reported by fonts, artwork textures and the first rendered frame.
export function arrivalState(elapsed,progress,readyAt=null,reduced=false) {
  elapsed=Math.max(0,elapsed);
  const release=readyAt===null?Infinity:Math.max(MIN_LOAD_MS,readyAt);
  const age=elapsed-release;
  if(age<0)return {percent:Math.min(99,Math.floor(Math.min(clamp(progress,0,1),elapsed/MIN_LOAD_MS)*100)),phase:'loading',veil:1,copy:1,entrance:reduced?0:1,canContinue:elapsed>=7000&&readyAt===null};
  const reveal=age-WHITE_HOLD_MS;
  const veil=1-smooth(reveal/(reduced?180:REVEAL_MS));
  const entrance=reduced?0:1-smooth(reveal/APPROACH_MS);
  const phase=age<WHITE_HOLD_MS?'white':veil>0?'reveal':entrance>0?'arriving':'settled';
  return {percent:100,phase,veil,copy:1-smooth(age/WHITE_HOLD_MS),entrance,canContinue:false};
}
