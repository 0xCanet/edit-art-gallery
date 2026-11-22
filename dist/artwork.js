import {escape as e,formatPrice,seed} from './data.js';
import {frames,frameFor} from './frames.js';
import {acquisitionEmail,acquisitionReasons,buildAcquisitionDraft,acquisitionMailto} from './acquisition.js';

const stories={
  lumiere:{title:'Couleur et matière.',paragraph:'Le jaune et le rouge occupent l’essentiel de la toile. Des passages turquoise traversent la composition et laissent voir les variations de matière.'},
  maree:{title:'La composition.',paragraph:'Des plages roses et bleues se superposent. Leurs contours diffus et leurs transparences donnent à la composition l’aspect d’un paysage vu de haut.'},
  reflets:{title:'Les reflets.',paragraph:'Les reflets magenta et argentés suivent les plis de la surface. Le cadrage serré isole les variations de lumière et de couleur.'}
};

export function artworkMarkup(w,favorite,heartIcon) {
  const example=seed.find(item=>item.id===w.id && item.image===w.image);
  const story=w.demo && example?stories[w.id]:null;
  return `<article class="artwork-page world-panel" data-world-panel>
    <div class="wrap">
      <nav class="artwork-tabs" role="tablist" aria-label="Découvrir cette œuvre"><button type="button" role="tab" id="tab-oeuvre" aria-controls="panel-oeuvre" aria-selected="true" data-artwork-tab="oeuvre">L’œuvre</button><button type="button" role="tab" id="tab-dossier" aria-controls="panel-dossier" aria-selected="false" tabindex="-1" data-artwork-tab="dossier">Le dossier</button><button type="button" role="tab" id="tab-acquisition" aria-controls="acquisition" aria-selected="false" tabindex="-1" data-artwork-tab="acquisition">Acquisition</button></nav><div class="artwork-tab-panel" role="tabpanel" id="panel-oeuvre" aria-labelledby="tab-oeuvre" data-tab-content="oeuvre"><section class="artwork-hero" aria-labelledby="artwork-title">
        <figure class="artwork-figure"><div class="artwork-wall"><button type="button" class="artwork-expand" aria-label="Voir ${e(w.title)} en grand"><img src="${e(w.image)}" alt="${e(w.title)}" width="800" height="1000" fetchpriority="high"></button><span class="artwork-room-floor" aria-hidden="true"></span></div><figcaption><span>Vue de l’œuvre entière</span><button type="button" class="artwork-enlarge">Voir en grand</button></figcaption></figure>
        <div class="artwork-intro">
          <h1 id="artwork-title">${e(w.title)}</h1><p class="artwork-artist">${e(w.artist)} <span>· ${w.year}</span></p>
          <p class="artwork-description">${e(w.description)}</p>
          <dl class="artwork-specs"><div><dt>Technique</dt><dd>${e(w.medium)}</dd></div><div><dt>Dimensions</dt><dd>${w.width} × ${w.height} cm</dd></div><div><dt>Catégorie</dt><dd>${e(w.category)}</dd></div><div><dt>Encadrement</dt><dd>${frames[frameFor(w)].label}</dd></div><div><dt>Référence PITTURA</dt><dd>${e(w.id.toUpperCase())}</dd></div></dl>
          <div class="artwork-price"><span>Prix</span><p>${formatPrice(w.price)}</p></div>
          <button class="button artwork-primary" type="button" data-work-section="acquisition">Parler de cette acquisition</button>
          <button class="button secondary artwork-inspect" type="button" data-inspect-work>Explorer les détails</button><div class="artwork-secondary"><button class="artwork-save ${favorite?'filled':''}" type="button" data-detail-favorite="${e(w.id)}" aria-pressed="${favorite}">${heartIcon}<span>${favorite?'Retirer de ma sélection':'Ajouter à ma sélection'}</span></button><button class="artwork-story-link" type="button" data-work-section="artwork-story">Lire l’histoire</button><button class="artwork-enlarge" type="button">Voir le visuel</button></div>
        </div>
      </section>
      <section class="artwork-story artwork-section" id="artwork-story" aria-labelledby="story-heading"><div><h2 id="story-heading" tabindex="-1">L’histoire de l’œuvre.</h2></div><div class="artwork-story-copy">${story?`<h3>${e(story.title)}</h3><p>${e(story.paragraph)}</p>`:`<p>${e(w.description)}</p>`}</div></section>
      </div><section class="artwork-dossier artwork-section artwork-tab-panel" id="panel-dossier" role="tabpanel" data-tab-content="dossier" hidden aria-labelledby="tab-dossier"><div><h2 id="dossier-heading">Le dossier de l’œuvre.</h2><p>Un échange avec la galerie permet de préciser les documents et les conditions de l’acquisition.</p></div><div><dl class="artwork-document-list"><div><dt>Provenance</dt><dd>À documenter</dd></div><div><dt>Authenticité</dt><dd>Justificatif non fourni</dd></div><div><dt>État de conservation</dt><dd>Rapport non fourni</dd></div><div><dt>Transport et assurance</dt><dd>À étudier selon la destination</dd></div><div><dt>Frais et conditions</dt><dd>À préciser dans l’offre</dd></div></dl><p class="artwork-editorial-note">Aucun certificat, historique de provenance ou rapport d’état n’est joint à cette fiche.</p></div></section>
      <section class="acquisition-section artwork-section artwork-tab-panel" id="acquisition" role="tabpanel" data-tab-content="acquisition" hidden aria-labelledby="tab-acquisition"><div class="acquisition-intro"><h2 id="acquisition-heading" tabindex="-1">Acquérir cette œuvre.</h2><p>Recevoir le dossier, demander un rendez-vous ou poser une question.</p><div class="acquisition-work"><img src="${e(w.image)}" alt="" width="64" height="80" loading="lazy"><div><h3>${e(w.title)}</h3><p>${e(w.artist)} · ${formatPrice(w.price)}</p><span>Référence PITTURA : ${e(w.id.toUpperCase())}</span></div></div><p class="acquisition-delivery-note">${acquisitionEmail?'Votre message sera préparé pour votre messagerie. Vous gardez la main sur son envoi.':'Préparez votre message, puis copiez-le pour le transmettre.'}</p></div>
        <div class="acquisition-form-column"><form id="acquisition-form"><div class="field-pair"><label class="field">Votre nom<input name="name" autocomplete="name" required minlength="2" maxlength="100" placeholder="Prénom et nom"></label><label class="field">Votre e-mail<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="vous@exemple.fr"></label></div><label class="field">Votre demande<select name="reason">${acquisitionReasons.map(reason=>`<option>${reason}</option>`).join('')}</select></label><label class="field">Votre message <span class="field-optional">Facultatif</span><textarea name="message" maxlength="2000" rows="4" placeholder="Vos questions, votre projet ou vos disponibilités…"></textarea></label><button type="submit" class="button acquisition-submit">Préparer ma demande</button><p class="acquisition-privacy">Vos coordonnées ne sont pas enregistrées.</p><p id="acquisition-error" class="error" role="alert"></p></form>
        <section class="acquisition-preview" hidden aria-labelledby="preview-heading"><h3 id="preview-heading" tabindex="-1">Votre message.</h3><p class="acquisition-preview-subject"></p><label class="field">Message préparé<textarea class="acquisition-draft" readonly rows="12"></textarea></label><div class="acquisition-preview-actions"><a class="button acquisition-email-link" hidden>Ouvrir dans ma messagerie</a><button class="button secondary acquisition-copy" type="button">Copier le message</button><button class="artwork-story-link acquisition-edit" type="button">Modifier ma demande</button></div><p class="acquisition-preview-help">${acquisitionEmail?'Le message ne sera envoyé qu’après votre validation dans votre messagerie.':'Copiez votre message pour le transmettre à votre interlocuteur.'}</p><p class="acquisition-copy-status" role="status"></p></section></div>
      </section>
      <div class="artwork-close"><a class="text-link" href="#galerie">Reprendre la visite</a><a class="text-link" href="#collection">Toutes les œuvres</a></div>
    </div>

    <dialog class="artwork-lightbox" aria-labelledby="lightbox-heading"><div class="artwork-lightbox-header"><h2 id="lightbox-heading">${e(w.title)}</h2><button class="button secondary artwork-lightbox-close" type="button" autofocus>Fermer</button></div><img src="${e(w.image)}" alt="${e(w.title)}, vue agrandie" width="1000" height="1266"></dialog>
  </article>`;
}

export function mountArtwork(root,w) {
  const $=selector=>root.querySelector(selector);
  const form=$('#acquisition-form'), preview=$('.acquisition-preview'), error=$('#acquisition-error');
  const dialog=$('.artwork-lightbox');
  let draft=null;
  const tabs=[...root.querySelectorAll('[data-artwork-tab]')];
  function selectTab(key,focus=false){
    tabs.forEach(tab=>{const active=tab.dataset.artworkTab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
    root.querySelectorAll('[data-tab-content]').forEach(panel=>{panel.hidden=panel.dataset.tabContent!==key;});root.scrollTop=0;
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTab(tab.dataset.artworkTab));
    tab.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();const next=tabs[(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length];selectTab(next.dataset.artworkTab,true);}});
  });
  root.querySelectorAll('[data-work-section]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.workSection==='acquisition'?'acquisition':'oeuvre';selectTab(key);
    const section=$(`#${button.dataset.workSection}`);
    if(key==='oeuvre')section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    section.querySelector('h2').focus({preventScroll:true});
  }));
  root.querySelectorAll('.artwork-expand,.artwork-enlarge').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
  $('.artwork-lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  form.addEventListener('submit',event=>{
    event.preventDefault();error.textContent='';
    try {
      draft=buildAcquisitionDraft(w,Object.fromEntries(new FormData(form)));
      $('.acquisition-preview-subject').textContent=draft.subject;
      $('.acquisition-draft').value=draft.body;
      const href=acquisitionMailto(acquisitionEmail,draft);
      $('.acquisition-email-link').hidden=!href;
      if(href) $('.acquisition-email-link').href=href;
      form.hidden=true;preview.hidden=false;
      $('.acquisition-copy-status').textContent='';
      preview.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      $('#preview-heading').focus({preventScroll:true});
    } catch(err) {error.textContent=err.message;}
  });
  $('.acquisition-edit').addEventListener('click',()=>{preview.hidden=true;form.hidden=false;form.elements.name.focus();});
  $('.acquisition-copy').addEventListener('click',async()=>{
    if(!draft)return;
    try {await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);$('.acquisition-copy-status').textContent='Message copié. Vous pouvez le conserver ou le coller dans votre messagerie.';}
    catch {$('.acquisition-draft').focus();$('.acquisition-draft').select();$('.acquisition-copy-status').textContent='La copie automatique est indisponible. Copiez le texte sélectionné.';}
  });
  return ()=>{if(dialog.open)dialog.close();};
}
