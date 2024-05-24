import { buildPreAssignationRepository } from '../repository';
import { preAssignationModule } from '@label/core';
import { deletePreAssignation } from './deletePreAssignation';
import { ObjectID } from 'mongodb';
import { fetchAllPreAssignation } from './fetch';

describe('fetch', () => {
  const preAssignationRepository = buildPreAssignationRepository();
  const preAssignationId = new ObjectID();
  const preAssignation1 = preAssignationModule.generator.generate({
    _id: preAssignationId,
  });
  preAssignationRepository.insert(preAssignation1);
  const preAssignation2 = preAssignationModule.generator.generate({});
  preAssignationRepository.insert(preAssignation2);

  describe('deletePreAssignation', () => {
    it('should delete a specific preAssignation', async () => {
      await deletePreAssignation(preAssignationId);
      const allPreAssignation = await fetchAllPreAssignation();

      expect(allPreAssignation.length).toEqual(1);
    });
  });
});
