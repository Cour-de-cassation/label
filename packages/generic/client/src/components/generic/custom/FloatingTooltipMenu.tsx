import React, { CSSProperties, ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { positionType } from '../../../types';

export { FloatingTooltipMenu };

const VERTICAL_POSITION_OFFSET = 20;
const EDGE_OFFSET = 10;

type displayPositionType = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'middle' | 'right' };

function FloatingTooltipMenu(props: {
  children: ReactElement;
  shouldCloseWhenClickedAway: boolean;
  originPosition: positionType;
  onClose: () => void;
  width: number;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme, props.originPosition, props.width);

  return (
    <>
      {props.shouldCloseWhenClickedAway && <div onClick={props.onClose} style={style.overlay} />}
      <div style={style.tooltipMenu}>
        <div style={style.tooltipMenuContent}>{props.children}</div>
      </div>
    </>
  );
}

function buildStyle(
  theme: customThemeType,
  originPosition: positionType,
  width: number,
): { [cssClass: string]: CSSProperties } {
  const displayPosition = getDisplayPosition(originPosition, width);
  const tooltipMenuOrigin = getTooltipMenuOrigin(displayPosition, originPosition, width);
  return {
    overlay: {
      backgroundColor: theme.colors.overlay,
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
    },
    tooltipMenu: {
      boxShadow: theme.boxShadow.minor,
      backgroundColor: theme.colors.background,
      borderRadius: theme.shape.borderRadius.xs,
      position: 'absolute',
      width,
      ...tooltipMenuOrigin,
    },
    tooltipMenuContent: {
      paddingTop: `${theme.spacing * 2}px`,
      paddingLeft: `${theme.spacing * 2}px`,
      paddingRight: `${theme.spacing * 3}px`,
      paddingBottom: `${theme.spacing * 3}px`,
    },
  };
}

function getDisplayPosition(originPosition: positionType, width: number): displayPositionType {
  const windowSize = getWindowSize();
  const mouseVerticalWindowPercentagePosition = (100 * originPosition.y) / windowSize.height;
  const vertical = mouseVerticalWindowPercentagePosition < 65 ? 'bottom' : 'top';
  const horizontal =
    originPosition.x - width / 2 < EDGE_OFFSET
      ? 'left'
      : originPosition.x + width / 2 > windowSize.width - EDGE_OFFSET
      ? 'right'
      : 'middle';
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

function getTooltipMenuOrigin(displayPosition: displayPositionType, originPosition: positionType, width: number) {
  const windowSize = getWindowSize();
  return {
    ...getVerticalOrigin(displayPosition.vertical, windowSize.height, originPosition),
    ...getHorizontalOrigin(displayPosition.horizontal, windowSize.width, originPosition, width),
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
        top: `${originPosition.y + VERTICAL_POSITION_OFFSET}px`,
      };
    case 'top':
      return {
        bottom: `${windowHeight - originPosition.y + VERTICAL_POSITION_OFFSET}px`,
      };
  }
}

function getHorizontalOrigin(
  horizontal: displayPositionType['horizontal'],
  windowWidth: number,
  originPosition: positionType,
  width: number,
) {
  switch (horizontal) {
    case 'left':
      return {
        left: `${EDGE_OFFSET}px`,
      };
    case 'right':
      return {
        right: `${EDGE_OFFSET}px`,
      };
    case 'middle':
      return { left: `${originPosition.x - width / 2}px` };
  }
}
