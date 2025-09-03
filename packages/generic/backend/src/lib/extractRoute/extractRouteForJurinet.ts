import { documentType, stringComparator } from '@label/core';

export { extractRouteForJurinet };

function extractRouteForJurinet(document: documentType): documentType['route'] {
  const solution = document.decisionMetadata.solution;
  const session = document.decisionMetadata.session;
  const publicationCategory = document.publicationCategory;
  const chamberName = document.decisionMetadata.chamberName;
  const checklist = document.checklist;

  /* Double relecture :
    - Décisions rendues en Assemblée plénière
    - Décisions rendues en chambre mixte
    - Demandes d'avis 
    - Décisions faisant l'objet d'un communiqué de presse
  */
  if (publicationCategory.includes('C')) {
    return 'confirmation';
  }
  if (chamberName === 'Saisine pour avis' || solution === 'Avis sur saisine') {
    return 'confirmation';
  }
  if (['PL', 'MI'].includes(session)) {
    return 'confirmation';
  }

  /*
    Relecture exhaustive en cas de mises en doute
  */
  if (checklist.length > 0) {
    return 'exhaustive';
  }

  /* Pas de relecture : 
    - Non admissions
    - Rejet non spécialement motivé
    - Déchéances
    - Désistements 
  */
  if (stringComparator.compareNormalizedStrings(solution, 'Non-admission')) {
    return 'automatic';
  }
  if (
    [
      'Déchéance',
      'Déchéance par ordonnance',
      'Désistement',
      'Désistement par arrêt',
    ].some((text) => stringComparator.compareNormalizedStrings(text, solution))
  ) {
    return 'automatic';
  }
  if (
    stringComparator.compareNormalizedStrings(
      'Rejet non spécialement motivé',
      solution,
    )
  ) {
    return 'automatic';
  }

  /* Relecture exhaustive
    - Toutes les décisions ne remplissant pas les critères précédents
  */
  return 'exhaustive';
}
