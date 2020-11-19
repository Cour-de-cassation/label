import { createMuiTheme } from '@material-ui/core';
import { displayModeType } from '@label/core';
import { buildCustomTheme } from './theme';

export { buildMuiTheme };

function buildMuiTheme(displayMode: displayModeType) {
  const customTheme = buildCustomTheme(displayMode);

  return createMuiTheme({
    shape: { borderRadius: customTheme.shape.borderRadius.small },
    spacing: customTheme.spacing,
    typography: customTheme.typography,
    palette: {
      primary: {
        main: customTheme.colors.primary,
      },
      secondary: {
        main: customTheme.colors.secondary,
      },
      text: { primary: customTheme.colors.text.default, secondary: customTheme.colors.text.disabled },
      background: {
        default: customTheme.colors.background.default,
        paper: customTheme.colors.background.highlight,
      },
      action: {
        disabled: customTheme.colors.button.disabled.color,
        disabledBackground: customTheme.colors.button.disabled.background,
      },
      grey: {
        '300': customTheme.colors.button.default.background,
      },
    },
  });
}
