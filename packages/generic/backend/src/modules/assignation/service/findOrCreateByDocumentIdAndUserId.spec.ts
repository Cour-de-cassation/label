import {
  assignationModule,
  idModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { range } from 'lodash';
import { buildTreatmentRepository } from '../../treatment/repository';
import { buildUserRepository } from '../../user/repository';
import { buildAssignationRepository } from '../repository';
import { findOrCreateByDocumentIdAndUserId } from './findOrCreateByDocumentIdAndUserId';

describe('findOrCreateByDocumentIdAndUserId', () => {
  const userId = idModule.lib.buildId();
  const documentId = idModule.lib.buildId();

  it('should find the corresponding assignation', async () => {
    const assignationRepository = buildAssignationRepository();
    const treatmentRepository = buildTreatmentRepository();
    const treatment = treatmentModule.generator.generate({ documentId });
    const assignation = assignationModule.generator.generate({
      documentId,
      userId,
      treatmentId: treatment._id,
    });
    await treatmentRepository.insert(treatment);
    await assignationRepository.insert(assignation);

    await findOrCreateByDocumentIdAndUserId({
      documentId,
      userId,
    });

    const assignations = await assignationRepository.findAll();
    expect(assignations).toEqual([assignation]);
  });

  it('should create the corresponding assignation', async () => {
    const assignationRepository = buildAssignationRepository();

    await findOrCreateByDocumentIdAndUserId({
      documentId,
      userId,
    });

    const assignations = await assignationRepository.findAll();
    expect(assignations.length).toEqual(1);
    expect(
      idModule.lib.equalId(assignations[0].documentId, documentId),
    ).toBeTruthy();
    expect(idModule.lib.equalId(assignations[0].userId, userId)).toBeTruthy();
  });

  it('should create a new assignation if the last assignation does not match the userId', async () => {
    const userRepository = buildUserRepository();
    const treatmentRepository = buildTreatmentRepository();
    const assignationRepository = buildAssignationRepository();
    const users = range(2).map(() => userModule.generator.generate());
    const documentId = idModule.lib.buildId();
    const treatments = [0, 1, 2].map((order) =>
      treatmentModule.generator.generate({ order, documentId }),
    );
    const assignation1 = assignationModule.generator.generate({
      documentId,
      treatmentId: treatments[0]._id,
      userId: users[0]._id,
    });
    const assignation2 = assignationModule.generator.generate({
      documentId,
      treatmentId: treatments[1]._id,
      userId: users[1]._id,
    });
    await Promise.all(users.map(userRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));
    await Promise.all(
      [assignation1, assignation2].map(assignationRepository.insert),
    );

    const assignation = await findOrCreateByDocumentIdAndUserId({
      userId: users[0]._id,
      documentId,
    });

    const assignations = await assignationRepository.findAll();
    expect(idModule.lib.convertToString(assignation._id)).not.toBe(
      idModule.lib.convertToString(assignation1._id),
    );
    expect(assignations.length).toBe(3);
  });
});
