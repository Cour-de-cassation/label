import { assignationType } from '../../assignation';
import { documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentModule, treatmentType } from '../../treatment';
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
  const {
    additionsCount,
    deletionsCount,
    modificationsCount,
    resizedSmallerCount,
    resizedBiggerCount,
  } = treatmentModule.lib.computeTreatmentInfo(treatment);

  return {
    _id: idModule.lib.buildId(),
    addedAnnotationsCount: additionsCount,
    annotationsCount,
    deletedAnnotationsCount: deletionsCount,
    documentNumber: document.documentId,
    linkedEntitiesCount,
    modifiedAnnotationsCount: modificationsCount,
    publicationCategory: document.publicationCategory,
    resizedBiggerAnnotationsCount: resizedBiggerCount,
    resizedSmallerAnnotationsCount: resizedSmallerCount,
    source: document.source,
    treatmentDuration: treatment.duration,
    userId: assignation.userId,
  };
}
