import { buildPreAssignationRepository } from '../repository';
import { preAssignationModule, userModule } from '@label/core';
import {
  fetchPreAssignationBySourceAndNumber,
  fetchAllPreAssignation,
} from './fetch';
import { buildUserRepository } from '../../user';

describe('fetch', () => {
  const userRepository = buildUserRepository();
  const user1 = userModule.generator.generate({ name: 'UserName1' });

  const preAssignationRepository = buildPreAssignationRepository();
  const preAssignation1 = preAssignationModule.generator.generate({
    number: '123456',
    source: 'mySource',
    userId: user1._id,
  });
  const preAssignation2 = preAssignationModule.generator.generate({
    number: '654321',
    source: 'myOtherSource',
    userId: user1._id,
  });

  it('should fetch all preAssignations', async () => {
    await userRepository.insert(user1);
    await preAssignationRepository.insert(preAssignation1);
    await preAssignationRepository.insert(preAssignation2);

    for (let i = 0; i < 10; i++) {
      const preAssignation = preAssignationModule.generator.generate({
        userId: user1._id,
      });
      await preAssignationRepository.insert(preAssignation);
    }

    const allPreAssignation = await fetchAllPreAssignation();

    expect(allPreAssignation[0].userName).toEqual(user1.name);
    expect(allPreAssignation.length).toEqual(12);
  });

  it('should fetch one pre assignation with documentNumber and source provided', async () => {
    await preAssignationRepository.insert(preAssignation1);
    const myPreAssignation = await fetchPreAssignationBySourceAndNumber(
      '123456',
      'mySource',
    );
    expect(myPreAssignation).toEqual(preAssignation1);
  });
});
