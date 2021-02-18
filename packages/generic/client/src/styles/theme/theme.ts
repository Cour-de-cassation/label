import { displayModeType } from '@label/core';
import { buildCustomColorsTheme, customColorsThemeType } from './buildCustomColorsTheme';
import { useDisplayMode } from './displayMode';
import { typography } from './typography';

export { buildCustomTheme, commonTheme, useCustomTheme };

export type { customThemeType };

const commonTheme = {
  boxShadow: {
    minor: `0px 0px 11px rgba(0, 0, 0, 0.24), 2px 2px 4px rgba(0, 0, 0, 0.22), 0px 0px 2px rgba(0, 0, 0, 0.4)`,
    major: `0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 0px 10px rgba(0, 0, 0, 0.42)`,
  },
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
