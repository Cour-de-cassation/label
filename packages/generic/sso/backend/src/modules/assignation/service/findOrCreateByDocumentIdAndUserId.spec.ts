import {
  assignationModule,
  documentModule,
  idModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { range } from 'lodash';
import { buildDocumentRepository } from '../../document';
import { buildTreatmentRepository } from '../../treatment';
import { buildUserRepository } from '../../user';
import { buildAssignationRepository } from '../repository';
import { findOrCreateByDocumentIdAndUserId } from './findOrCreateByDocumentIdAndUserId';

describe('findOrCreateByDocumentIdAndUserId', () => {
  const user = userModule.generator.generate();
  const userId = user._id;
  const document = documentModule.generator.generate();
  const documentId = document._id;
  const documentRepository = buildDocumentRepository();
  const userRepository = buildUserRepository();

  it('should find the corresponding assignation', async () => {
    const assignationRepository = buildAssignationRepository();
    const treatmentRepository = buildTreatmentRepository();
    const treatment = treatmentModule.generator.generate({ documentId });
    const assignation = assignationModule.generator.generate({
      documentId,
      userId,
      treatmentId: treatment._id,
    });
    await documentRepository.insert(document);
    await treatmentRepository.insert(treatment);
    await assignationRepository.insert(assignation);
    await userRepository.insert(user);

    await findOrCreateByDocumentIdAndUserId({
      documentId,
      userId,
    });

    const assignations = await assignationRepository.findAll();
    expect(assignations).toEqual([assignation]);
  });

  it('should create the corresponding assignation', async () => {
    const assignationRepository = buildAssignationRepository();
    await documentRepository.insert(document);
    await userRepository.insert(user);

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
