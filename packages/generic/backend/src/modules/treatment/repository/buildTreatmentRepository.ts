import { treatmentType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customTreatmentRepositoryType } from './customTreatmentRepositoryType';

export { buildTreatmentRepository };

const buildTreatmentRepository = buildRepositoryBuilder<
  treatmentType,
  customTreatmentRepositoryType
>({
  collectionName: 'treatments',
  buildCustomRepository: () => ({}),
});
