import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../repository';
import { findOrCreateByDocumentIdAndUserId } from './findOrCreateByDocumentIdAndUserId';

describe('findOrCreateByDocumentIdAndUserId', () => {
  const userId = idModule.lib.buildId();
  const documentId = idModule.lib.buildId();

  it('should find the corresponding assignation', async () => {
    const assignationRepository = buildAssignationRepository();
    const assignation = assignationModule.generator.generate({
      documentId,
      userId,
    });
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
});
