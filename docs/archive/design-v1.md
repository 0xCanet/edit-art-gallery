> Archive de la V1. Les choix ci-dessous précèdent la galerie 3D globale. Voir [la direction actuelle](../design.md).

---
name: "ÉDIT (provisoire)"
description: "Galerie et atelier : le catalogue ouvert."
colors:
  paper: "#faf9f6"
  ink: "#242522"
  muted: "#66665f"
  line: "#deded6"
  stage: "#efeeea"
  accent: "#354e3e"
  error: "#8a352e"
  published-bg: "#e5ebe1"
  published-text: "#354a31"
  draft-bg: "#eceae3"
  draft-text: "#67614e"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(48px, 6.6vw, 94px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(36px, 4vw, 58px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-.035em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    lineHeight: 1.55
  caption:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    lineHeight: 1.55
rounded:
  square: "0"
  heart: "50%"
spacing:
  tight: "12px"
  caption: "18px"
  control-gap: "20px"
  section-gap: "24px"
  plate-inset: "32px"
  grid-gap: "34px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "13px 23px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "13px 23px"
  button-secondary-hover:
    backgroundColor: "{colors.stage}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
  filter:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "8px 16px"
  artwork-plate:
    backgroundColor: "{colors.stage}"
    padding: "{spacing.plate-inset}"
    height: "390px"
  status-published:
    backgroundColor: "{colors.published-bg}"
    textColor: "{colors.published-text}"
    padding: "4px 10px"
  status-draft:
    backgroundColor: "{colors.draft-bg}"
    textColor: "{colors.draft-text}"
    padding: "4px 10px"
  heart:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.heart}"
    size: "40px"
---

# Design System: ÉDIT

## Overview

**Creative North Star: "Le catalogue ouvert"**

Le catalogue ouvert : une surface de papier calme où l’œuvre porte la couleur, et où les légendes restent attachées aux objets. Le luxe vient des proportions, de la typographie et de l’espace, sans habillage décoratif.

Newsreader donne une voix éditoriale aux grandes lectures ; DM Sans assure la précision du catalogue et de l’éditeur. ÉDIT est un nom provisoire ; cette documentation décrit le prototype livré.

**Key Characteristics:**
- Œuvres entières sur fonds minéraux.
- Sérif éditorial et interface sans sérif.
- Surfaces planes, filets fins et contrôles rectangulaires.
- Même vocabulaire dans la galerie, le catalogue et l’éditeur.

## Colors

Papier os, encre minérale et vert forêt : une palette peu saturée qui laisse les images mener la lecture. Les valeurs normatives sont dans le frontmatter.

### Primary
- **Encre** (`ink`) : texte, bouton principal, sélection et filet actif.
- **Forêt** (`accent`) : survol du bouton principal, focus et caret.

### Neutral
- **Papier os** (`paper`) : fond global et cœur de sélection.
- **Gris minéral** (`stage`) : plages d’images et survol des contrôles secondaires.
- **Gris de lecture** (`muted`) : métadonnées et aides.
- **Filet** (`line`) : séparations, contours secondaires et recherche.

Les statuts utilisent les couples `published-*` et `draft-*` ; `error` signale une erreur de formulaire ou de stockage. Leur texte exprime toujours le sens, en plus de la couleur.

**The Artwork Color Rule.** La couleur expressive appartient aux œuvres ; les contrôles utilisent l’encre et le vert forêt fonctionnel.

## Typography

**Display Font:** Newsreader, avec Georgia puis serif.
**Body Font:** DM Sans, avec sans-serif.

Newsreader est régulier et peut passer à l’italique dans les grandes phrases. DM Sans porte les actions, données et légendes ; les titres de fiches utilisent un poids moyen. Les rôles et valeurs de base figurent dans le frontmatter.

### Hierarchy
- **Display** : titre d’accueil ; sur téléphone, taille spécifique `clamp(56px, 11vw, 80px)`.
- **Headline** : grandes sections éditoriales.
- **Title** : titres des œuvres dans l’index ; sur téléphone (15px).
- **Body** : lecture courante, paragraphes limités à (68ch). Le texte d’accueil utilise un interligne plus ouvert (1.75).
- **Label** : navigation, boutons, champs et chiffres du catalogue.
- **Caption** : attribution, technique et dimensions ; les statuts et aides plus discrètes utilisent (12px).

Les titres d’atelier sont fixes à (60px), puis (50px) à partir du seuil mobile ; la fiche détail passe de (60px) à (48px), puis (46px). Les titres longs peuvent revenir à la ligne sans élargir le conteneur.

## Layout

Conteneur centré (1600px maximum), marges latérales (5.2vw), puis (80px) dès 1600px et (6vw) sous 760px. Le rythme n’est pas une échelle universelle : les espacements du frontmatter sont les pas répétés effectivement présents.

L’accueil est une double page asymétrique (1fr / 1.14fr, écart 5.5vw). L’index possède trois colonnes `minmax(0, 1fr)`, deux sous (760px), une sous (420px). Les plages d’images changent de hauteur selon la surface ; leur contenu reste contenu, jamais rempli par recadrage.

Le catalogue utilise des lignes à quatre colonnes ; sous (760px), l’en-tête disparaît et chaque ligne distribue œuvre, prix, statut et actions sur plusieurs rangées. L’éditeur est une grille (1.1fr / .9fr) avec aperçu collant (30px du haut), puis une colonne et aperçu statique sur téléphone. Les champs et pistes ont une largeur minimale nulle pour éviter les débordements intrinsèques. La navigation se replie sur plusieurs lignes ; le lien de philosophie et les textes introductifs décoratifs sont masqués sur mobile.

Seuils observés : (1100px), (760px), (420px), et ajustement du conteneur à (1600px).

## Elevation & Depth

Aucune ombre portée. La profondeur vient des plages minérales derrière les œuvres, des filets et de l’espace. Les cartes n’ont pas de coque extérieure. Seule l’image grandit légèrement au survol (1.035 dans l’index, 1.025 dans l’accueil), à l’intérieur de son conteneur.

**The Whole Plate Rule.** L’image garde ses proportions et reste entièrement visible dans sa plage minérale.

## Shapes

Boutons, champs, plages et statuts sont rectangulaires. Les champs explicitent un rayon nul. Le cœur de sélection est l’exception circulaire ; ne pas généraliser sa silhouette aux autres commandes. Les filets font (1px), le focus visible (2px) avec un décalage de (5px). Les icônes sont des SVG au trait, taille (20px), épaisseur (1.4), extrémités arrondies.

## Components

### Buttons

Rectangles calmes, texte de taille label, hauteur minimale (48px). Le principal inverse l’encre et le papier, puis utilise forêt au survol ; le secondaire est transparent à contour filet, puis minéral. Transition de couleur (200ms). Les commandes désactivées passent à une opacité de (.6) et au curseur d’attente. Le focus global reste visible.

### Chips

Les filtres sont des boutons rectangulaires à contour transparent, hauteur minimale (40px). Le survol est minéral ; `aria-pressed=true` fait apparaître le contour et le texte encre. Les statuts sont des boutons plus compacts, avec libellés explicites Publiée / Brouillon ; aucune animation ni ombre spécifique.

### Cards / Containers

Une plage minérale, une image entière et une légende attachée. Index : hauteur de plage (390px), contenu contenu, puis titre et attribution à (18px) et métadonnées à (18px). Le cœur est positionné dans l’angle supérieur droit. Les plages de détail et d’aperçu réutilisent la même logique sans transformer toute la fiche en carte.

### Inputs / Fields

Libellé au-dessus, écart (7px), champ transparent à bordure (1px solid #c7c8bf), hauteur minimale (47px). Texte et sélection restent natifs ; le sélecteur porte un chevron SVG. Les zones de texte sont redimensionnables verticalement. Les erreurs sont des textes explicites avec rôle d’alerte. La recherche utilise seulement un filet inférieur et une loupe SVG.

### Navigation

Wordmark Newsreader (38px, poids 500) à gauche, navigation DM Sans à droite. Le soulignement apparaît au survol et sur le lien actif, transition (250ms) avec l’accélération du projet. Les liens de texte ont un filet permanent. Les cœurs sélectionnés remplissent leur SVG. Le focus commun reste visible sur tous les contrôles.

### Motion

Accélération d’image et de soulignement : `cubic-bezier(.16,1,.3,1)`. Les images utilisent (650–700ms), les transitions de vue natives (220ms). Avec `prefers-reduced-motion: reduce`, transitions, animations et défilement doux sont désactivés.

## Do's and Don'ts

### Do:
- **Do** préserver l’image entière avec object-fit: contain.
- **Do** garder les légendes à proximité immédiate des œuvres.
- **Do** utiliser Newsreader pour les grandes lectures et DM Sans pour les actions.
- **Do** conserver les contours de focus et le comportement de mouvement réduit.
- **Do** permettre aux grilles et aux champs de rétrécir sans débordement.

### Don't:
- **Don’t** ajouter de dorure, de dégradé décoratif ou d’ombre portée à cette identité.
- **Don’t** enfermer les œuvres dans des cartes à bordure ou rogner leur image.
- **Don’t** transformer un texte introductif décoratif en motif réutilisable.

Écart non canonisé : le prototype conserve deux petites introductions décoratives sur grand écran ; elles ne constituent pas un rôle typographique à propager et sont masquées sur téléphone. Aucun changement d’application n’est effectué par cette documentation.
