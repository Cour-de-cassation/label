import React, { CSSProperties, ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { mousePositionType } from '../../../utils';

export { FloatingTooltipMenu };

const MOUSE_OFFSET = 20;

type displayPositionType = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };

function FloatingTooltipMenu(props: {
  isOpen: boolean;
  children: ReactElement;
  mousePosition: mousePositionType;
}): ReactElement {
  const theme = useCustomTheme();

  const style = buildStyle(theme, props.mousePosition);
  if (!props.isOpen) {
    return <span />;
  }
  return (
    <div style={style.tooltipMenu}>
      <div style={style.tooltipMenuContent}>{props.children}</div>
    </div>
  );
}

function buildStyle(theme: customThemeType, mousePosition: mousePositionType): { [cssClass: string]: CSSProperties } {
  const displayPosition = getDisplayPosition(mousePosition);
  const tooltipMenuOrigin = getTooltipMenuOrigin(displayPosition, mousePosition);
  return {
    tooltipMenu: {
      zIndex: 10,
      boxShadow: theme.boxShadow.minor,
      backgroundColor: theme.colors.default.background,
      borderRadius: theme.shape.borderRadius.small,
      position: 'absolute',
      ...tooltipMenuOrigin,
    },
    tooltipMenuContent: {
      padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
    },
  };
}

function getDisplayPosition(mousePosition: mousePositionType): displayPositionType {
  const windowSize = getWindowSize();
  const mouseVerticalWindowPercentagePosition = (100 * mousePosition.y) / windowSize.height;
  const mouseHorizontalWindowPercentagePosition = (100 * mousePosition.x) / windowSize.width;
  const vertical = mouseVerticalWindowPercentagePosition < 75 ? 'bottom' : 'top';
  const horizontal = mouseHorizontalWindowPercentagePosition < 75 ? 'left' : 'right';
  return {
    vertical,
    horizontal,
  };
}

function getWindowSize() {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  return { width, height };
}

function getTooltipMenuOrigin(displayPosition: displayPositionType, mousePosition: mousePositionType) {
  const windowSize = getWindowSize();
  return {
    ...getVerticalOrigin(displayPosition.vertical, windowSize.height, mousePosition),
    ...getHorizontalOrigin(displayPosition.horizontal, windowSize.width, mousePosition),
  };
}

function getVerticalOrigin(
  vertical: displayPositionType['vertical'],
  windowHeight: number,
  mousePosition: mousePositionType,
) {
  switch (vertical) {
    case 'bottom':
      return {
        top: `${mousePosition.y + MOUSE_OFFSET}px`,
      };
    case 'top':
      return {
        bottom: `${windowHeight - mousePosition.y + MOUSE_OFFSET}px`,
      };
  }
}

function getHorizontalOrigin(
  horizontal: displayPositionType['horizontal'],
  windowWidth: number,
  mousePosition: mousePositionType,
) {
  switch (horizontal) {
    case 'left':
      return {
        left: `${mousePosition.x + MOUSE_OFFSET}px`,
      };
    case 'right':
      return {
        right: `${windowWidth - mousePosition.x + MOUSE_OFFSET}px`,
      };
  }
}
