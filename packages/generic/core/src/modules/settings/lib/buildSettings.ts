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
        anonymizationTexts: buildAnonymizationTexts(partialSettings[category]?.anonymizationTexts),
        color: {
          lightMode: buildColor(partialSettings[category]?.color?.lightMode),
          darkMode: buildColor(partialSettings[category]?.color?.darkMode),
        },
        iconName: buildIconName(partialSettings[category]?.iconName),
        text: buildText(partialSettings[category]?.text),
      }),
  );

  return settings;
}

function buildAnonymizationTexts(anonymizationTexts: string[] | undefined) {
  return anonymizationTexts ? anonymizationTexts : [];
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
    if (shadeColors.includes(shadeColor[0]) && shadeColor[1] >= 100 && shadeColor[1] <= 900) {
      return shadeColor;
    } else {
      throw new Error(`Invalid shade color: ${shadeColor}`);
    }
  }
}

function buildIconName(iconName: string | undefined): categoryIconNameType {
  if (!iconName) {
    return 'person';
  }

  if (categoryIconNames.includes(iconName as categoryIconNameType)) {
    return iconName as categoryIconNameType;
  } else {
    throw new Error(`Invalid category icon name: ${iconName}`);
  }
}

function buildText(text: string | undefined) {
  return text ? text : 'category';
}
