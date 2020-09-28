import { annotationType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAnnotationRepositoryType } from './customAnnotationRepositoryType';

export { buildFakeAnnotationRepository };

const buildFakeAnnotationRepository = buildFakeRepositoryBuilder<
  annotationType,
  customAnnotationRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
