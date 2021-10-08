import { idModule, ressourceFilterModule } from '@label/core';
import { buildRessourceFilterRequest } from './buildRessourceFilterRequest';

describe('buildRessourceFilterRequest', () => {
  it('should build a mongo request according to the given ressource filter', async () => {
    const publicationCategory = 'P';
    const source = 'SOURCE';
    const jurisdiction = 'JURISDICTION';
    const userId = idModule.lib.buildId();
    const ressourceFilter = ressourceFilterModule.generator.generate({
      mustHaveSurAnnotations: true,
      mustHaveSubAnnotations: true,
      publicationCategory,
      jurisdiction,
      source,
      userId,
    });

    const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

    expect(ressourceFilterRequest).toEqual({
      surAnnotationsCount: { $gt: 0 },
      subAnnotationsSensitiveCount: { $gt: 0 },
      publicationCategory: [publicationCategory],
      source,
      jurisdiction,
      'treatmentsSummary.userId': userId,
    });
  });
});
