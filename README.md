# ÉDIT — galerie immersive et atelier

Prototype de marketplace d’art en français. HTML/CSS/JavaScript natifs et Three.js 0.187.0 embarqué localement ; aucun CDN ni installation pour lancer la visite.

## Lancer et vérifier

`python3 -m http.server 4173 --directory dist`

Ouvrir http://localhost:4173. Le configurateur se trouve dans `/#atelier`. Tests : `node tests.mjs`.

## Expérience

Une scène persistante constitue le fond de toute l’application. La caméra traverse les accrochages au scroll natif, avec commandes précédent/suivant et clavier. Le catalogue, la sélection, les fiches et l’atelier sont des panneaux superposés à la même salle. Une arrivée de caméra de 1,6 seconde révèle la salle puis se pose devant le premier tableau. Elle est interrompue dès la première interaction et désactivée en mouvement réduit. La trajectoire entre deux accrochages recule, décrit un léger arc et se rapproche à nouveau. Le logo est centré dans une navigation intégrée en haut de la salle.

Un premier clic sur un tableau 3D ouvre sa fiche ; un second clic sur le tableau (ou « Explorer les détails ») passe en exploration. La fiche se retire sans perdre son contenu. Le zoom est limité de 100 à 400 %, avec déplacement par glisser, molette, pincement à deux doigts et commandes clavier (+/−, flèches, 0). Les bornes du déplacement suivent le niveau de zoom. « Revenir à la fiche » et Échap quittent l’exploration ; « Quitter l’œuvre » revient directement à la visite à la même œuvre. Le formulaire d’acquisition reste en place après l’exploration. Le zoom affiche les pixels du fichier disponible, sans reconstituer des détails absents. Sur mobile, les panneaux occupent le bas de l’écran et la salle reste visible au-dessus ; en paysage, ils passent sur le côté.

La salle comprend murs et plafond, verrières, rails et projecteurs, sol minéral avec joints, bancs, cartels et sculpture. L’environnement fournit les reflets ; la lumière naturelle passe par les ouvertures de la salle et projette des ombres VSM filtrées. Les enduits, la pierre veinée et mouchetée, le bois et les métaux brossés utilisent des textures et des reliefs procéduraux. Les cartes d’ombres sont actualisées à la création, au changement d’accrochage ou de cadre et au redimensionnement, puis réutilisées pendant les mouvements.

Chaque tableau possède une épaisseur et un cadre biseauté en géométrie. Le configurateur propose chêne naturel, bois noir, laiton brossé, doré mouluré ou sans cadre. Le résultat apparaît immédiatement dans la salle ; la vue de côté montre le relief. Le choix est sauvegardé et repris dans la vitrine, la fiche et le brouillon d’acquisition. Les anciennes œuvres sans champ de cadre restent compatibles (chêne par défaut). Les proportions de l’image sont conservées ; l’échelle de présentation est adaptée à la salle et ne constitue pas une simulation métrique des dimensions déclarées.

Les images JPG/PNG/WebP sont réduites à 1400 px avant stockage. Brouillons, publication, retrait, modification, favoris et recherche sont disponibles. La vue sans animation et le repli en cas d’échec WebGL conservent les commandes HTML et les formulaires.

Le rendu s’arrête au repos. L’amorti est calculé selon le temps écoulé ; résolution limitée à 1,4× sur mobile et 1,75× sur desktop. Le moteur reste actif entre les pages et libère la scène lors d’un changement de composition de l’exposition. Cette version charge toutes les œuvres de la petite exposition ; un grand catalogue demanderait un chargement progressif et une limitation des éclairages.

## Gestes et lecture sur mobile

La visite conserve le scroll natif. Chaque étape dispose de 145 svh ; après la fin du défilement, la caméra se pose sur l’accrochage le plus proche. Cette aide attend la fin du contact et ne s’active pas pendant un zoom de page. La hauteur visible suit les barres du navigateur sans changer la distance de visite entre les œuvres ; une rotation conserve l’œuvre courante.

En portrait, l’exploration commence à 100 %, œuvre entière. Les sorties « Quitter l’œuvre » et « Revenir à la fiche » sont regroupées en bas avec les commandes de zoom, au-dessus de la zone de sécurité du téléphone. Les cibles font au moins 44 px. Le zoom et le glisser suivent directement les doigts, sans amorti de caméra. Le pincement conserve le détail sous son centre mobile, calculé à partir des dimensions projetées du tableau ; les limites de déplacement tiennent compte du cadrage réel. Le passage de deux doigts à un doigt réinitialise le geste sur la vue visible. Un double toucher zoome sur le point visé ou revient à 100 %. Les annulations de contact libèrent le geste ; un scroll ne déclenche pas une ouverture d’œuvre.

Le moteur évite les calculs de survol pendant les gestes tactiles et conserve les cartes d’ombres quand seule la hauteur du navigateur change. Les tests numériques vérifient le point d’ancrage, le déplacement du centre du pincement, la correspondance du déplacement en pixels, la reprise à un doigt, les limites et les contacts confondus. Le rendu et les sorties sont contrôlés en portrait, paysage et desktop dans le navigateur ; les gestes et performances sur iPhone/Android physiques restent à valider.

## Œuvres et acquisition

Prix minimum : 500 000 €. Exemples : 500 000 €, 780 000 €, 1 250 000 €. Les anciens exemples inchangés sont réévalués en mémoire ; les données personnelles sont conservées. Une œuvre personnelle sous le seuil reste accessible dans l’atelier et quitte la vitrine jusqu’à sa réévaluation.

La fiche propose trois onglets : l’œuvre et son histoire, le dossier, l’acquisition. Le visuel source est agrandissable dans un dialogue natif. Les textes éditoriaux des exemples sont illustratifs ; aucune provenance ou certification n’est inventée.

Le formulaire prépare un message contextualisé, modifiable et copiable. Aucune coordonnée n’est stockée ni transmise. Le destinataire n’a pas été fourni : `acquisitionEmail` reste vide dans `dist/acquisition.js`. Une fois renseigné, un lien permettra au visiteur d’ouvrir sa messagerie ; il gardera la main sur l’envoi.

## Périmètre du prototype

Les œuvres et favoris sont conservés dans le stockage local du navigateur (`edit-artworks-v1`, `edit-favorites-v1`). Ils ne sont pas partagés entre visiteurs, navigateurs ou appareils. Effacer les données du site efface le catalogue créé ; la dernière sauvegarde prévaut entre plusieurs onglets. Une erreur de quota conserve les champs à l’écran.

Pas de compte vendeur, serveur, paiement, commande ou livraison. Les œuvres et prix sont des démonstrations. Le rendu responsive est contrôlé dans un navigateur redimensionné ; les performances sur téléphones physiques restent à vérifier.

Les tests couvrent les prix, la compatibilité et la validation des cadres, la conservation des proportions, les limites et l’amorti à 60/120 Hz, l’échappement HTML et les brouillons d’acquisition. Les parcours manuels comprennent le choix et la persistance du cadre, l’accrochage publié, les fiches et les panneaux mobiles.

## Sources

Crédits des images et polices : `dist/assets/credits.html`. Conception initiale : `PRODUCT.md` et `DESIGN.md`. Three.js et RoomEnvironment proviennent du paquet npm officiel `three@0.187.0`, sous licence MIT (`dist/vendor/THREE-LICENSE.txt`).
