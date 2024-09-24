import { dependencyManager } from '../../../utils';
import { buildTreatmentRepository } from './buildTreatmentRepository';
import { buildFakeTreatmentRepository } from './buildFakeTreatmentRepository';

export { buildRepository as buildTreatmentRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildTreatmentRepository,
  forProd: buildTreatmentRepository,
  forTest: buildFakeTreatmentRepository,
});
