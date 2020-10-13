import { Menu } from '@material-ui/core';
import React, { ReactElement } from 'react';

export { TooltipMenu };

function TooltipMenu(props: {
  anchorEl: Element | undefined;
  children: ReactElement;
  open: boolean;
  onClose: () => void;
}): ReactElement {
  const displayPosition = getDisplayPosition();
  const style = buildStyle(displayPosition);
  const tooltipMenuConfiguration = buildTooltipMenuConfiguration(displayPosition);

  return (
    <Menu
      anchorEl={props.anchorEl}
      anchorOrigin={tooltipMenuConfiguration.anchorOrigin}
      getContentAnchorEl={null} // To prevent materialUI to log cryptic error
      onClose={props.onClose}
      open={props.open}
      style={style.menu}
      transformOrigin={tooltipMenuConfiguration.transformOrigin}
    >
      {props.children}
    </Menu>
  );

  function buildStyle(displayPosition: 'bottom' | 'top') {
    return {
      menu: {
        top: computeTopOffset(),
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
    const { bottom: tooltipMenuVerticalPosition } = props.anchorEl?.getBoundingClientRect() || { bottom: 0 };
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
}
