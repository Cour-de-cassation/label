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
    annotationsCount,
    chamberName: document.decisionMetadata.chamberName
      ? document.decisionMetadata.chamberName.toLowerCase()
      : undefined,
    decisionDate: document.decisionMetadata.date,
    documentExternalId: document.externalId,
    documentNumber: document.documentNumber,
    jurisdiction: document.decisionMetadata.jurisdiction
      ? document.decisionMetadata.jurisdiction.toLowerCase()
      : undefined,
    linkedEntitiesCount,
    session: document.decisionMetadata.session || undefined,
    publicationCategory: document.publicationCategory,
    source: document.source,
    surAnnotationsCount: treatment.surAnnotationsCount,
    subAnnotationsSensitiveCount: treatment.subAnnotationsSensitiveCount,
    subAnnotationsNonSensitiveCount: treatment.subAnnotationsNonSensitiveCount,
    treatmentDate: treatment.lastUpdateDate,
    treatmentsSummary,
    wordsCount: documentModule.lib.countWords(document),
  };
}
