import React, { ReactElement } from 'react';
import { positionType } from '../../../types';
import { TooltipMenu } from './TooltipMenu';

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
  const displayPosition = getDisplayPosition(props.originPosition, props.width);
  const tooltipMenuRectPosition = getTooltipMenuRectPosition(displayPosition, props.originPosition, props.width);
  return (
    <TooltipMenu
      rectPosition={tooltipMenuRectPosition}
      onClose={props.onClose}
      shouldCloseWhenClickedAway={props.shouldCloseWhenClickedAway}
      width={props.width}
    >
      {props.children}
    </TooltipMenu>
  );
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

function getTooltipMenuRectPosition(displayPosition: displayPositionType, originPosition: positionType, width: number) {
  const windowSize = getWindowSize();
  return {
    ...getVerticalOrigin(displayPosition.vertical, windowSize.height, originPosition),
    ...getHorizontalOrigin(displayPosition.horizontal, originPosition, width),
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
