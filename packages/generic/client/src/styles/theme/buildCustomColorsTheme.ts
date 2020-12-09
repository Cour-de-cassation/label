import { displayModeType, shadeColorType } from '@label/core';
import { customColors } from './customColors';
import { emphasizeShadeColor, getColor, getShadeColor } from './palette';

export { buildCustomColorsTheme };

export type { customColorsThemeType };

type customColorsThemeType = ReturnType<typeof buildCustomColorsTheme>;

function buildCustomColorsTheme(displayMode: displayModeType) {
  const customColorsMode = customColors[displayMode];

  return {
    alert: buildCustomColorsVariations(customColorsMode.alert),
    background: getColor(customColorsMode.background),
    default: buildCustomColorsVariations(customColorsMode.default),
    disabled: {
      background: getShadeColor(customColorsMode.disabled.background),
      color: getShadeColor(customColorsMode.line.level2),
    },
    document: getColor(customColorsMode.document),
    dropdown: {
      border: { default: getColor(customColorsMode.dropdown.border), error: getColor(customColorsMode.error) },
    },
    icon: getColor(customColorsMode.icon),
    overlay: 'black',
    primary: buildCustomColorsVariations(customColorsMode.primary),
    separator: getShadeColor(customColorsMode.line.level2),
    line: {
      level1: getColor(customColorsMode.line.level1),
      level2: getShadeColor(customColorsMode.line.level2),
    },
    warning: buildCustomColorsVariations(customColorsMode.warning),
  };

  function buildCustomColorsVariations(shadeColor: shadeColorType) {
    return {
      background: getShadeColor(shadeColor),
      hoveredBackground: emphasizeShadeColor(shadeColor, displayMode),
      hoveredTextColor: displayMode === 'darkMode' ? getColor('black') : getColor('white'),
    };
  }
}
