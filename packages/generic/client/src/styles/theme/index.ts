import { ThemeProvider } from './ThemeProvider';
import { useDisplayMode } from './displayMode';
import { emphasizeShadeColor, getColor } from './palette';
import { typographyType, typography } from './typography';
import { useCustomTheme, customThemeType } from './theme';

export { emphasizeShadeColor, getColor, typography, useCustomTheme, ThemeProvider, useDisplayMode };

export type { typographyType, customThemeType };
