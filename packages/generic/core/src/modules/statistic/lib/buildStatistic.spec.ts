import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { assignationModule } from '../../assignation';
import { documentModule } from '../../document';
import { idModule } from '../../id';
import { treatmentModule } from '../../treatment';
import { buildStatistic } from './buildStatistic';

describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentNumber = 8;
    const documentPublicationCategory = ['P'];
    const documentSource = 'SOURCE';
    const duration = 1500;
    const linkedEntitiesCount = 2;
    const userId = idModule.lib.buildId();
    const document = documentModule.generator.generate({
      documentId: documentNumber,
      publicationCategory: documentPublicationCategory,
      source: documentSource,
      text: 'Some text with five words',
    });
    const treatment = treatmentModule.generator.generate({
      annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
        [
          { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
          { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
        ].map(annotationModule.generator.generate),
        [
          { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
          { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
        ].map(annotationModule.generator.generate),
      ),
      documentId: document._id,
      duration,
    });
    const assignation = assignationModule.generator.generate({
      documentId: document._id,
      treatmentId: treatment._id,
      userId,
    });

    const statistic = buildStatistic({
      annotationsCount,
      assignation,
      document,
      linkedEntitiesCount,
      treatment,
    });

    expect(statistic).toEqual({
      _id: statistic._id,
      addedAnnotationsCount: 1,
      annotationsCount,
      deletedAnnotationsCount: 1,
      documentNumber: documentNumber,
      linkedEntitiesCount,
      modifiedAnnotationsCount: 1,
      publicationCategory: documentPublicationCategory,
      resizedBiggerAnnotationsCount: 1,
      resizedSmallerAnnotationsCount: 0,
      source: documentSource,
      treatmentDuration: duration,
      userId,
      wordsCount: 5,
    });
  });
});
