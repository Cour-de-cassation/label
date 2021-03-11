import React, { ReactElement } from 'react';
import { Dropdown } from './Dropdown';
import { DropdownButton } from './DropdownButton';

export { LabelledDropdown };

function LabelledDropdown<T extends string>(props: {
  error?: boolean;
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  label: string;
  labelIcon?: ReactElement;
  onChange: (value: T) => void;
  width?: number;
}): ReactElement {
  return (
    <Dropdown
      buildButton={({ isOpen, item, onClick }) => (
        <DropdownButton
          error={props.error}
          isOpen={isOpen}
          item={item}
          label={props.label}
          labelIcon={props.labelIcon}
          onClick={onClick}
          width={props.width}
        />
      )}
      items={props.items}
      onChange={props.onChange}
      width={props.width}
    />
  );
}
