import { treatmentModule, treatmentType } from '../../modules/treatment';
import { assignationType } from '../../modules/assignation';
import { documentType } from '../../modules/document';
import { settingsType } from '../../modules/settings';
import { statisticType, statisticModule } from '../../modules/statistic';
import { idModule } from '../../modules/id';
import { annotationLinkHandler } from '../annotationLinkHandler';

export { statisticsCreator };

const statisticsCreator = { buildFromDocument };

function buildFromDocument({
  assignations,
  document,
  settings,
  treatments,
}: {
  assignations: assignationType[];
  document: documentType;
  settings: settingsType;
  treatments: treatmentType[];
}): statisticType[] {
  const annotations = treatmentModule.lib.computeAnnotations(treatments);
  const linkedEntitiesCount = annotationLinkHandler.countLinkedEntities(annotations);

  return assignations.map((assignation) => {
    const treatment = treatments.find((treatment) => idModule.lib.equalId(assignation.treatmentId, treatment._id));

    if (!treatment) {
      throw new Error('Incompatible assignations/treatments');
    }

    return statisticModule.lib.buildStatistic({
      annotationsCount: annotations.length,
      assignation,
      document,
      linkedEntitiesCount,
      settings,
      treatment,
    });
  });
}
