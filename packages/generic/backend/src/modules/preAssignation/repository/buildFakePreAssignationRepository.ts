import { idModule, idType, preAssignationType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customPreAssignationRepositoryType } from './customPreAssignationRepositoryType';

export { buildFakePreAssignationRepository };

const buildFakePreAssignationRepository = buildFakeRepositoryBuilder<
  preAssignationType,
  customPreAssignationRepositoryType
>({
  collectionName: 'preAssignations',
  buildCustomFakeRepository: (collection) => ({
    async findOneByNumberAndSource({ number, source }) {
      return collection.find(
        (preAssignation) =>
          preAssignation.source === source && preAssignation.number === number,
      );
    },
    async deleteById(id: idType) {
      updateFakeCollection(
        collection,
        collection.filter(
          (preAssignation) => !idModule.lib.equalId(preAssignation._id, id),
        ),
      );
    },
  }),
});
