# Antoine Martin, portfolio photographique

Une étude de portfolio réalisée à la demande de Jessy, à partir du site public [martinantoine.com](https://www.martinantoine.com/) et de la galerie immersive PITTURA. Cette branche possède son propre déploiement et ne remplace pas la galerie PITTURA.

## Le parcours

- Une galerie 3D de huit photographies choisies dans six projets : Miami, Haïti, Sorbonne Université, proches en France, Centrafrique et Chine.
- Un index filtrable des séries personnelles, commandes, travaux commerciaux et archives.
- Onze collections, avec les séquences photographiques du site d’origine.
- Neuf dossiers de publications, dont Mouvement, Fisheye, Libération et Le Temps.
- Une lecture en grand format, navigation au clavier, agrandissement et retour à l’image sélectionnée.
- Biographie, repères du parcours, contact et sources.

Les titres et contextes viennent des pages sources. Les textes français sont des adaptations éditoriales, relues avec Humanizer ; les compléments n’inventent ni témoignages, ni commandes, ni légendes factuelles. Les textes de projet sont écrits à la troisième personne, pour ne pas attribuer de nouvelles déclarations au photographe. La page de crédits distingue cette étude du site officiel.

## Source et images

Le relevé du 23 novembre 2026 couvre les **26 pages publiques** présentes dans le sitemap et les liens internes. Il comprend les anciennes pages Portfolio, Portraits et Publications. Le panier est hors périmètre. Les vues `?itemId=…` affichent les mêmes images que les galeries et ne constituent pas de nouveaux projets.

Le fichier `research/crawl.json` conserve l’inventaire des pages, les textes sources, les URL des images, leurs dimensions et leurs fichiers locaux. Les 333 URL d’images distinctes ont été récupérées ; les fichiers sont servis localement en WebP, avec leurs proportions et leurs profils colorimétriques lorsqu’ils étaient présents. Une URL différente peut désigner une nouvelle copie de la même photographie : 333 n’est donc pas un nombre d’œuvres originales.

L’ordre d’origine est conservé dans les séries. La sélection des huit images de l’accrochage est indépendante. Les pages HTML brutes et les fichiers JPEG récupérés restent locaux et sont ignorés par Git. Les photographies et publications restent © Antoine Martin et leurs ayants droit respectifs.

## Exécution et validation

```sh
npm run check
npm start
```

Ouvrir `http://localhost:4174/`. Application statique HTML/CSS/JavaScript, sans installation de dépendances. Three.js est fourni dans `dist/vendor` et les polices sont locales.

`npm run check` vérifie la syntaxe, les calculs et interactions du moteur PITTURA, ainsi que la complétude du relevé, les correspondances des sources et la présence de toutes les images du portfolio. Le fonctionnement des filtres, des pages et de la visionneuse fait aussi l’objet d’une vérification dans Chrome. Les formats mobiles sont vérifiés par redimensionnement du navigateur, sans essai sur téléphone physique.

Le site de démonstration déclare `noindex, nofollow`. Il ne comporte ni vente, ni compte utilisateur, ni formulaire d’envoi. Le contact utilise les liens email, téléphone, WhatsApp et Instagram publiés par Antoine.

## Fichiers principaux

- `dist/app.js` : navigation, pages, filtres, visionneuse.
- `dist/portfolio-data.js` : collections, publications, textes français et accrochage.
- `dist/portfolio-gallery.js` : parcours de la sélection immersive.
- `dist/portfolio.css` : identité visuelle et mises en page adaptatives.
- `dist/world.js`, `gallery-scene.js`, `gallery-math.js` : moteur de galerie hérité de PITTURA.
- `research/crawl.json` : relevé des sources.

Les anciens modules de gestion des œuvres de PITTURA restent dans l’historique et dans les tests du moteur, mais ne sont pas chargés par l’interface du portfolio.
