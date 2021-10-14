import {
  assignationModule,
  documentModule,
  documentType,
  settingsModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { projectFakeObjects } from '../../../../repository';
import { buildAssignationRepository } from '../../../assignation';
import { buildTreatmentRepository } from '../../../treatment';
import { buildUserRepository } from '../../../user';
import { buildDocumentRepository } from '../../repository';
import { fetchTreatedDocuments } from './fetchTreatedDocuments';

describe('fetchTreatedDocuments', () => {
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();
  const userRepository = buildUserRepository();
  const treatmentRepository = buildTreatmentRepository();
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });

  it('should return treated documents', async () => {
    const TREATMENT_DATE = new Date().getTime();
    const user = userModule.generator.generate({
      name: 'NAME',
      role: 'annotator',
    });
    const freeDocument = documentModule.generator.generate({
      status: 'free',
    });
    const pendingDocument = documentModule.generator.generate({
      status: 'pending',
    });
    const toBePublishedDocument = documentModule.generator.generate({
      status: 'toBePublished',
    });
    const doneDocument = documentModule.generator.generate({
      status: 'done',
    });
    const toBePublishedTreatment = treatmentModule.generator.generate({
      documentId: toBePublishedDocument._id,
      duration: 10,
      lastUpdateDate: TREATMENT_DATE,
    });
    const doneTreatment = treatmentModule.generator.generate({
      documentId: doneDocument._id,
      duration: 20,
      lastUpdateDate: TREATMENT_DATE,
    });
    const pendingDocumentAssignation = assignationModule.generator.generate({
      documentId: pendingDocument._id,
      userId: user._id,
    });
    const toBePublishedDocumentAssignation = assignationModule.generator.generate(
      {
        documentId: toBePublishedDocument._id,
        userId: user._id,
        treatmentId: toBePublishedTreatment._id,
      },
    );
    const doneDocumentAssignation = assignationModule.generator.generate({
      documentId: doneDocument._id,
      userId: user._id,
      treatmentId: doneTreatment._id,
    });
    await Promise.all(
      [freeDocument, pendingDocument, toBePublishedDocument, doneDocument].map(
        documentRepository.insert,
      ),
    );
    await Promise.all(
      [toBePublishedTreatment, doneTreatment].map(treatmentRepository.insert),
    );
    await Promise.all(
      [
        pendingDocumentAssignation,
        toBePublishedDocumentAssignation,
        doneDocumentAssignation,
      ].map(assignationRepository.insert),
    );
    await userRepository.insert(user);

    const treatedDocuments = await fetchTreatedDocuments(settings);

    expect(treatedDocuments).toEqual([
      {
        document: projectTreatedDocumentDocument(toBePublishedDocument),
        totalTreatmentDuration: 10,
        lastTreatmentDate: TREATMENT_DATE,
        statistic: {
          subAnnotationsNonSensitiveCount: 0,
          subAnnotationsSensitiveCount: 0,
          surAnnotationsCount: 0,
        },
        userNames: ['NAME'],
      },
      {
        document: projectTreatedDocumentDocument(doneDocument),
        totalTreatmentDuration: 20,
        lastTreatmentDate: TREATMENT_DATE,
        statistic: {
          subAnnotationsNonSensitiveCount: 0,
          subAnnotationsSensitiveCount: 0,
          surAnnotationsCount: 0,
        },
        userNames: ['NAME'],
      },
    ]);
  });
});

function projectTreatedDocumentDocument(document: documentType) {
  return {
    ...projectFakeObjects(document, [
      '_id',
      'documentNumber',
      'publicationCategory',
      'reviewStatus',
      'source',
      'route',
    ]),
    occultationBlock: document.decisionMetadata.occultationBlock,
    jurisdiction: document.decisionMetadata.jurisdiction,
  };
}
