import { documentModule } from '../../document';
import { idModule } from '../../id';
import { treatmentModule } from '../../treatment';
import { ressourceFilterGenerator } from '../generator';
import { filterTreatedDocuments } from './filterTreatedDocuments';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('filterTreatedDocuments', () => {
  it('should filter all the given treated documents with added annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const userId = idModule.lib.buildId();
    const treatments = [
      { subAnnotationsSensitiveCount: 5, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveSubAnnotations: true,
    });
    const treatedDocuments = [
      { document: documents[0], treatments: [], humanTreatments: [] },
      {
        document: documents[1],
        treatments: treatments,
        humanTreatments: [{ userId, treatment: treatments[0] }],
      },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([
      { document: documents[1], treatments: treatments, humanTreatments: [{ userId, treatment: treatments[0] }] },
    ]);
  });

  it('should filter all the given treated documents with deleted annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const userId = idModule.lib.buildId();
    const treatments = [
      { surAnnotationsCount: 5, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveSurAnnotations: true,
    });
    const treatedDocuments = [
      { document: documents[0], treatments: [], humanTreatments: [] },
      {
        document: documents[1],
        treatments,
        humanTreatments: [{ userId, treatment: treatments[0] }],
      },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([
      { document: documents[1], treatments, humanTreatments: [{ userId, treatment: treatments[0] }] },
    ]);
  });

  it('should filter all the given treated documents according to the publication category', () => {
    const documents = [{ publicationCategory: ['P'] }, { publicationCategory: ['W'] }].map(
      documentModule.generator.generate,
    );
    const ressourceFilter = ressourceFilterGenerator.generate({
      publicationCategory: 'P',
    });
    const treatedDocuments = [
      { document: documents[0], treatments: [], humanTreatments: [] },
      { document: documents[1], treatments: [], humanTreatments: [] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ document: documents[0], treatments: [], humanTreatments: [] }]);
  });

  it('should filter all the given treated documents according to the user id', () => {
    const userId1 = idModule.lib.buildId();
    const userId2 = idModule.lib.buildId();
    const ressourceFilter = ressourceFilterGenerator.generate({
      userId: userId1,
    });
    const documents = ([{ status: 'done' }, { status: 'done' }] as const).map(documentModule.generator.generate);
    const treatments = [{ documentId: documents[0]._id }, { documentId: documents[1]._id }].map(
      treatmentModule.generator.generate,
    );
    const treatedDocuments = [
      {
        document: documents[0],
        treatments: [treatments[0]],
        humanTreatments: [{ treatment: treatments[0], userId: userId1 }],
      },
      {
        document: documents[1],
        treatments: [treatments[1]],
        humanTreatments: [{ treatment: treatments[1], userId: userId2 }],
      },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([
      {
        document: documents[0],
        treatments: [treatments[0]],
        humanTreatments: [{ treatment: treatments[0], userId: userId1 }],
      },
    ]);
  });

  it('should filter all the given treated documents according to the jurisdiction', () => {
    const documents = ([{ source: 'SOURCE1' }, { source: 'SOURCE2' }] as const).map(documentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      source: 'SOURCE1',
    });
    const treatedDocuments = [
      { document: documents[0], treatments: [], humanTreatments: [] },
      { document: documents[1], treatments: [], humanTreatments: [] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ document: documents[0], treatments: [], humanTreatments: [] }]);
  });

  it('should filter all the given treated documents according to the jurisdiction', () => {
    const decisionDate = new Date().getTime();
    const documents = [{ jurisdiction: 'JURISDICTION1' }, { jurisdiction: 'JURISDICTION2' }].map(({ jurisdiction }) =>
      documentModule.generator.generate({
        decisionMetadata: documentModule.decisionMetadataGenerator.generate({
          jurisdiction,
          solution: '',
          session: '',
          occultationBlock: undefined,
          criminalCaseCode: '',
          civilCaseCode: '',
          civilMatterCode: '',
          chamberName: '',
          date: decisionDate,
          categoriesToOmit: [],
          boundDecisionDocumentNumbers: [],
          NACCode: '',
          endCaseCode: '',
          parties: [],
          appealNumber: '',
        }),
      }),
    );
    const ressourceFilter = ressourceFilterGenerator.generate({
      jurisdiction: 'JURISDICTION1',
    });
    const treatedDocuments = [
      { document: documents[0], treatments: [], humanTreatments: [] },
      { document: documents[1], treatments: [], humanTreatments: [] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ document: documents[0], treatments: [], humanTreatments: [] }]);
  });
});
