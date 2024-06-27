import { documentModule, preAssignationModule, userModule } from '@label/core';
import { buildPreAssignator } from './buildPreAssignator';
import { buildUserRepository } from '../../modules/user';
import { buildPreAssignationRepository } from '../../modules/preAssignation';
import { buildDocumentRepository } from '../../modules/document';

describe('buildPreAssignator', () => {
  const preAssignator = buildPreAssignator();

  it('must throw an error if document is not free', () => {
    const documentNotFree = documentModule.generator.generate({
      status: 'done',
    });
    expect(
      preAssignator.preAssignDocument(documentNotFree),
    ).rejects.toThrowError(
      'Document status must be loaded or nlpAnnotating before pre-assign it',
    );
  });

  it('must find preAssignation and assign document', async () => {
    const userRepository = buildUserRepository();
    const preAssignationRepository = buildPreAssignationRepository();
    const documentRepository = buildDocumentRepository();

    const user = userModule.generator.generate();
    await userRepository.insert(user);
    const documentNumber = 123456;
    const source = 'juritest';
    const documentToPreAssign = documentModule.generator.generate({
      status: 'loaded',
      source: source,
      documentNumber: documentNumber,
    });
    await documentRepository.insert(documentToPreAssign);

    const preAssignation = preAssignationModule.generator.generate({
      number: documentNumber.toString(),
      userId: user._id,
      source: source,
    });
    await preAssignationRepository.insert(preAssignation);

    expect(await preAssignator.preAssignDocument(documentToPreAssign)).toEqual(
      true,
    );
  });
});
