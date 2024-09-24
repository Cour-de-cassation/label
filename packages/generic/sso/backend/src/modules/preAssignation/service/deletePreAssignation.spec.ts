import { buildPreAssignationRepository } from '../repository';
import { preAssignationModule, userModule } from '@label/core';
import { deletePreAssignation } from './deletePreAssignation';
import { ObjectID } from 'mongodb';
import { fetchAllPreAssignation } from './fetch';
import { buildUserRepository } from '../../../modules/user';

describe('fetch', () => {
  const userRepository = buildUserRepository();
  const user1 = userModule.generator.generate({ name: 'UserName1' });
  const preAssignationRepository = buildPreAssignationRepository();
  const preAssignationId = new ObjectID();
  const preAssignation1 = preAssignationModule.generator.generate({
    _id: preAssignationId,
    userId: user1._id,
  });
  const preAssignation2 = preAssignationModule.generator.generate({
    userId: user1._id,
  });

  describe('deletePreAssignation', () => {
    it('should delete a specific preAssignation', async () => {
      await userRepository.insert(user1);
      await preAssignationRepository.insert(preAssignation1);
      await preAssignationRepository.insert(preAssignation2);

      await deletePreAssignation(preAssignationId);
      const allPreAssignation = await fetchAllPreAssignation();

      expect(allPreAssignation.length).toEqual(1);
    });
  });
});
