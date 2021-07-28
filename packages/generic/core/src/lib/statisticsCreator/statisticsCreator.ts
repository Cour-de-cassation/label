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
}: {
  document: documentType;
  treatments: treatmentType[];
  humanTreatments: Array<{ treatment: treatmentType; userId: userType['_id'] }>;
  settings: settingsType;
}): statisticType {
  const annotations = treatmentModule.lib.computeAnnotations(treatments);
  const linkedEntitiesCount = annotationLinkHandler.countLinkedEntities(annotations);

  const aggregatedTreatment = treatmentModule.lib.aggregate(
    humanTreatments.map(({ treatment }) => treatment),
    'annotator',
    settings,
  );
  const treatmentsSummary = humanTreatments.map(({ treatment, userId }) => ({
    userId,
    treatmentDuration: treatment.duration,
  }));

  return statisticModule.lib.buildStatistic({
    annotationsCount: annotations.length,
    treatmentsSummary,
    document,
    linkedEntitiesCount,
    treatment: aggregatedTreatment,
  });
}
