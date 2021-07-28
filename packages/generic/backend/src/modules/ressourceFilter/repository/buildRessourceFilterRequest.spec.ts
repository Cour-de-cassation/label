import { idModule, ressourceFilterModule } from '@label/core';
import { buildRessourceFilterRequest } from './buildRessourceFilterRequest';

describe('buildRessourceFilterRequest', () => {
  it('should build a mongo request according to the given ressource filter', async () => {
    const publicationCategory = 'P';
    const source = 'SOURCE';
    const userId = idModule.lib.buildId();
    const ressourceFilter = ressourceFilterModule.generator.generate({
      mustHaveSurAnnotations: true,
      mustHaveSubAnnotations: true,
      publicationCategory,
      source,
      userId,
    });

    const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

    expect(ressourceFilterRequest).toEqual({
      $and: [
        {
          $or: [
            { 'addedAnnotationsCount.sensitive': { $gt: 0 } },
            { 'modifiedAnnotationsCount.nonAnonymisedToSensitive': { $gt: 0 } },
            { 'resizedBiggerAnnotationsCount.sensitive': { $gt: 0 } },
          ],
        },
        {
          $or: [
            { 'deletedAnnotationsCount.anonymised': { $gt: 0 } },
            {
              'modifiedAnnotationsCount.anonymisedToNonAnonymised': { $gt: 0 },
            },
            { 'resizedSmallerAnnotationsCount.anonymised': { $gt: 0 } },
          ],
        },
      ],
      publicationCategory: [publicationCategory],
      source,
      'treatmentsSummary.userId': userId,
    });
  });
});
