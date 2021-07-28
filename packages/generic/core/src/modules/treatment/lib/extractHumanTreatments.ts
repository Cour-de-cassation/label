import { assignationType } from '../../assignation';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { extractHumanTreatments };

function extractHumanTreatments(treatments: treatmentType[], assignations: assignationType[]) {
  const humanTreatments = assignations.map((assignation) => {
    const treatment = treatments.find((treatment) => idModule.lib.equalId(assignation.treatmentId, treatment._id));

    if (!treatment) {
      throw new Error('Incompatible assignations/treatments');
    }
    return { treatment, userId: assignation.userId };
  });

  return humanTreatments.sort(
    ({ treatment: treatment1 }, { treatment: treatment2 }) => treatment1.order - treatment2.order,
  );
}
