import { treatmentType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customTreatmentRepositoryType } from './customTreatmentRepositoryType';

export { buildFakeTreatmentRepository };

const buildFakeTreatmentRepository = buildFakeRepositoryBuilder<
  treatmentType,
  customTreatmentRepositoryType
>({
  buildCustomFakeRepository: () => ({}),
});
