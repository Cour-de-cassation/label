import { range } from 'lodash';
import { buildDocumentRepository } from '../../../modules/document';
import { documentModule, settingsModule, userModule } from '@label/core';
import { buildAssignationRepository } from '../../../modules/assignation';
import {
  buildTreatmentRepository,
  treatmentService,
} from '../../../modules/treatment';
import { buildUserRepository } from '../../../modules/user';
import { cleanDocuments } from './cleanDocuments';

describe('cleanDocuments', () => {
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });
  const user = userModule.generator.generate({ role: 'admin' });
  const LOADED_DOCUMENTS_COUNT = 10;
  const FREE_DOCUMENTS_COUNT = 8;
  const DONE_DOCUMENTS_COUNT = 5;

  it('should clean the documents', async () => {
    const documentRepository = buildDocumentRepository();
    const assignationRepository = buildAssignationRepository();
    const treatmentRepository = buildTreatmentRepository();
    const userRepository = buildUserRepository();
    await userRepository.insert(user);
    const documentsToInsert = range(LOADED_DOCUMENTS_COUNT).map(() =>
      documentModule.generator.generate({ status: 'loaded' }),
    );
    await documentRepository.insertMany(documentsToInsert);
    for (let i = 0; i < FREE_DOCUMENTS_COUNT; i++) {
      await documentRepository.updateStatusById(
        documentsToInsert[i]._id,
        'free',
      );
    }
    await Promise.all(
      range(FREE_DOCUMENTS_COUNT).map(async (i) => {
        await treatmentService.createEmptyTreatment({
          documentId: documentsToInsert[i]._id,
          source: 'NLP',
        });
        return treatmentService.createEmptyTreatment({
          documentId: documentsToInsert[i]._id,
          source: 'postProcess',
        });
      }),
    );
    for (let i = 0; i < DONE_DOCUMENTS_COUNT; i++) {
      await documentRepository.updateStatusById(
        documentsToInsert[i]._id,
        'done',
      );
    }
    await Promise.all(
      range(DONE_DOCUMENTS_COUNT).map((i) =>
        treatmentService.updateTreatment(
          {
            documentId: documentsToInsert[i]._id,
            userId: user._id,
            annotationsDiff: { before: [], after: [] },
          },
          settings,
        ),
      ),
    );

    await cleanDocuments();

    const fetchedLoadedDocuments = await documentRepository.findAllByStatusProjection(
      ['loaded'],
      ['_id'],
    );
    expect(fetchedLoadedDocuments.length).toBe(
      LOADED_DOCUMENTS_COUNT - FREE_DOCUMENTS_COUNT,
    );
    const fetchedFreeDocuments = await documentRepository.findAllByStatusProjection(
      ['free'],
      ['_id'],
    );
    expect(fetchedFreeDocuments.length).toBe(
      FREE_DOCUMENTS_COUNT - DONE_DOCUMENTS_COUNT,
    );
    const fetchedDoneDocuments = await documentRepository.findAllByStatusProjection(
      ['done'],
      ['_id'],
    );
    expect(fetchedDoneDocuments.length).toBe(DONE_DOCUMENTS_COUNT);
    const assignations = await assignationRepository.findAll();
    const treatments = await treatmentRepository.findAll();
    expect(assignations.length).toBe(DONE_DOCUMENTS_COUNT);
    expect(treatments.length).toBe(
      DONE_DOCUMENTS_COUNT + FREE_DOCUMENTS_COUNT * 2,
    );
  });
});
