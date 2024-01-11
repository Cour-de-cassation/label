import {
  categoryIconNames,
  categoryIconNameType,
  categorySettingType,
  colorType,
  constantColors,
  constantColorType,
  settingsType,
  shadeColors,
  shadeColorType,
} from '../settingsType';

export { buildSettings };

export type { partialSettingsType };

type partialSettingsType = {
  [category: string]: Partial<categorySettingType>;
};

function buildSettings(partialSettings: partialSettingsType = {}) {
  const settings: settingsType = {};

  Object.keys(partialSettings).forEach(
    (category) =>
      (settings[category] = {
        anonymization: partialSettings[category]?.anonymization || '',
        autoLinkSensitivity: partialSettings[category]?.autoLinkSensitivity || [{ kind: 'caseInsensitive' }],
        color: {
          lightMode: buildColor(partialSettings[category]?.color?.lightMode),
          darkMode: buildColor(partialSettings[category]?.color?.darkMode),
        },
        canBeAnnotatedBy: partialSettings[category]?.canBeAnnotatedBy || 'both',
        iconName: buildIconName(partialSettings[category]?.iconName),
        isSensitive: !!partialSettings[category].isSensitive,
        isAnonymized: buildIsAnonymized(partialSettings[category]?.isAnonymized),
        order: partialSettings[category]?.order,
        status: partialSettings[category].status || 'hidden',
        text: buildText(partialSettings[category]?.text),
      }),
  );

  return settings;
}

function buildColor(color: colorType | undefined) {
  if (!color) {
    return 'white';
  }

  if (typeof color === 'string') {
    return buildConstantColor(color);
  } else {
    return buildShadeColor(color);
  }

  function buildConstantColor(constantColor: constantColorType) {
    if (constantColors.includes(constantColor)) {
      return constantColor;
    } else {
      throw new Error(`Invalid constant color: ${constantColor}`);
    }
  }

  function buildShadeColor(shadeColor: shadeColorType) {
    if (shadeColors.includes(shadeColor[0])) {
      return shadeColor;
    } else {
      throw new Error(`Invalid shade color: ${shadeColor}`);
    }
  }
}

function buildIconName(iconName: string | undefined): categoryIconNameType {
  if (!iconName) {
    return 'forbidden';
  }

  if (categoryIconNames.includes(iconName as categoryIconNameType)) {
    return iconName as categoryIconNameType;
  } else {
    throw new Error(`Invalid category icon name: ${iconName}`);
  }
}

function buildIsAnonymized(isAnonymized: boolean | undefined) {
  if (isAnonymized === undefined) {
    return true;
  } else {
    return isAnonymized;
  }
}

function buildText(text: string | undefined) {
  return text ? text : 'category';
}
