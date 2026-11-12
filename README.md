# Spirale

Un jeu d'adresse en pixel art : une balle rebondit sur les plateaux d'une tour en spirale. Tourne la tour pour qu'elle tombe par les trous.

*English version: [README.en.md](README.en.md)*

## Commandes

- **← →** (ou **Q D**) : tourner la tour.
- **Souris** : glisse de gauche à droite pour tourner la tour.
- **P** ou **Échap** : pause.

## Comment ça marche

- La balle rebondit toute seule. Amène un **trou** sous elle : elle tombe au plateau suivant.
- Les cases **rouges** (hachurées) la cassent : la partie est finie.
- Si elle traverse **trois plateaux d'affilée**, elle arrive **LANCÉE** et casse le plateau suivant, même rouge.
- Les trous suivent la spirale : il n'y a jamais de rouge juste sous un trou. Le danger, c'est de tourner pendant que la balle retombe.
- Le plateau **doré** au fond finit le niveau. Ensuite, les trous rapetissent, le rouge augmente et la tour s'allonge. Chaque niveau a sa couleur.

## Statistiques

Le panneau Records garde ton **meilleur niveau**, ton **meilleur score**, le nombre de **niveaux finis** et de **parties**. Le jeu reprend au niveau où tu t'es arrêté.

## Données et synchronisation

Tes records et ton niveau sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Spirale → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
