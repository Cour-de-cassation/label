import { preAssignationType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customPreAssignationRepositoryType } from './customPreAssignationRepositoryType';

export { buildPreAssignationRepository };

const buildPreAssignationRepository = buildRepositoryBuilder<
  preAssignationType,
  customPreAssignationRepositoryType
>({
  collectionName: 'preAssignations',
  indexes: [
    {
      index: { source: 1, documentNumber: 1 },
      mustBeUnique: true,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async findOneByDocumentNumberAndSource({ documentNumber, source }) {
      const preAssignation = await collection.findOne({
        documentNumber,
        source,
      });
      return preAssignation || undefined;
    },
  }),
});
