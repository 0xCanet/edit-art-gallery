import {frames} from './frames.js';
export const MIN_PRICE = 500000;
export const formatPrice = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
export const KEY = 'edit-artworks-v1';
export const seed = [
 {id:'lumiere',frame:'classique',title:'La couleur du silence',artist:'Collection ÉDIT',year:2025,medium:'Acrylique sur toile',category:'Peinture',width:80,height:100,price:500000,description:'Une composition lumineuse où les jaunes solaires rencontrent la profondeur du bleu. La matière et le geste invitent à s’approcher, puis à prendre du recul.',image:'assets/oeuvre-01.jpg',status:'published',demo:true},
 {id:'maree',frame:'chene',title:'Mouvements intérieurs',artist:'Collection ÉDIT',year:2025,medium:'Encres et pigments',category:'Peinture',width:90,height:90,price:780000,description:'Des nappes de couleur se rencontrent, entre terre et eau. Une exploration de l’équilibre, des transparences et des mouvements presque imperceptibles.',image:'assets/oeuvre-05.jpg',status:'published',demo:true},
 {id:'reflets',frame:'noir',title:'Reflets, étude n° 3',artist:'Collection ÉDIT',year:2024,medium:'Photographie abstraite',category:'Photographie',width:60,height:90,price:1250000,description:'La lumière transforme la surface en paysage. Des reflets magenta et argentés dessinent un rythme libre, à la frontière de la photographie et de la peinture.',image:'assets/oeuvre-04.jpg',status:'published',demo:true}
];
export const escape = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validImage(src){return typeof src==='string' && (/^assets\/oeuvre-0[145]\.jpg$/.test(src)||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src));}
export function validWork(w){return w && (w.frame===undefined||(typeof w.frame==='string'&&Object.hasOwn(frames,w.frame))) && typeof w.id==='string' && typeof w.title==='string' && typeof w.artist==='string' && typeof w.description==='string' && typeof w.medium==='string' && ['Peinture','Photographie','Sculpture','Édition'].includes(w.category) && ['draft','published'].includes(w.status) && ['width','height','price','year'].every(k=>Number.isFinite(w[k])&&w[k]>0) && validImage(w.image);}
export function filterWorks(works,{category='Toutes',query='',status='all',favorites=null}={}){
 const q=query.toLocaleLowerCase('fr').trim();
 return works.filter(w=>(category==='Toutes'||w.category===category)&&(status==='all'||w.status===status)&&(!favorites||favorites.includes(w.id))&&`${w.title} ${w.artist} ${w.medium}`.toLocaleLowerCase('fr').includes(q));
}

// Only refresh unchanged V1 examples; preserve every personal listing and custom price.
export function refreshDemoPrices(works) {
 const previous = {lumiere:1850,maree:2400,reflets:780};
 return works.map(work => {
  const example = seed.find(item => item.id === work.id);
  return example && work.demo && work.price === previous[work.id] && work.image === example.image ? {...work,price:example.price} : work;
 });
}
export const canExhibit = work => work.status === 'published' && work.price >= MIN_PRICE;
