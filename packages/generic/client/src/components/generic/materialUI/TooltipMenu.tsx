import { Menu } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';

export { TooltipMenu };

function TooltipMenu(props: {
  anchorElement: Element | undefined;
  children: ReactElement;
  onClose: () => void;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);
  const tooltipMenuConfiguration = buildTooltipMenuConfiguration();

  return (
    <Menu
      anchorEl={props.anchorElement}
      anchorOrigin={tooltipMenuConfiguration.anchorOrigin}
      getContentAnchorEl={null} // To prevent materialUI to log cryptic error
      onClose={props.onClose}
      open={isOpen()}
      style={style.tooltipMenu}
      transformOrigin={tooltipMenuConfiguration.transformOrigin}
    >
      <div style={style.tooltipMenuContent}>{props.children}</div>
    </Menu>
  );

  function buildStyle(theme: customThemeType) {
    return {
      tooltipMenu: {
        boxShadow: theme.boxShadow.minor,
        top: `${theme.spacing * 2}px`,
      },
      tooltipMenuContent: {
        padding: '12px 24px',
      },
    };
  }

  function isOpen() {
    return !!props.anchorElement;
  }

  function buildTooltipMenuConfiguration() {
    return {
      anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      transformOrigin: { horizontal: 'center', vertical: 'top' },
    } as const;
  }
}
