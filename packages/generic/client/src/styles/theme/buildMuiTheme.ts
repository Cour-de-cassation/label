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
        main: customTheme.colors.primary.background,
      },
      secondary: {
        main: customTheme.colors.secondary.background,
      },
      text: { primary: customTheme.colors.line.level1, secondary: customTheme.colors.disabled.color },
      background: {
        default: customTheme.colors.background,
        paper: customTheme.colors.background,
      },
      action: {
        disabled: customTheme.colors.disabled.color,
        disabledBackground: customTheme.colors.disabled.background,
      },
      grey: {
        '300': customTheme.colors.default.background,
      },
    },
  });
}
