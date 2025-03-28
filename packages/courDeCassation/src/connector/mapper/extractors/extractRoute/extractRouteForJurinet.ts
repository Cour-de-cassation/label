import { documentType, documentModule, stringComparator } from '@label/core';

export { extractRouteForJurinet };

function extractRouteForJurinet({
  solution,
  session,
  publicationCategory,
  chamberName,
}: {
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  publicationCategory: documentType['publicationCategory'];
  chamberName: documentType['decisionMetadata']['chamberName'];
}): documentType['route'] {
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
