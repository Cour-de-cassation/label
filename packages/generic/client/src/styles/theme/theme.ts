import { displayModeType } from '@label/core';
import { buildCustomColorsTheme, customColorsThemeType } from './buildCustomColorsTheme';
import { useDisplayMode } from './displayMode';
import { getColor } from './palette';
import { typography } from './typography';

export { buildCustomTheme, commonTheme, useCustomTheme };

export type { customThemeType };

const commonTheme = {
  boxShadow: { minor: `0 0 4px ${getColor('black')}`, major: `0 0 16px ${getColor('black')}` },
  shape: { borderRadius: { small: 8, medium: 24, large: 36 } },
  spacing: 8,
  typography,
};

type customThemeType = typeof commonTheme & { colors: customColorsThemeType };

function useCustomTheme() {
  const { displayMode } = useDisplayMode();

  return buildCustomTheme(displayMode);
}

function buildCustomTheme(displayMode: displayModeType) {
  const customColorsTheme = buildCustomColorsTheme(displayMode);

  return { ...commonTheme, colors: customColorsTheme };
}
