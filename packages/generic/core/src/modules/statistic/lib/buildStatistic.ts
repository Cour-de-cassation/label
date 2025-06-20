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
  checklist,
  comment,
}: {
  annotationsCount: number;
  humanTreatmentsSummary: statisticType['treatmentsSummary'];
  document: documentType;
  linkedEntitiesCount: number;
  treatmentInfo: treatmentInfoType;
  lastUpdateDate: treatmentType['lastUpdateDate'];
  checklist: documentType['checklist'];
  comment?: string;
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
    endCaseCode: document.decisionMetadata.endCaseCode || undefined,
    NACCode: document.decisionMetadata.NACCode || undefined,
    publicationCategory: document.publicationCategory,
    route: document.route,
    importer: document.importer,
    source: document.source,
    surAnnotationsCount: treatmentInfo.surAnnotationsCount,
    subAnnotationsSensitiveCount: treatmentInfo.subAnnotationsSensitiveCount,
    subAnnotationsNonSensitiveCount: treatmentInfo.subAnnotationsNonSensitiveCount,
    treatmentDate: lastUpdateDate,
    treatmentsSummary: humanTreatmentsSummary,
    wordsCount: documentModule.lib.countWords(document),
    checklist: checklist,
    comment: comment,
  };
}
