import { displayModeType } from '@label/core';
import { customColors } from './customColors';
import { getColor, getShadeColor, shadeColorType } from './palette';

export { buildCustomColorsTheme };

export type { customColorsThemeType };

type customColorsThemeType = ReturnType<typeof buildCustomColorsTheme>;

function buildCustomColorsTheme(displayMode: displayModeType) {
  const customColorsMode = customColors[displayMode];

  return {
    background: {
      default: getColor(customColorsMode.background.default),
      highlight: getShadeColor(customColorsMode.background.highlight),
    },
    button: {
      default: buildButtonCustomColorsTheme(customColorsMode.button.default),
      disabled: {
        background: getShadeColor(customColorsMode.button.disabled.background),
        color: getColor(customColorsMode.button.disabled.color),
      },
      primary: buildButtonCustomColorsTheme(customColorsMode.primary),
      secondary: buildButtonCustomColorsTheme(customColorsMode.secondary),
    },
    document: {
      background: getColor(customColorsMode.document.background),
    },
    dropdown: {
      border: getColor(customColorsMode.dropdown.border),
    },
    icon: getColor(customColorsMode.icon),
    primary: getShadeColor(customColorsMode.primary),
    secondary: getShadeColor(customColorsMode.secondary),
    separator: getShadeColor(customColorsMode.separator),
    text: {
      default: getColor(customColorsMode.text.default),
      disabled: getColor(customColorsMode.text.disabled),
    },
  };

  function buildButtonCustomColorsTheme(shadeColor: shadeColorType) {
    const [tint] = shadeColor;

    return {
      background: getShadeColor(shadeColor),
      hoveredBackground: getShadeColor([tint, displayMode === 'darkMode' ? 100 : 800]),
      hoveredTextColor: displayMode === 'darkMode' ? getColor('black') : getColor('white'),
    };
  }
}
