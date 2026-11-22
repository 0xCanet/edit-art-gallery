# La direction artistique

J’ai demandé les premières maquettes avant de passer au prototype. Je voulais pouvoir regarder l’idée sur desktop et sur mobile : une galerie claire, des œuvres encadrées et une interface qui laisse de la place au tableau.

## L’intention de départ

![Maquette desktop générée](images/concept-desktop.png)

[Maquette mobile générée](images/concept-mobile.png)

Ces images sont des maquettes générées pour explorer la direction artistique. Elles servent de référence visuelle et ne prouvent pas le comportement du site.

## Le prototype

![Galerie dans le navigateur](images/gallery-desktop.jpg)

[Exploration d’une œuvre sur mobile](images/gallery-mobile.jpg)

J’ai gardé la salle lumineuse et les typographies Newsreader et DM Sans. Mes retours ont ensuite porté sur la présence du décor, la matière des cadres et la façon de s’approcher d’un tableau.

La 3D reste présente quand j’ouvre le catalogue, une fiche ou l’atelier. Sur mobile, je garde le tableau au-dessus de la fiche, puis je passe en exploration pour le regarder en plein écran. Les commandes de sortie restent en bas.

Le [document de design de la V1](archive/design-v1.md) est conservé comme archive. Il décrit le premier site, avant la galerie globale. Ses règles de mise en page et d’élévation ne décrivent pas la version actuelle.

## L’arrivée dans la galerie

J’ai ensuite demandé de ralentir l’intro. Je voulais avoir le temps d’apprécier l’arrivée, avec un compteur de chargement puis un fondu depuis le blanc.

[Voir le loader dans le navigateur](images/arrival-loader.jpg)

Le compteur dure au moins 1,5 seconde et attend que la scène soit prête. Le fondu prend 1,4 seconde et l’approche se poursuit sur 3,6 secondes. La caméra reste dans l’axe du tableau, avec un léger zoom. Le scroll permet de reprendre la visite avant la fin du mouvement.

## Le nom et les textes de l’interface

J’ai choisi PEINTURE pour remplacer ÉDIT sur le site. Le mot reste centré dans la navigation et dans le loader. Sa taille s’adapte aux petits écrans pour garder les commandes accessibles.

J’ai retiré la signature en bas de la salle, les mentions de démonstration et la ligne catégorie/année au-dessus de la fiche. J’ai aussi raccourci les textes et supprimé les phrases qui répétaient la même intention. Les limites fonctionnelles restent documentées dans le README.

[La fiche allégée sur desktop](images/peinture-desktop.jpg)
