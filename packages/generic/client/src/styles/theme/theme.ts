import { merge } from 'lodash';
import { createMuiTheme, ThemeOptions } from '@material-ui/core';
import { ThemeProvider } from './ThemeProvider';
import { useDisplayMode, displayModeType } from './displayMode';
import { customColors, palette, colorsType } from './colors';
import { typography, typographyType } from './typography';

export { buildMuiTheme, useCustomTheme, ThemeProvider, useDisplayMode };

export type { typographyType, displayModeType, customThemeType };

const commonTheme = {
  shape: { borderRadius: 25 },
  spacing: 8,
  typography,
  palette: {
    primary: {
      main: palette.brightSun,
    },
    secondary: {
      main: palette.orange,
    },
  },
};

type customThemeType = typeof commonTheme & { colors: colorsType };

const useCustomTheme = () => {
  const { displayMode } = useDisplayMode();
  const colors = customColors[displayMode];
  return {
    ...commonTheme,
    colors,
  };
};

function buildTheme(themeOptions: Partial<ThemeOptions>) {
  return merge(commonTheme, themeOptions);
}

const buildMuiTheme = (displayMode: displayModeType) => {
  const colors = customColors[displayMode];

  return createMuiTheme(
    buildTheme({
      palette: {
        text: { primary: colors.text.default, secondary: colors.text.disabled },
        background: {
          default: colors.background.default,
          paper: colors.background.highlight,
        },
        action: {
          disabled: colors.button.disabled.color,
          disabledBackground: colors.button.disabled.background,
        },
        grey: {
          '300': colors.button.default.background,
        },
      },
    }),
  );
};
