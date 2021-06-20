import { promises as fs } from 'fs';
import { settingsModule } from '@label/core';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpLocalApi };

const pathToNlpAnnotations = './storage/annotations/';

const nlpLocalApi: nlpApiType = {
  async fetchNlpAnnotations(settings, document) {
    const filteredSettings = settingsModule.lib.computeFilteredSettings(settings, document.decisionMetadata.categoriesToOmit, document.decisionMetadata.additionalTermsToAnnotate)
    const annotations = JSON.parse(
      await fs.readFile(
        `${pathToNlpAnnotations}${document.documentNumber}.json`,
        {
          encoding: 'utf8',
        },
      ),
    ) as nlpAnnotationsType;

    return {
      ...annotations,
      entities: annotations.entities.filter(entity =>
        settingsModule.lib.getCategories(filteredSettings, ['annotable', 'visible']).includes(entity.label),
      ),
    };
  },
};
