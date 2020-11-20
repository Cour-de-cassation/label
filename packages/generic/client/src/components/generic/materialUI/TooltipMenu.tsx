import { Menu } from '@material-ui/core';
import React, { CSSProperties, MouseEvent, ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';

export { TooltipMenu };

function TooltipMenu(props: {
  anchorElement: Element | undefined;
  children: ReactElement;
  hover?: boolean;
  onClickOnAnchorElement?: () => void;
  onClose: () => void;
  style?: CSSProperties;
}): ReactElement {
  const displayPosition = getDisplayPosition();
  const theme = useCustomTheme();
  const style = buildStyle(displayPosition, theme);
  const tooltipMenuConfiguration = buildTooltipMenuConfiguration(displayPosition);
  const anchorElementHandler = buildAnchorElementHandler();

  return (
    <Menu
      anchorEl={props.anchorElement}
      anchorOrigin={tooltipMenuConfiguration.anchorOrigin}
      getContentAnchorEl={null} // To prevent materialUI to log cryptic error
      onBackdropClick={anchorElementHandler.onClick}
      onClose={props.onClose}
      onMouseMove={props.hover ? anchorElementHandler.onMouseMove : undefined}
      open={isOpen()}
      style={style.tooltipMenu}
      transformOrigin={tooltipMenuConfiguration.transformOrigin}
    >
      <div style={style.tooltipMenuContent}>{props.children}</div>
    </Menu>
  );

  function buildStyle(displayPosition: 'bottom' | 'top', theme: customThemeType) {
    return {
      tooltipMenu: {
        boxShadow: theme.boxShadow.level1,
        top: computeTopOffset(),
      },
      tooltipMenuContent: {
        padding: '12px 24px',
      },
    };

    function computeTopOffset() {
      switch (displayPosition) {
        case 'bottom':
          return '10px';
        case 'top':
          return '-10px';
      }
    }
  }

  function isOpen() {
    return !!props.anchorElement;
  }

  function buildTooltipMenuConfiguration(displayPosition: 'bottom' | 'top') {
    switch (displayPosition) {
      case 'bottom':
        return {
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
          transformOrigin: { horizontal: 'center', vertical: 'top' },
        } as const;
      case 'top':
        return {
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
          transformOrigin: { horizontal: 'center', vertical: 'bottom' },
        } as const;
    }
  }

  function getDisplayPosition() {
    const { bottom: tooltipMenuVerticalPosition } = props.anchorElement?.getBoundingClientRect() || { bottom: 0 };
    const { windowHeight } = getWindowSize();
    const tooltipMenuVerticalWindowPercentagePosition = (100 * tooltipMenuVerticalPosition) / windowHeight;

    if (tooltipMenuVerticalWindowPercentagePosition < 75) {
      return 'bottom';
    } else {
      return 'top';
    }
  }

  function getWindowSize() {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return { windowWidth, windowHeight };
  }

  function buildAnchorElementHandler() {
    return {
      onClick,
      onMouseMove,
    };

    function onClick(event: MouseEvent<Element>) {
      if (isEventOnAnchorElement(event)) {
        document.body.style.cursor = 'auto';
        props.onClickOnAnchorElement && props.onClickOnAnchorElement();
      }
    }

    function onMouseMove(event: MouseEvent<Element>) {
      if (isEventOnAnchorElement(event)) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'auto';
        props.onClose();
      }
    }

    function isEventOnAnchorElement(event: MouseEvent<Element>) {
      if (props.anchorElement) {
        const { bottom, left, right, top } = props.anchorElement.getBoundingClientRect();
        return event.clientX > left && event.clientX < right && event.clientY > top && event.clientY < bottom;
      } else {
        return false;
      }
    }
  }
}
