import { omit } from 'lodash';
import {
  assignationModule,
  documentModule,
  problemReportModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { buildAssignationRepository } from '../../../../modules/assignation';
import { buildProblemReportRepository } from '../../../../modules/problemReport';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { up } from '../migrations/26_61671296b1af2b8f48aa134c';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
xdescribe('add parties in decisionMetadata in document model, delete criticity and metadata', () => {
  const decisionMetadata = {
    additionalTermsToAnnotate: 'az',
    appealNumber: 'z',
    boundDecisionDocumentNumbers: [],
    chamberName: 'az',
    date: undefined,
    jurisdiction: 'az',
    occultationBlock: undefined,
    parties: [],
    session: 'az',
    solution: 'zae',
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        categoriesToOmit: [
          'personneMorale',
          'numeroSiretSiren',
          'professionnelMagistratGreffier',
        ],
      } as any,
      status: 'loaded',
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        categoriesToOmit: ['personneMorale'],
      } as any,
      status: 'done',
    }),
  ];
  const documentsWithOldModel = [
    {
      ...documentsWithNewModel[0],
      decisionMetadata: {
        ...documentsWithNewModel[0].decisionMetadata,
        categoriesToOmit: ['adresse'],
      },
      status: 'done' as const,
    },
    {
      ...documentsWithNewModel[1],
      decisionMetadata: {
        ...documentsWithNewModel[0].decisionMetadata,
        categoriesToOmit: ['personneMorale'],
      },
      status: 'done' as const,
    },
  ];

  const treatments = [
    { source: 'NLP' as const, documentId: documentsWithOldModel[0]._id },
    {
      source: 'postProcess' as const,
      documentId: documentsWithOldModel[0]._id,
    },
    { source: 'annotator' as const, documentId: documentsWithOldModel[0]._id },
    { source: 'NLP' as const, documentId: documentsWithOldModel[1]._id },
    {
      source: 'postProcess' as const,
      documentId: documentsWithOldModel[1]._id,
    },
    { source: 'annotator' as const, documentId: documentsWithOldModel[1]._id },
  ].map(treatmentModule.generator.generate);

  const assignations = [
    {
      documentId: documentsWithOldModel[0]._id,
      treatmentId: treatments[2]._id,
    },
    {
      documentId: documentsWithOldModel[1]._id,
      treatmentId: treatments[5]._id,
    },
  ].map(assignationModule.generator.generate);
  const problemReports = [
    {
      documentId: documentsWithOldModel[0]._id,
    },
    {
      documentId: documentsWithOldModel[1]._id,
    },
  ].map(problemReportModule.generator.generate);

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    const assignationRepository = buildAssignationRepository();
    const treatmentRepository = buildTreatmentRepository();
    const problemReportRepository = buildProblemReportRepository();
    await documentRepository.insertMany(documentsWithOldModel);
    await assignationRepository.insertMany(assignations);
    await treatmentRepository.insertMany(treatments);
    await problemReportRepository.insertMany(problemReports);

    await up();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(
      documentsAfterUpdateModel
        .map((document) => omit(document, 'updateDate'))
        .sort(),
    ).toEqual(
      documentsWithNewModel
        .map((document) => omit(document, 'updateDate'))
        .sort(),
    );

    const assignationsAfterUp = await assignationRepository.findAll();
    expect(assignationsAfterUp.sort()).toEqual([assignations[1]]);

    const problemReportsAfterUp = await problemReportRepository.findAll();
    expect(problemReportsAfterUp.sort()).toEqual([problemReports[1]]);

    const treatmentsAfterUp = await treatmentRepository.findAll();
    expect(treatmentsAfterUp.sort()).toEqual(
      [treatments[3], treatments[4], treatments[5]].sort(),
    );
  });
});
