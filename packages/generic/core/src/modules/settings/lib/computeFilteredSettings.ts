import { documentType } from '../../document';
import { settingsType } from '../settingsType';
import { additionalAnnotationCategoryHandler } from './additionalAnnotationCategoryHandler';

export { computeFilteredSettings };

/* eslint-disable @typescript-eslint/no-unused-vars */
function computeFilteredSettings(
  settings: settingsType,
  categoriesToOmit: documentType['decisionMetadata']['categoriesToOmit'],
  additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'],
) {
  const settingsForDocument = Object.entries(settings).reduce((accumulator, [category, categorySetting]) => {
    if (categorySetting.status === 'alwaysVisible') {
      return { ...accumulator, [category]: categorySetting };
    }
    if (category === additionalAnnotationCategoryHandler.getCategoryName()) {
      return {
        ...accumulator,
        [category]: categorySetting,
      };
    }
    // else if (!categoriesToOmit.includes(category)) {
    //   return {
    //     ...accumulator,
    //     [category]: { ...categorySetting, status: 'annotable' as const },
    //   };
    // }
    return { ...accumulator, [category]: { ...categorySetting, status: 'annotable' as const } };
  }, {} as settingsType);
  return settingsForDocument;
}
