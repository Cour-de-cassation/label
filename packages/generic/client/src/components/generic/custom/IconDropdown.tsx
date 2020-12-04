import React, { MouseEvent, ReactElement } from 'react';
import { iconNameType } from '../materialUI';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';

export { IconDropdown };

function IconDropdown<T extends string>(props: {
  buttonSize?: number;
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  onChange: (value: T) => void;
  onClick?: () => void;
  onClose?: () => void;
  width?: number;
}): ReactElement {
  return (
    <Dropdown
      buildButton={({ onClick }) => (
        <IconDropdownButton
          buttonSize={props.buttonSize}
          color={props.color}
          disabled={props.disabled}
          hint={props.hint}
          iconName={props.iconName}
          onClick={(event) => {
            onClick(event);
            props.onClick && props.onClick();
          }}
        />
      )}
      items={props.items}
      onChange={props.onChange}
      onClose={props.onClose}
      width={props.width}
    ></Dropdown>
  );
}

function IconDropdownButton(props: {
  buttonSize?: number;
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}) {
  return (
    <IconButton
      buttonSize={props.buttonSize}
      color={props.color}
      disabled={props.disabled}
      hint={props.hint}
      iconName={props.iconName}
      onClick={props.onClick}
    />
  );
}
