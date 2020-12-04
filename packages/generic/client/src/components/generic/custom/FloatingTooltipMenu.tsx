import React, { CSSProperties, ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { mousePositionType } from '../../../utils';

export { FloatingTooltipMenu };

const MOUSE_OFFSET = 20;

function FloatingTooltipMenu(props: {
  isOpen: boolean;
  children: ReactElement;
  mousePosition: mousePositionType;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  if (!props.isOpen) {
    return <span />;
  }
  return (
    <div style={style.tooltipMenu}>
      <div style={style.tooltipMenuContent}>{props.children}</div>
    </div>
  );

  function buildStyle(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      tooltipMenu: {
        zIndex: 10,
        boxShadow: theme.boxShadow.minor,
        backgroundColor: theme.colors.default.background,
        borderRadius: theme.shape.borderRadius.small,
        position: 'absolute',
        top: `${props.mousePosition.y + MOUSE_OFFSET}px`,
        left: `${props.mousePosition.x + MOUSE_OFFSET}px`,
      },
      tooltipMenuContent: {
        padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
      },
    };
  }
}
