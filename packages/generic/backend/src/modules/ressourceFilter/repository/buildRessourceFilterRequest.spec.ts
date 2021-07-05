import { idModule, ressourceFilterModule } from '@label/core';
import { buildRessourceFilterRequest } from './buildRessourceFilterRequest';

describe('buildRessourceFilterRequest', () => {
  it('should build a mongo request with no modifications', async () => {
    const ressourceFilter = ressourceFilterModule.generator.generate({
      mustHaveNoModifications: true,
    });

    const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

    expect(ressourceFilterRequest).toEqual({
      'addedAnnotationsCount.sensitive': 0,
      'addedAnnotationsCount.other': 0,
      'deletedAnnotationsCount.anonymised': 0,
      'deletedAnnotationsCount.other': 0,
      modifiedAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
    });
  });

  it('should build a mongo request according to the given ressource filter', async () => {
    const publicationCategory = 'P';
    const source = 'SOURCE';
    const userId = idModule.lib.buildId();
    const ressourceFilter = ressourceFilterModule.generator.generate({
      mustHaveAddedAnnotations: true,
      mustHaveDeletedAnnotations: true,
      mustHaveModifiedAnnotations: true,
      mustHaveResizedBiggerAnnotations: true,
      mustHaveResizedSmallerAnnotations: true,
      publicationCategory,
      source,
      userId,
    });

    const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

    expect(ressourceFilterRequest).toEqual({
      'addedAnnotationsCount.sensitive': { $gte: 0 },
      'deletedAnnotationsCount.anonymised': { $gte: 0 },
      modifiedAnnotationsCount: { $gte: 0 },
      publicationCategory: [publicationCategory],
      resizedBiggerAnnotationsCount: { $gte: 0 },
      resizedSmallerAnnotationsCount: { $gte: 0 },
      source,
      userId,
    });
  });
});
