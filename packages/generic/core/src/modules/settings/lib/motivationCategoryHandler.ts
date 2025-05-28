import { max } from 'lodash';
import { colorType, displayModeType, settingsType } from '../settingsType';

export { motivationCategoryHandler };
const motivationCategoryHandler = buildMotivationCategoryHandler();

function buildMotivationCategoryHandler() {
  const MOTIVATION_CATEGORY_NAME = 'motivations';
  const MOTIVATION_CATEGORY_ICON_NAME = 'eyeoff' as const;
  const MOTIVATION_CATEGORY_COLOR = {
    lightMode: ['yellow', '300'] as colorType,
    darkMode: ['yellow', '900'] as colorType,
  };

  return { getCategoryName, getCategoryColor, getCategoryIconName, addCategoryToSettings };

  function getCategoryName() {
    return MOTIVATION_CATEGORY_NAME;
  }

  function getCategoryColor(displayMode: displayModeType) {
    return MOTIVATION_CATEGORY_COLOR[displayMode];
  }

  function getCategoryIconName() {
    return MOTIVATION_CATEGORY_ICON_NAME;
  }

  function addCategoryToSettings(settings: settingsType): settingsType {
    const order = (max(Object.values(settings).map((setting) => setting.order)) || 0) + 1;
    return {
      ...settings,
      [MOTIVATION_CATEGORY_NAME]: {
        autoLinkSensitivity: [{ kind: 'caseInsensitive' }],
        anonymization: '[Motifs de la décision occultés]',
        color: MOTIVATION_CATEGORY_COLOR,
        iconName: MOTIVATION_CATEGORY_ICON_NAME,
        order: order,
        status: 'hidden',
        text: 'Motifs de la décision',
        canBeAnnotatedBy: 'human',
      },
    };
  }
}
