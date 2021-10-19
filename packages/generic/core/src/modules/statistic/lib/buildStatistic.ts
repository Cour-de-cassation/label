import { documentModule, documentType } from '../../document';
import { idModule } from '../../id';
import { treatmentInfoType, treatmentType } from '../../treatment';
import { statisticType } from '../statisticType';

export { buildStatistic };

function buildStatistic({
  annotationsCount,
  humanTreatmentsSummary,
  document,
  linkedEntitiesCount,
  treatmentInfo,
  lastUpdateDate,
}: {
  annotationsCount: number;
  humanTreatmentsSummary: statisticType['treatmentsSummary'];
  document: documentType;
  linkedEntitiesCount: number;
  treatmentInfo: treatmentInfoType;
  lastUpdateDate: treatmentType['lastUpdateDate'];
}): statisticType {
  return {
    _id: idModule.lib.buildId(),
    annotationsCount,
    appealNumber: document.decisionMetadata.appealNumber || undefined,
    chamberName: document.decisionMetadata.chamberName
      ? document.decisionMetadata.chamberName.trim().toLowerCase()
      : undefined,
    decisionDate: document.decisionMetadata.date,
    documentExternalId: document.externalId,
    documentNumber: document.documentNumber,
    jurisdiction: document.decisionMetadata.jurisdiction
      ? document.decisionMetadata.jurisdiction.trim().toLowerCase()
      : undefined,
    linkedEntitiesCount,
    session: document.decisionMetadata.session || undefined,
    publicationCategory: document.publicationCategory,
    source: document.source,
    surAnnotationsCount: treatmentInfo.surAnnotationsCount,
    subAnnotationsSensitiveCount: treatmentInfo.subAnnotationsSensitiveCount,
    subAnnotationsNonSensitiveCount: treatmentInfo.subAnnotationsNonSensitiveCount,
    treatmentDate: lastUpdateDate,
    treatmentsSummary: humanTreatmentsSummary,
    wordsCount: documentModule.lib.countWords(document),
  };
}
