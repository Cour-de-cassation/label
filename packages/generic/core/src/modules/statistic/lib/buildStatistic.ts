import { documentModule, documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentType } from '../../treatment';
import { statisticType } from '../statisticType';

export { buildStatistic };

function buildStatistic({
  annotationsCount,
  treatmentsSummary,
  document,
  linkedEntitiesCount,
  treatment,
}: {
  annotationsCount: number;
  treatmentsSummary: statisticType['treatmentsSummary'];
  document: documentType;
  linkedEntitiesCount: number;
  treatment: treatmentType;
}): statisticType {
  return {
    _id: idModule.lib.buildId(),
    addedAnnotationsCount: treatment.addedAnnotationsCount,
    annotationsCount,
    deletedAnnotationsCount: treatment.deletedAnnotationsCount,
    documentExternalId: document.externalId,
    jurisdiction: document.decisionMetadata.jurisdiction,
    linkedEntitiesCount,
    modifiedAnnotationsCount: treatment.modifiedAnnotationsCount,
    publicationCategory: document.publicationCategory,
    resizedBiggerAnnotationsCount: treatment.resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount: treatment.resizedSmallerAnnotationsCount,
    source: document.source,
    treatmentDate: treatment.lastUpdateDate,
    treatmentsSummary,
    wordsCount: documentModule.lib.countWords(document),
  };
}
