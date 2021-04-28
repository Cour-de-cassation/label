import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { assignationModule } from '../../assignation';
import { documentModule } from '../../document';
import { idModule } from '../../id';
import { treatmentModule } from '../../treatment';
import { ressourceFilterGenerator } from '../generator';
import { filterTreatedDocuments } from './filterTreatedDocuments';

describe('filterTreatedDocuments', () => {
  it('should filter all the given treated documents with added annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      { addedAnnotationsCount: 3, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveAddedAnnotations: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: treatments },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[1], treatments: treatments }]);
  });

  it('should filter all the given treated documents with deleted annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      { deletedAnnotationsCount: 3, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveDeletedAnnotations: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: treatments },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[1], treatments: treatments }]);
  });

  it('should filter all the given treated documents with modified annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      { modifiedAnnotationsCount: 3, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveModifiedAnnotations: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: treatments },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[1], treatments: treatments }]);
  });

  it('should filter all the given treated documents with no modifications', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      {
        annotationsDiff: annotationsDiffModule.generator.generate({ before: [], after: [] }),
        documentId: documents[1]._id,
        order: 2,
      },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [annotationModule.generator.generate()],
          after: [],
        }),
        documentId: documents[0]._id,
        order: 2,
      },
      { documentId: documents[0]._id, order: 0 },
      { documentId: documents[0]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveNoModifications: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [treatments[3], treatments[4], treatments[5]] },
      { assignations: [], document: documents[1], treatments: [treatments[0], treatments[1], treatments[2]] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([
      { assignations: [], document: documents[1], treatments: [treatments[0], treatments[1], treatments[2]] },
    ]);
  });

  it('should filter all the given treated documents with resized bigger annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      { resizedBiggerAnnotationsCount: 3, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveResizedBiggerAnnotations: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: treatments },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[1], treatments: treatments }]);
  });

  it('should filter all the given treated documents with resized smaller annotations', () => {
    const documents = [{}, {}].map(documentModule.generator.generate);
    const treatments = [
      { resizedSmallerAnnotationsCount: 3, documentId: documents[1]._id, order: 2 },
      { documentId: documents[1]._id, order: 0 },
      { documentId: documents[1]._id, order: 1 },
    ].map(treatmentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      mustHaveResizedSmallerAnnotations: true,
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: treatments },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[1], treatments: treatments }]);
  });

  it('should filter all the given treated documents according to the publication category', () => {
    const documents = [{ publicationCategory: ['P'] }, { publicationCategory: ['W'] }].map(
      documentModule.generator.generate,
    );
    const ressourceFilter = ressourceFilterGenerator.generate({
      publicationCategory: 'P',
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: [] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[0], treatments: [] }]);
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
    const assignations = [
      {
        documentId: documents[0]._id,
        treatmentId: treatments[0]._id,
        userId: userId1,
      },
      {
        documentId: documents[1]._id,
        treatmentId: treatments[1]._id,
        userId: userId2,
      },
    ].map(assignationModule.generator.generate);
    const treatedDocuments = [
      { assignations: [assignations[0]], document: documents[0], treatments: [treatments[0]] },
      { assignations: [assignations[1]], document: documents[1], treatments: [treatments[1]] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([
      { assignations: [assignations[0]], document: documents[0], treatments: [treatments[0]] },
    ]);
  });

  it('should filter all the given treated documents according to the source', () => {
    const documents = ([{ source: 'SOURCE1' }, { source: 'SOURCE2' }] as const).map(documentModule.generator.generate);
    const ressourceFilter = ressourceFilterGenerator.generate({
      source: 'SOURCE1',
    });
    const treatedDocuments = [
      { assignations: [], document: documents[0], treatments: [] },
      { assignations: [], document: documents[1], treatments: [] },
    ];

    const filteredTreatedDocuments = filterTreatedDocuments({
      ressourceFilter,
      treatedDocuments,
    });

    expect(filteredTreatedDocuments).toEqual([{ assignations: [], document: documents[0], treatments: [] }]);
  });
});
