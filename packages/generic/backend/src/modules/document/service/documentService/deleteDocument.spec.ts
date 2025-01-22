import { buildAssignationRepository } from '../../../assignation/repository';
import { buildTreatmentRepository } from '../../../treatment/repository';
import {
  assignationModule,
  documentModule,
  idModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { deleteDocument } from './deleteDocument';

describe('deleteDocument', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();

  it('should remove the given document from the database with all its dependencies', async () => {
    const documentId = idModule.lib.buildId();
    const assignations = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(assignationModule.generator.generate);
    const documents = ([
      { _id: documentId },
      { _id: idModule.lib.buildId() },
    ] as const).map(documentModule.generator.generate);
    const treatments = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(treatmentModule.generator.generate);
    await Promise.all(assignations.map(assignationRepository.insert));
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));

    await deleteDocument(documentId);

    const assignationsAfterRemove = await assignationRepository.findAll();
    const documentsAfterRemove = await documentRepository.findAll();
    const treatmentsAfterRemove = await treatmentRepository.findAll();
    expect(assignationsAfterRemove).toEqual([assignations[2]]);
    expect(documentsAfterRemove).toEqual([documents[1]]);
    expect(treatmentsAfterRemove).toEqual([treatments[2]]);
  });
});
