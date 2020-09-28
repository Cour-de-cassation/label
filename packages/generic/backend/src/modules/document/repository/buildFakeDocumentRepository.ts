import { documentType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
