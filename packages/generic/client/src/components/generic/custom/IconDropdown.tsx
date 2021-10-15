import React, { MouseEvent, ReactElement } from 'react';
import { iconNameType } from '../materialUI';
import { buttonColorType } from './Button';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';

export { IconDropdown };

function IconDropdown<T extends string>(props: {
  buttonSize?: number;
  backgroundColor?: buttonColorType;
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  items: Array<{ icon?: ReactElement; text: string; value: T; isDisabled?: boolean }>;
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
          backgroundColor={props.backgroundColor}
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
    />
  );
}

function IconDropdownButton(props: {
  buttonSize?: number;
  backgroundColor?: buttonColorType;
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}) {
  return (
    <IconButton
      buttonSize={props.buttonSize}
      backgroundColor={props.backgroundColor}
      disabled={props.disabled}
      hint={props.hint}
      iconName={props.iconName}
      onClick={props.onClick}
    />
  );
}
