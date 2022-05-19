# Filtres Label

## Flux de décisions

- `Date d'import` : date à laquelle la base de données source a importé la décision (ne correspond pas forcément à la date à laquelle Label a importé la décision).
- `Source` : base de données source (`jurinet`, `jurica`...).
- `Diffusion` : lettres de diffusion définissant leur priorité (`B`...).
- `Circuit de traitement` : circuit de relecture de Label (sans relecture = `Automatique`, en relecture `Simple` ou `Exhaustive`...).
- `Juridiction` : juridiction ayant rendu la décision (`Cour de cassation`, `Cour d'appel de Dijon`...).

## Décisions à confirmer

Filtres identiques au flux de décisions.

## Documents traités

Les filtres du flux de décisions avec en plus :

- `Date de traitement` : date à laquelle la dernière modification d'un document a été effectuée.
- `Agent` : agent ayant relu le document.
- `Statut de revu` : permet d'afficher les décision qui n'ont pas été relues par un administrateur.
- `Avec sous annotation` : afficher uniquement les documents à qui on a supprimé des annotations.
- `Avec sur annotation` : afficher uniquement les documents à qui on a ajouté des annotations.

## Statistiques

- `Date de traitement`
- `Agent`
- `Juridiction`
- `Circuit de traitement`
- `Source`
- `Diffusion`
- `Avec sous annotation`
- `Avec sur annotation`
