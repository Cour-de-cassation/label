import { promises as fs } from 'fs';
import { settingsModule } from '@label/core';
import { nlpApiType, nlpResponseType } from './nlpApiType';

export { buildNlpLocalApi };

const pathToNlpAnnotations = './storage/annotations/';

function buildNlpLocalApi(): nlpApiType {
  return {
    async fetchNlpAnnotations(settings, document) {
      const filteredSettings = settingsModule.lib.computeFilteredSettings(
        settings,
        document.decisionMetadata.categoriesToOmit,
        document.decisionMetadata.additionalTermsToAnnotate,
        document.decisionMetadata.computedAdditionalTerms,
        document.decisionMetadata.additionalTermsParsingFailed,
        document.decisionMetadata.motivationOccultation,
      );
      const annotations = JSON.parse(
        await fs.readFile(
          `${pathToNlpAnnotations}${document.documentNumber}.json`,
          {
            encoding: 'utf8',
          },
        ),
      ) as nlpResponseType;

      const availableCategories = settingsModule.lib.getCategories(
        filteredSettings,
        {
          status: ['visible', 'alwaysVisible', 'annotable'],
          canBeAnnotatedBy: 'NLP',
        },
      );

      return {
        ...annotations,
        entities: annotations.entities.filter((entity) =>
          availableCategories.includes(entity.category),
        ),
        checklist: annotations.checklist,
        newCategoriesToAnnotate: annotations.newCategoriesToAnnotate,
        newCategoriesToUnAnnotate: annotations.newCategoriesToUnAnnotate,
        additionalTermsToAnnotate: annotations.additionalTermsToAnnotate,
        additionalTermsToUnAnnotate: annotations.additionalTermsToUnAnnotate,
      };
    },
    async fetchNlpLoss() {
      return 0;
    },
  };
}
