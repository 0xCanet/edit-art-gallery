# Mes prompts et la façon dont j’ai fait évoluer ÉDIT

Je suis parti d’une V1 réalisée pendant mon premier entretien. J’ai ensuite repris le projet pour préparer le deuxième, avec l’UX/UI comme sujet principal.

J’ai gardé ici les demandes qui ont fait avancer le prototype. Les passages en citation viennent de mes messages ; ils conservent leur formulation. Les paragraphes qui suivent expliquent ce que je cherchais et ce que le prototype a pris en compte. Ce journal retrace les échanges disponibles, pas une recherche utilisateur ni un relevé du temps passé.

## 1. Poser la direction avant de coder

> L’idée c’est donc : de développer l’UX/UI (ce sur quoi je vais être challenger).
>
> Dans un premier temps, il faut que l’on pose la direction artistique du site en gardant Edit et en tournant toute l’expérience en luxe / awwward.
>
> J’aimerais un site en 3D pour afficher les tableaux. L’idée c’est d’arriver dans une galerie d’art, avec un zoom sur un premier tableau et au scroll, ça change de tableau dans une scène 3D simple, blanc, lumineux.

J’avais déjà une intention assez précise : garder ÉDIT, travailler une galerie lumineuse et utiliser le scroll pour passer d’une œuvre à l’autre. Je voulais d’abord voir si cette idée tenait visuellement.

J’ai donc demandé des maquettes desktop et mobile :

> Ok on part là-dessus, commence par la DA et génère les premières maquettes desktop et mobile pour qu’on visualise la galerie.

Les [maquettes générées](design.md) ont servi à poser cette direction. Je les distingue des captures du prototype : une image peut donner une intention, mais elle ne permet pas de juger le scroll ou les gestes.

J’avais aussi demandé une todo en speedrun sur huit heures. C’était une contrainte de départ ; je ne présente pas huit heures comme une durée de réalisation mesurée.

## 2. Passer à une expérience manipulable

> Ok j’aime bien, passe au prototype avec la galerie 3D et les transitions entre les tableaux au scroll. Garde cette DA et pense bien à la version mobile. Les oeuvres commencent à partir de 500 000 euros.

À ce stade, je voulais pouvoir tester le parcours. Le seuil de 500 000 € faisait partie du positionnement demandé, et il est resté une règle du catalogue de démonstration et du configurateur.

La visite au scroll et les premiers accrochages ont permis de confronter les maquettes au navigateur. J’ai ensuite demandé une lumière plus claire, des ombres plus douces et des transitions plus fluides sur les deux formats.

## 3. Donner une suite à la visite

> Ok, maintenant travaille la fiche œuvre dans la même DA : histoire du tableau, infos clés et prise de contact pour l’acquisition, adaptée à des œuvres à partir de 500 000 €. Pense aussi au mobile.

Je voulais qu’une personne puisse comprendre ce qu’elle regarde, puis prendre contact à propos de cette œuvre. La fiche rassemble la présentation, les informations, le dossier et la demande d’acquisition.

Le prototype indique quand une information n’a pas été fournie. Les textes des exemples restent illustratifs. La demande prépare un message à copier ; elle ne simule pas un envoi réel et ne contient pas de destinataire inventé.

## 4. Corriger ce qui ne correspondait pas encore à l’idée

> La 3D est fonctionnelle et fluide, mais je pensais plus à un décors détaillée, une vraie scène style galerie d’art. Avec lumières, ombres, etc Et un vrai tableau avec cadre etc. Qu’on doit pouvoir choisir dans le "configurateur" qui permet de mettre en ligne des oeuvres.
>
> Là tu as utilisé la 3D que pour une section, je veux que ce soit l’expérience globale

C’est le retour qui a le plus déplacé le projet. J’avais une scène fonctionnelle, mais le reste du parcours revenait à des pages classiques. Ce n’était pas encore la galerie que j’avais en tête.

La salle est alors devenue persistante. Le catalogue, la fiche et l’atelier s’ouvrent dans cette scène. Le décor a pris plus de place : verrières, projecteurs, bancs, sculpture, sol et ombres.

J’ai aussi relié le choix du cadre à l’œuvre publiée. Chêne, bois noir, laiton, doré mouluré ou sans cadre : je peux voir le résultat dans la salle pendant la configuration. Le choix reste ensuite dans la fiche.

## 5. Pouvoir s’arrêter devant une œuvre

> Quand on clique sur un tableau ça focus mais quand on reclique on doit pouvoir zoomer, naviguer et donc voir les détails. L’expérience doit faire "je scroll, j’aime cette oeuvre, je la regarde en détail. Le bouton pour quitter une oeuvre doit être plus visible.
>
> La navbar doit être mieux incruster, le logo au centre. Une arrivée plus animée.

Je précisais ici un enchaînement d’actions. Une œuvre attire le regard pendant la visite ; je m’en approche, puis je peux regarder son détail et repartir.

Le premier clic rapproche l’œuvre et ouvre sa fiche. Le second clic, ou la commande d’exploration, retire la fiche et permet de zoomer dans le tableau. Une commande visible permet de quitter l’œuvre. Le logo passe au centre et l’arrivée de caméra donne d’abord à voir la salle.

Dans la même demande, j’ai demandé des matériaux plus travaillés et une lumière plus naturelle. Le prototype utilise des textures et des reliefs procéduraux pour le bois, la pierre, l’enduit et le métal. Les ouvertures de la salle laissent passer la lumière et les ombres sont adoucies.

## 6. Reprendre le mobile comme un usage à part entière

> Ok, maintenant peaufine l’expérience mobile : fluidité du scroll, zoom au pincement, déplacement dans le tableau et sortie de l’œuvre. Je veux que ce soit aussi immersif et simple à utiliser que sur desktop.

Je revenais sur le mobile après avoir posé le parcours. Le pincement devait conserver le détail visé entre les doigts. Le déplacement devait suivre le doigt, et la sortie devait être accessible sans chercher en haut de l’écran.

L’exploration s’ouvre donc sur le tableau entier en portrait. Le pincement et le glisser utilisent les dimensions projetées de l’œuvre pour calculer le zoom et le déplacement. Les limites empêchent de se perdre hors de l’image. Les commandes de zoom et les deux sorties sont regroupées en bas.

La visite garde le scroll natif, puis se pose devant l’accrochage le plus proche à l’arrêt. Le changement d’orientation conserve l’œuvre courante. Les gestes de scroll sont distingués d’un clic pour éviter les ouvertures involontaires.

Les calculs ont des tests, et le rendu a été contrôlé dans un navigateur redimensionné. Il reste à valider le ressenti tactile et les performances sur de vrais téléphones. Je ne confonds pas ces deux niveaux de vérification.

## 7. Rendre le travail lisible dans le dépôt

> OK maintenant je veux qu’on push sur github dans un premier temps, comme ça je pourrais montrer le dépot github (et dans ce cas, on va travailler en mode bonnes pratiques (branches, commits, PR, etc) et on va documenter le projet dans le readme. Je veux que tu expliques mes prompts etc. Le but c’est que Cauri puisse lire et comprendre ma manière d’avancer, etc.

J’ai ensuite demandé le déploiement sur Vercel, choisi un dépôt public et précisé le ton de la documentation :

> parle comme si c’était moi qui écrivait, utilise humanizer

Je voulais que le dépôt raconte ma démarche dans ma voix, en plus de donner accès au code. Cette documentation a été préparée avec l’aide de Codex et relue avec Humanizer pour retirer les formulations trop mécaniques. Les citations, les décisions et les limites restent celles du projet.

L’historique GitHub commence par l’import de la version fonctionnelle. La documentation et la préparation du déploiement passent ensuite par une branche avec des commits séparés et une PR. Je n’ai pas fabriqué un historique de commits pour les itérations réalisées avant l’ouverture du dépôt.

## 8. Laisser le temps d’entrer dans la galerie

> Maintenant, je veux qu’on améliore l’interface, l’intro est bien mais trop rapide, ça ne laisse pas le temps d’apprécier l’arrivée. On doit avoir un loader de 0 à 100 qui dure 1 à 2 secondes (mais également en fonction du chargement du site. On arrive sur écran blanc puis fondu jusqu’à l’oeuvre, léger zoom dans la galerie d’art avec une arrivée plus centrée, milimétrée.

Je voulais ralentir ce premier moment et mieux cadrer l’œuvre. Le loader attend les ressources réellement nécessaires au premier rendu. Sur une connexion rapide, le compteur reste au moins 1,5 seconde ; si les œuvres mettent plus longtemps à charger, il attend. Le blanc disparaît ensuite progressivement pendant une approche légère et frontale.

Les tests vérifient que le compteur n’atteint pas 100 avant que la scène soit prête, ainsi que le rythme du fondu et le mouvement réduit. Un serveur local retardant volontairement les images de huit secondes a permis de vérifier l’attente et la commande pour continuer en vue fixe.

## 9. Donner au site une identité plus nette

> Go supprimer ce qui fait proto et IA.
>
> Pour Édit, au final je vais choisir PEINTURE (ou dans un autre langue, voir si y'en a un qui est stylé)

Mes captures montraient les mentions de démonstration, la signature de la galerie et la ligne catégorie/année répétée au-dessus de la fiche. Je voulais alléger l’interface et lui donner un nom plus direct.

Le site passe à PEINTURE. Les informations de l’œuvre restent dans la fiche ; les mentions répétées et les phrases décoratives disparaissent. Le formulaire garde son action de préparation et de copie du message. Les limites du projet et l’aide de Codex restent expliquées dans ce dépôt.

## Ce que je retiens pour la suite

Mes retours sont devenus plus précis quand j’ai pu manipuler le prototype : le focus ne suffisait pas pour regarder une œuvre, une scène isolée ne suffisait pas pour visiter une galerie, et le zoom mobile demandait un travail propre aux gestes tactiles.

Je commencerais la prochaine itération par des essais sur téléphone. Pour transformer ce prototype en produit, il faudrait ensuite un stockage partagé, des comptes et un véritable parcours d’acquisition. Ces sujets restent en dehors de cette démonstration.
