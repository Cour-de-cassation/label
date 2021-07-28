import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { computeTreatmentIdsText };

function computeTreatmentIdsText(treatments: treatmentType[]) {
  return `[${treatments.map((treatment) => idModule.lib.convertToString(treatment._id)).join(', ')}]`;
}
