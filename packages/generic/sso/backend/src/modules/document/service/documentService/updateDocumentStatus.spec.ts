import {
  assignationModule,
  documentModule,
  treatmentModule,
} from '@label/core';
import { buildAssignationRepository } from '../../../assignation/repository';
import { buildTreatmentRepository } from '../../../treatment/repository';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentStatus } from './updateDocumentStatus';

describe('updateDocumentStatus', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();

  it('should update document status', async () => {
    const document = documentModule.generator.generate({ status: 'free' });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentStatus(document._id, 'pending');

    expect(updatedDocument.status).toEqual('pending');
  });

  it('should update document status and set documents free', async () => {
    const document = documentModule.generator.generate({ status: 'pending' });
    const treatment = treatmentModule.generator.generate();
    const assignation = assignationModule.generator.generate({
      documentId: document._id,
      treatmentId: treatment._id,
    });
    await documentRepository.insert(document);
    await assignationRepository.insert(assignation);
    await treatmentRepository.insert(treatment);

    await updateDocumentStatus(document._id, 'free');

    const assignations = await assignationRepository.findAll();
    const treatments = await treatmentRepository.findAll();
    expect(assignations).toEqual([]);
    expect(treatments).toEqual([]);
  });
});
