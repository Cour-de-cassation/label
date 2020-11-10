import React, { MouseEvent, ReactElement } from 'react';
import { iconNameType } from '../materialUI';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';

export { IconDropdown };

function IconDropdown<T extends string>(props: {
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  items: Array<{ displayedText: string; value: T }>;
  onChange: (value: T) => void;
  onClose?: () => void;
  width?: number;
}): ReactElement {
  return (
    <Dropdown
      buildButton={({ onClick }) => (
        <IconDropdownButton disabled={props.disabled} hint={props.hint} iconName={props.iconName} onClick={onClick} />
      )}
      items={props.items.map((item) => ({ element: item.displayedText, value: item.value }))}
      onChange={props.onChange}
      onClose={props.onClose}
      width={props.width}
    ></Dropdown>
  );
}

function IconDropdownButton(props: {
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}) {
  return (
    <IconButton
      color="default"
      disabled={props.disabled}
      hint={props.hint}
      iconName={props.iconName}
      onClick={props.onClick}
    />
  );
}
