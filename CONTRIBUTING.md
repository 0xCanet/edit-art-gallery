# Travailler sur ÉDIT

Je garde `main` pour la version de démonstration. Pour une modification, je crée une branche courte depuis `main`, par exemple `feat/artwork-story`, `fix/mobile-pinch` ou `docs/readme`.

```sh
git switch main
git pull --ff-only
git switch -c fix/mobile-pinch
```

Je fais des commits qui correspondent à un changement lisible. Les préfixes `feat:`, `fix:`, `docs:` et `chore:` servent à repérer leur sujet. L’import initial contient la version déjà développée avant l’ouverture du dépôt.

Avant de pousser, je lance :

```sh
npm run check
```

Je teste aussi le parcours concerné dans le navigateur. Pour une modification du zoom ou du scroll, je contrôle le retour à la fiche, la sortie de l’œuvre et le mode sans animation. Une modification mobile demande au moins un contrôle en portrait et en paysage ; les essais sur un téléphone réel restent à distinguer de ceux dans un navigateur redimensionné.

J’ouvre ensuite une PR vers `main`. Sa description explique le problème et le comportement obtenu, avec les vérifications réalisées et les limites restantes. Je joins une capture quand le rendu change. Je ne présente pas un contrôle automatisé comme une validation humaine.

Les checks GitHub et la preview Vercel permettent de contrôler la branche avant fusion. Le projet ne dépend d’aucun secret pour ses tests. Je garde les identifiants de déploiement, fichiers `.env` et données personnelles hors du dépôt.

Les images importées par un visiteur restent dans son navigateur. Pour enrichir les exemples versionnés, je vérifie les droits du visuel et je mets à jour les crédits.
