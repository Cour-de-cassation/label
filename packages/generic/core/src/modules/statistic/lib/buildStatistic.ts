import { assignationType } from '../../assignation';
import { documentModule, documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentType } from '../../treatment';
import { statisticType } from '../statisticType';

export { buildStatistic };

function buildStatistic({
  annotationsCount,
  assignation,
  document,
  linkedEntitiesCount,
  treatment,
}: {
  annotationsCount: number;
  assignation: assignationType;
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
    linkedEntitiesCount,
    modifiedAnnotationsCount: treatment.modifiedAnnotationsCount,
    publicationCategory: document.publicationCategory,
    resizedBiggerAnnotationsCount: treatment.resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount: treatment.resizedSmallerAnnotationsCount,
    source: document.source,
    treatmentDate: treatment.lastUpdateDate,
    treatmentDuration: treatment.duration,
    userId: assignation.userId,
    wordsCount: documentModule.lib.countWords(document),
  };
}
