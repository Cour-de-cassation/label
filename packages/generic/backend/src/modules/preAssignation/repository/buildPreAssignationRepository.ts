import { idType, preAssignationType } from '@label/core';
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
      index: { source: 1, number: 1 },
      mustBeUnique: true,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async findOneByNumberAndSource({ number, source }) {
      const preAssignation = await collection.findOne({
        number,
        source,
      });
      return preAssignation || undefined;
    },

    async deleteById(id: idType) {
      await collection.deleteOne({ _id: id });
    },
  }),
});
