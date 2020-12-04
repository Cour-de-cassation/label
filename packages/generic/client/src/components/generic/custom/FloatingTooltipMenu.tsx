import React, { CSSProperties, ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { positionType } from '../../../types';

export { FloatingTooltipMenu };

const MOUSE_OFFSET = 20;

type displayPositionType = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };

function FloatingTooltipMenu(props: {
  children: ReactElement;
  isExpanded: boolean;
  originPosition: positionType;
  onClose: () => void;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme, props.originPosition);

  return (
    <>
      {props.isExpanded && <div onClick={props.onClose} style={style.overlay} />}
      <div style={style.tooltipMenu}>
        <div style={style.tooltipMenuContent}>{props.children}</div>
      </div>
    </>
  );
}

function buildStyle(theme: customThemeType, originPosition: positionType): { [cssClass: string]: CSSProperties } {
  const displayPosition = getDisplayPosition(originPosition);
  const tooltipMenuOrigin = getTooltipMenuOrigin(displayPosition, originPosition);
  return {
    overlay: {
      backgroundColor: theme.colors.overlay,
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    tooltipMenu: {
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

function getDisplayPosition(originPosition: positionType): displayPositionType {
  const windowSize = getWindowSize();
  const mouseVerticalWindowPercentagePosition = (100 * originPosition.y) / windowSize.height;
  const mouseHorizontalWindowPercentagePosition = (100 * originPosition.x) / windowSize.width;
  const vertical = mouseVerticalWindowPercentagePosition < 65 ? 'bottom' : 'top';
  const horizontal = mouseHorizontalWindowPercentagePosition < 65 ? 'left' : 'right';
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

function getTooltipMenuOrigin(displayPosition: displayPositionType, originPosition: positionType) {
  const windowSize = getWindowSize();
  return {
    ...getVerticalOrigin(displayPosition.vertical, windowSize.height, originPosition),
    ...getHorizontalOrigin(displayPosition.horizontal, windowSize.width, originPosition),
  };
}

function getVerticalOrigin(
  vertical: displayPositionType['vertical'],
  windowHeight: number,
  originPosition: positionType,
) {
  switch (vertical) {
    case 'bottom':
      return {
        top: `${originPosition.y + MOUSE_OFFSET}px`,
      };
    case 'top':
      return {
        bottom: `${windowHeight - originPosition.y + MOUSE_OFFSET}px`,
      };
  }
}

function getHorizontalOrigin(
  horizontal: displayPositionType['horizontal'],
  windowWidth: number,
  originPosition: positionType,
) {
  switch (horizontal) {
    case 'left':
      return {
        left: `${originPosition.x + MOUSE_OFFSET}px`,
      };
    case 'right':
      return {
        right: `${windowWidth - originPosition.x + MOUSE_OFFSET}px`,
      };
  }
}
