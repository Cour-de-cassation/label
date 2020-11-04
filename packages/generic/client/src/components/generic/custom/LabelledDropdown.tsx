import React, { ReactElement } from 'react';
import { Dropdown } from '../materialUI';

export { LabelledDropdown };

function LabelledDropdown<T extends string>(props: {
  disabled?: boolean;
  error?: boolean;
  items: Array<{ value: T; displayedText: string }>;
  label: string;
  onChange: (value: T) => void;
  width?: number;
}): ReactElement {
  return (
    <Dropdown
      buildDisplayedItem={({ displayedText }) => displayedText}
      disabled={props.disabled}
      error={props.error}
      items={props.items}
      label={props.label}
      onChange={props.onChange}
      width={props.width}
    ></Dropdown>
  );
}
