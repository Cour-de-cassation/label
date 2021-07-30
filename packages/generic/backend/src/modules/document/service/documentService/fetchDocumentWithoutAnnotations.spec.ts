import { range } from 'lodash';
import { documentModule, treatmentModule } from '@label/core';
import { fetchDocumentWithoutAnnotations } from './fetchDocumentWithoutAnnotations';
import { buildTreatmentRepository } from '../../../treatment/repository';
import { buildDocumentRepository } from '../../repository';

describe('fetchDocumentWithoutAnnotations', () => {
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();

  it('should fetch all the documents without annotation report', async () => {
    const documentsWithTreatments = range(5).map(() =>
      documentModule.generator.generate(),
    );
    const documentWithoutTreatments = documentModule.generator.generate({
      priority: 'high',
      status: 'loaded',
    });
    const treatments = documentsWithTreatments.map((document) =>
      treatmentModule.generator.generate({ documentId: document._id }),
    );
    await Promise.all(
      [...documentsWithTreatments, documentWithoutTreatments].map(
        documentRepository.insert,
      ),
    );
    await Promise.all(treatments.map(treatmentRepository.insert));

    const documentWithoutAnnotations = await fetchDocumentWithoutAnnotations();

    expect(documentWithoutAnnotations).toEqual(documentWithoutTreatments);
  });
});
