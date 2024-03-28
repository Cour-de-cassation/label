import { max } from 'lodash';
import { colorType, displayModeType, settingsType } from '../settingsType';

export { additionalAnnotationCategoryHandler };
const additionalAnnotationCategoryHandler = buildAdditionalAnnotationCategoryHandler();

function buildAdditionalAnnotationCategoryHandler() {
  const ADDITIONAL_ANNOTATION_CATEGORY_NAME = 'annotationSupplementaire';
  const ADDITIONAL_ANNOTATION_CATEGORY_ICON_NAME = 'pencil' as const;
  const ADDITIONAL_ANNOTATION_CATEGORY_COLOR = {
    lightMode: ['red', '300'] as colorType,
    darkMode: ['red', '700'] as colorType,
  };

  return { getCategoryName, getCategoryColor, getCategoryIconName, addCategoryToSettings };

  function getCategoryName() {
    return ADDITIONAL_ANNOTATION_CATEGORY_NAME;
  }

  function getCategoryColor(displayMode: displayModeType) {
    return ADDITIONAL_ANNOTATION_CATEGORY_COLOR[displayMode];
  }

  function getCategoryIconName() {
    return ADDITIONAL_ANNOTATION_CATEGORY_ICON_NAME;
  }

  function addCategoryToSettings(settings: settingsType): settingsType {
    const order = (max(Object.values(settings).map((setting) => setting.order)) || 0) + 1;
    return {
      ...settings,
      [ADDITIONAL_ANNOTATION_CATEGORY_NAME]: {
        autoLinkSensitivity: [{ kind: 'caseInsensitive' }],
        anonymization: '[...]',
        color: ADDITIONAL_ANNOTATION_CATEGORY_COLOR,
        iconName: ADDITIONAL_ANNOTATION_CATEGORY_ICON_NAME,
        order: order,
        status: 'hidden',
        text: 'Occultation supplémentaire',
        canBeAnnotatedBy: 'both',
      },
    };
  }
}
