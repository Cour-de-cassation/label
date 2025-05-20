import { treatmentModule, treatmentType } from '../../modules/treatment';
import { documentType } from '../../modules/document';
import { statisticType, statisticModule } from '../../modules/statistic';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { userType } from '../../modules/user';
import { settingsType } from '../../modules/settings';

export { statisticsCreator };

const statisticsCreator = { buildFromDocument };

function buildFromDocument({
  document,
  treatments,
  humanTreatments,
  settings,
  comment,
}: {
  document: documentType;
  treatments: treatmentType[];
  humanTreatments: Array<{ treatment: treatmentType; userId: userType['_id'] }> | undefined;
  settings: settingsType;
  comment?: string;
}): statisticType {
  const annotations = treatmentModule.lib.computeAnnotations(treatments);
  const linkedEntitiesCount = annotationLinkHandler.countLinkedEntities(annotations);

  const treatmentInfo = treatmentModule.lib.aggregateTreatmentInfo(
    (humanTreatments ?? []).map(({ treatment }) => treatment),
    settings,
  );

  const lastUpdateDate = treatmentModule.lib.extractLastUpdateDate(treatments);

  const humanTreatmentsSummary = (humanTreatments ?? []).map(({ treatment, userId }) => ({
    userId,
    treatmentDuration: treatment.duration,
  }));

  return statisticModule.lib.buildStatistic({
    annotationsCount: annotations.length,
    humanTreatmentsSummary,
    lastUpdateDate,
    treatmentInfo,
    document,
    linkedEntitiesCount,
    checklist: document.checklist,
    comment,
  });
}
