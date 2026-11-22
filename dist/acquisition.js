import {formatPrice} from './data.js';
import {frames,frameFor} from './frames.js';
export const acquisitionReasons = ['Recevoir le dossier d’acquisition','Organiser une présentation privée','Échanger sur l’acquisition'];
// Set to the gallery address once supplied; never substitute the site owner's account.
export const acquisitionEmail = '';
const validEmail = value => typeof value==='string' && value.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function buildAcquisitionDraft(work, {name='',email='',reason,message=''}) {
  if(typeof name!=='string' || typeof email!=='string' || typeof message!=='string') throw Error('Vérifiez les informations de votre demande.');
  name=name.trim();email=email.trim();message=message.trim();
  if(name.length<2 || name.length>100 || /[\r\n]/.test(name)) throw Error('Indiquez votre nom (2 à 100 caractères).');
  if(!validEmail(email)) throw Error('Indiquez une adresse e-mail valide.');
  if(!acquisitionReasons.includes(reason)) throw Error('Choisissez un objet de demande.');
  if(message.length>2000) throw Error('Limitez votre message à 2 000 caractères.');
  const title=work.title.replace(/[\r\n]+/g,' ');
  return {
    subject:`Demande d’acquisition — ${title}`,
    body:[
      'Bonjour,','',`Je souhaite prendre contact au sujet de l’œuvre « ${title} ».`,
      `Artiste / collection : ${work.artist}`,`Référence PITTURA : ${work.id}`,`Encadrement : ${frames[frameFor(work)].label}`,
      `Prix présenté : ${formatPrice(work.price)}`,
      '',`Objet de ma demande : ${reason}`,message?`\n${message}`:'',
      '',`Nom : ${name}`,`E-mail : ${email}`
    ].join('\n')
  };
}

export function acquisitionMailto(recipient,draft) {
  if(!recipient) return '';
  if(!validEmail(recipient)) throw Error('L’adresse de la galerie est invalide.');
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
}
