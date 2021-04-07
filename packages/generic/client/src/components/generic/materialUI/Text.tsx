import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import { customThemeType, typography, typographyType, useCustomTheme } from '../../../styles';

export { Text };

function Text(props: {
  children: ReactNode;
  variant?: typographyType;
  color?: 'textPrimary' | 'textSecondary';
  inline?: boolean;
  style?: CSSProperties;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  return <div style={{ ...style, ...props.style }}>{props.children}</div>;

  function buildStyle(theme: customThemeType) {
    const color = getTextColor(theme, props.color);
    const display = props.inline ? 'inline' : 'initial';
    const variantProperties = typography[props.variant || 'body1'];
    return {
      color,
      display,
      ...variantProperties,
    };
  }
}

function getTextColor(theme: customThemeType, color: 'textPrimary' | 'textSecondary' | undefined) {
  switch (color) {
    case 'textPrimary':
      return theme.colors.line.level1;
    case 'textSecondary':
      return theme.colors.line.level2;
    default:
      return 'inherit';
  }
}
