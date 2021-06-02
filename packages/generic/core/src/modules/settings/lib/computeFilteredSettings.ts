import { documentType } from '../../document';
import { settingsType } from '../settingsType';

export { computeFilteredSettings };

function computeFilteredSettings(
  settings: settingsType,
  categoriesToOmit: documentType['decisionMetadata']['categoriesToOmit'],
) {
  const settingsForDocument = Object.entries(settings).reduce((accumulator, [category, categorySetting]) => {
    if (!categoriesToOmit.includes(category)) {
      return {
        ...accumulator,
        [category]: categorySetting,
      };
    }
    return accumulator;
  }, {} as settingsType);
  return settingsForDocument;
}
