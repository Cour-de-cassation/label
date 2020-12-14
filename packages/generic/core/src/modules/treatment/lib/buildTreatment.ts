import { idModule, omitIdType } from '../../id';
import { treatmentType } from '../treatmentType';

export { buildTreatment };

function buildTreatment(treatmentFields: omitIdType<treatmentType>): treatmentType {
  return {
    ...treatmentFields,
    _id: idModule.lib.buildId(),
  };
}
