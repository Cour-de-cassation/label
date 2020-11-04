import React, { MouseEvent, ReactElement, ReactNode, useState } from 'react';
import { makeStyles, Menu, MenuItem, useTheme, Theme } from '@material-ui/core';
import { Button } from './Button';
import { Icon } from './Icon';
import { LayoutGrid } from './LayoutGrid';

export { Dropdown };

const DROPDOWN_BORDER_THICKNESS = 2;

function Dropdown<T extends string>(props: {
  buildDisplayedItem: (param: { value: T; displayedText: string }) => ReactNode;
  color?: string;
  defaultItem?: T;
  disabled?: boolean;
  error?: boolean;
  items: Array<{ value: T; displayedText: string }>;
  label?: string;
  onChange: (value: T) => void;
  width?: number;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  const classes = buildMenuClasses();
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(props.defaultItem);
  const [dropdownPosition, setdDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownMenuConfiguration = {
    anchorOrigin: { horizontal: 'left', vertical: dropdownPosition },
    transformOrigin: { horizontal: 'left', vertical: oppositePosition(dropdownPosition) },
  } as const;

  return (
    <div>
      <Button
        disabled={props.disabled}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={openDropdown}
        style={style.dropdown}
        variant="outlined"
      >
        <LayoutGrid container alignItems="center">
          <LayoutGrid item style={style.dropdownText} xs={11}>
            {buildLabel()}
          </LayoutGrid>
          <LayoutGrid item style={style.dropdownArrow} xs={1}>
            <Icon iconName={isOpen() ? 'arrowReduce' : 'arrowExpand'} />
          </LayoutGrid>
        </LayoutGrid>
      </Button>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={dropdownMenuConfiguration?.anchorOrigin}
        classes={{ paper: classes.paper }}
        getContentAnchorEl={null} // To prevent materialUI to log cryptic error
        onClose={closeDropdown}
        open={isOpen()}
        transformOrigin={dropdownMenuConfiguration.transformOrigin}
      >
        {props.items.map(({ value, displayedText }, ind) => (
          <MenuItem key={ind} value={value} onClick={() => handleSelection(value)}>
            {displayedText}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

  function buildMenuClasses() {
    return makeStyles({
      paper: {
        width: `${props.width}px`,
      },
    })();
  }

  function buildStyle(theme: Theme) {
    const borderColor = props.color || theme.palette.grey[500];

    return {
      dropdown: {
        border: `${DROPDOWN_BORDER_THICKNESS}px solid ${borderColor}`,
        textTransform: 'none',
        width: `${props.width}px`,
      },
      dropdownText: {
        textAlign: 'left',
      },
      dropdownArrow: {
        display: 'flex',
      },
    } as const;
  }

  function buildLabel(): ReactNode {
    const currentItem = props.items.find((item) => item.value === selectedValue);

    if (currentItem) {
      return props.buildDisplayedItem(currentItem);
    } else {
      return props.label;
    }
  }

  function isOpen() {
    return !!anchorElement;
  }

  function openDropdown(event: MouseEvent) {
    const displayPosition = getDisplayPosition(event.currentTarget);
    setdDropdownPosition(displayPosition);
    setAnchorElement(event.currentTarget);

    function getDisplayPosition(anchorElement: Element | undefined) {
      const { bottom: dropdownMenuVerticalPosition } = anchorElement?.getBoundingClientRect() || { bottom: 0 };
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const dropdownMenuVerticalWindowPercentagePosition = (100 * dropdownMenuVerticalPosition) / windowHeight;

      return dropdownMenuVerticalWindowPercentagePosition < 75 ? 'bottom' : 'top';
    }
  }

  function closeDropdown() {
    setAnchorElement(undefined);
  }

  function handleSelection(value: T) {
    setSelectedValue(value);
    props.onChange(value);
    closeDropdown();
  }
}

function oppositePosition(position: 'bottom' | 'top') {
  return position === 'bottom' ? 'top' : 'bottom';
}
