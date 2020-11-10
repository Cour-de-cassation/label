import { colorsType, customColors } from './colors';
import { displayModeType, useDisplayMode } from './displayMode';
import { typography } from './typography';

export { buildCustomTheme, commonTheme, useCustomTheme };

export type { customThemeType };

const commonTheme = {
  shape: { borderRadius: 25 },
  spacing: 8,
  typography,
};

type customThemeType = typeof commonTheme & { colors: colorsType };

function useCustomTheme() {
  const { displayMode } = useDisplayMode();

  return buildCustomTheme(displayMode);
}

function buildCustomTheme(displayMode: displayModeType) {
  const colors = customColors[displayMode];

  return { ...commonTheme, colors };
}
