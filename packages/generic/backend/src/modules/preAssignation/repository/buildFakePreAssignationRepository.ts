import { preAssignationType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customPreAssignationRepositoryType } from './customPreAssignationRepositoryType';

export { buildFakePreAssignationRepository };

const buildFakePreAssignationRepository = buildFakeRepositoryBuilder<
  preAssignationType,
  customPreAssignationRepositoryType
>({
  collectionName: 'preAssignations',
  buildCustomFakeRepository: (collection) => ({
    async findOneByDocumentNumberAndSource({ documentNumber, source }) {
      return collection.find(
        (preAssignation) =>
          preAssignation.source === source &&
          preAssignation.documentNumber === documentNumber,
      );
    },
  }),
});
