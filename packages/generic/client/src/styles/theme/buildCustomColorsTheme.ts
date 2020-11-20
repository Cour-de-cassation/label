import { displayModeType, shadeColorType } from '@label/core';
import { customColors } from './customColors';
import { emphasizeShadeColor, getColor, getShadeColor } from './palette';

export { buildCustomColorsTheme };

export type { customColorsThemeType };

type customColorsThemeType = ReturnType<typeof buildCustomColorsTheme>;

function buildCustomColorsTheme(displayMode: displayModeType) {
  const customColorsMode = customColors[displayMode];

  return {
    alert: buildCustomColorsVariations(['red', 500]),
    background: getColor(customColorsMode.background),
    default: buildCustomColorsVariations(customColorsMode.default),
    disabled: {
      background: getShadeColor(customColorsMode.disabled.background),
      color: getShadeColor(customColorsMode.line.level2),
    },
    document: getColor(customColorsMode.document),
    dropdown: {
      border: getColor(customColorsMode.dropdown.border),
    },
    icon: getColor(customColorsMode.icon),
    primary: buildCustomColorsVariations(customColorsMode.primary),
    secondary: buildCustomColorsVariations(customColorsMode.secondary),
    separator: getShadeColor(customColorsMode.line.level2),
    line: {
      level1: getColor(customColorsMode.line.level1),
      level2: getShadeColor(customColorsMode.line.level2),
    },
  };

  function buildCustomColorsVariations(shadeColor: shadeColorType) {
    return {
      background: getShadeColor(shadeColor),
      hoveredBackground: emphasizeShadeColor(shadeColor, displayMode),
      hoveredTextColor: displayMode === 'darkMode' ? getColor('black') : getColor('white'),
    };
  }
}
