import { documentType } from '../../document';
import { settingsType } from '../settingsType';
import { additionalAnnotationCategoryHandler } from './additionalAnnotationCategoryHandler';

export { computeFilteredSettings };

function computeFilteredSettings(
  settings: settingsType,
  categoriesToOmit: documentType['decisionMetadata']['categoriesToOmit'],
  additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'],
  computedAdditionalTerms: documentType['decisionMetadata']['computedAdditionalTerms'],
  additionalTermsParsingFailed: documentType['decisionMetadata']['additionalTermsParsingFailed'],
) {
  const settingsForDocument = Object.entries(settings).reduce((accumulator, [category, categorySetting]) => {
    if (categorySetting.status === 'alwaysVisible') {
      return { ...accumulator, [category]: categorySetting };
    }
    if (category === additionalAnnotationCategoryHandler.getCategoryName()) {
      if (!!additionalTermsToAnnotate) {
        if (
          additionalTermsParsingFailed === undefined ||
          additionalTermsParsingFailed ||
          (!additionalTermsParsingFailed && computedAdditionalTerms?.additionalTermsToAnnotate.length != 0)
        ) {
          return {
            ...accumulator,
            [category]: { ...categorySetting, status: 'annotable' as const },
          };
        }
      }
    } else if (!categoriesToOmit.includes(category)) {
      return {
        ...accumulator,
        [category]: { ...categorySetting, status: 'annotable' as const },
      };
    }
    return { ...accumulator, [category]: categorySetting };
  }, {} as settingsType);
  return settingsForDocument;
}
