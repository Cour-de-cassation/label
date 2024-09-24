import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../repository';
import { assertDocumentIsAssignatedToUser } from './assertDocumentIsAssignatedToUser';

describe('assertDocumentIsAssignatedToUser', () => {
  it('should throw one error', async () => {
    const assignationRepository = buildAssignationRepository();
    const userId = idModule.lib.buildId();
    const documentId = idModule.lib.buildId();
    const otherDocumentId = idModule.lib.buildId();
    const assignation = assignationModule.generator.generate({
      userId,
      documentId,
    });
    await assignationRepository.insert(assignation);

    const failingAssertion = () =>
      assertDocumentIsAssignatedToUser({
        documentId: otherDocumentId,
        userId,
      });

    await assertDocumentIsAssignatedToUser({
      documentId,
      userId,
    });
    expect(failingAssertion()).rejects.toThrowError();
  });
});
