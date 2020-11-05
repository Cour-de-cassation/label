import React, { ReactElement, ReactNode } from 'react';
import { makeStyles, Menu as MUMenu, MenuItem } from '@material-ui/core';

export { Menu };

function Menu<T extends string>(props: {
  anchorElement: Element | undefined;
  dropdownPosition: 'bottom' | 'top';
  items: Array<{ value: T; element: ReactNode }>;
  onChange: (value: T) => void;
  onClose: () => void;
  width?: number;
}): ReactElement {
  const classes = buildMenuClasses();
  const dropdownMenuConfiguration = {
    anchorOrigin: { horizontal: 'left', vertical: props.dropdownPosition },
    transformOrigin: { horizontal: 'left', vertical: oppositePosition(props.dropdownPosition) },
  } as const;

  return (
    <MUMenu
      anchorEl={props.anchorElement}
      anchorOrigin={dropdownMenuConfiguration?.anchorOrigin}
      classes={{ paper: classes.paper }}
      getContentAnchorEl={null} // To prevent materialUI to log cryptic error
      onClose={props.onClose}
      open={isOpen()}
      transformOrigin={dropdownMenuConfiguration.transformOrigin}
    >
      {props.items.map(({ value, element }, ind) => (
        <MenuItem key={ind} value={value} onClick={() => handleSelection(value)}>
          {element}
        </MenuItem>
      ))}
    </MUMenu>
  );

  function buildMenuClasses() {
    return makeStyles({
      paper: {
        width: `${props.width}px`,
      },
    })();
  }

  function isOpen() {
    return !!props.anchorElement;
  }

  function handleSelection(value: T) {
    props.onChange(value);
    props.onClose();
  }
}

function oppositePosition(position: 'bottom' | 'top') {
  return position === 'bottom' ? 'top' : 'bottom';
}
