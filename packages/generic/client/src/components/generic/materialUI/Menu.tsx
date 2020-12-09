import React, { MouseEvent, ReactElement, ReactNode } from 'react';
import { makeStyles, Menu as MUMenu, MenuItem } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';

export { Menu };

function Menu<T extends string>(props: {
  anchorElement: Element | undefined;
  dropdownPosition: 'bottom' | 'top';
  items: Array<{ value: T; element: ReactNode }>;
  onChange: (value: T) => void;
  onClose: (event: MouseEvent) => void;
  width?: number;
}): ReactElement {
  const theme = useCustomTheme();
  const menuClasses = buildMenuClasses(theme);
  const menuItemClasses = buildMenuItemClasses(theme);
  const dropdownMenuConfiguration = {
    anchorOrigin: { horizontal: 'left', vertical: props.dropdownPosition },
    transformOrigin: { horizontal: 'left', vertical: oppositePosition(props.dropdownPosition) },
  } as const;

  return (
    <MUMenu
      anchorEl={props.anchorElement}
      anchorOrigin={dropdownMenuConfiguration?.anchorOrigin}
      classes={menuClasses}
      getContentAnchorEl={null} // To prevent materialUI to log cryptic error
      onClose={onClose}
      open={isOpen()}
      transformOrigin={dropdownMenuConfiguration.transformOrigin}
    >
      {props.items.map(({ value, element }, ind) => (
        <MenuItem
          classes={menuItemClasses}
          key={ind}
          value={value}
          onClick={(event: MouseEvent) => handleSelection(event, value)}
        >
          {element}
        </MenuItem>
      ))}
    </MUMenu>
  );

  function buildMenuClasses(theme: customThemeType) {
    return makeStyles({
      paper: {
        backgroundColor: theme.colors.background,
        maxHeight: '300px',
        width: `${props.width}px`,
      },
    })();
  }

  function buildMenuItemClasses(theme: customThemeType) {
    return makeStyles({
      root: {
        borderRadius: theme.shape.borderRadius.medium,
        margin: theme.spacing,
        '&:hover': {
          background: theme.colors.default.hoveredBackground,
          borderRadius: theme.shape.borderRadius.medium,
          color: theme.colors.default.hoveredTextColor,
        },
      },
    })();
  }

  function isOpen() {
    return !!props.anchorElement;
  }

  function handleSelection(event: MouseEvent, value: T) {
    props.onChange(value);
    onClose(event);
  }

  function onClose(event: MouseEvent) {
    event.stopPropagation();
    props.onClose(event);
  }
}

function oppositePosition(position: 'bottom' | 'top') {
  return position === 'bottom' ? 'top' : 'bottom';
}
