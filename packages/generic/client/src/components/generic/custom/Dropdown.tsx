import React, { MouseEvent, ReactElement, ReactNode, useState } from 'react';
import { Menu } from '../materialUI';

export { Dropdown };

function Dropdown<T extends string>(props: {
  buildButton: (param: {
    isOpen: boolean;
    item?: { element: ReactNode; value: T };
    onClick: (event: MouseEvent) => void;
  }) => ReactNode;
  defaultValue?: T;
  items: Array<{ element: ReactNode; value: T }>;
  onChange: (value: T) => void;
  onClose?: () => void;
  width?: number;
}): ReactElement {
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(props.defaultValue);
  const [dropdownPosition, setdDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  return (
    <div>
      {props.buildButton({
        isOpen: isOpen(),
        item: props.items.find((item) => item.value === selectedValue),
        onClick: openDropdown,
      })}
      <Menu
        anchorElement={anchorElement}
        dropdownPosition={dropdownPosition}
        items={props.items}
        onChange={handleSelection}
        onClose={closeDropdown}
        width={props.width}
      />
    </div>
  );

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
    props.onClose && props.onClose();
  }

  function handleSelection(value: T) {
    setSelectedValue(value);
    props.onChange(value);
  }
}
