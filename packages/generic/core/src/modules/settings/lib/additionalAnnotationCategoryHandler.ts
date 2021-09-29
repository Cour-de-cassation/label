import { max } from 'lodash';
import { settingsType } from '../settingsType';

export { additionalAnnotationCategoryHandler };
const additionalAnnotationCategoryHandler = buildAdditionalAnnotationCategoryHandler();

function buildAdditionalAnnotationCategoryHandler() {
  const ADDITIONAL_ANNOTATION_CATEGORY = 'annotationSupplementaire';

  return { getCategoryName, addCategoryToSettings };

  function getCategoryName() {
    return ADDITIONAL_ANNOTATION_CATEGORY;
  }

  function addCategoryToSettings(settings: settingsType): settingsType {
    const order = (max(Object.values(settings).map((setting) => setting.order)) || 0) + 1;
    return {
      ...settings,
      [ADDITIONAL_ANNOTATION_CATEGORY]: {
        anonymization: '[Identifiant %d]',
        color: {
          lightMode: ['red', 300],
          darkMode: ['red', 700],
        },
        iconName: 'pencil',
        order: order,
        status: 'hidden',
        text: 'Occultation supplémentaire',
        canBeAnnotatedBy: 'human',
      },
    };
  }
}
