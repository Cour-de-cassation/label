import { displayModeType } from '@label/core';
import { buildCustomColorsTheme, customColorsThemeType } from './buildCustomColorsTheme';
import { useDisplayMode } from './displayMode';
import { typography } from './typography';
import { boxShadow } from './boxShadow';

export { buildCustomTheme, commonTheme, useCustomTheme };

export type { customThemeType };

const commonTheme = {
  boxShadow,
  shape: { borderRadius: { xxxs: 3, xxs: 8, xs: 12, s: 16, m: 24, l: 32 } },
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
