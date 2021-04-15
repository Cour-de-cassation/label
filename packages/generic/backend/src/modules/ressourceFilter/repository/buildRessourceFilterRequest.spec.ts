import { idModule, ressourceFilterModule } from '@label/core';
import { buildRessourceFilterRequest } from './buildRessourceFilterRequest';

describe('buildRessourceFilterRequest', () => {
  it('should build a mongo request according to the given ressource filter', async () => {
    const userId = idModule.lib.buildId();
    const ressourceFilter = ressourceFilterModule.generator.generate({
      userId,
    });

    const ressourceFilterRequest = buildRessourceFilterRequest(ressourceFilter);

    expect(ressourceFilterRequest).toEqual({ userId });
  });
});
