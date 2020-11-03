import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { ChangeEvent, ReactElement, useState, CSSProperties } from 'react';

export { Dropdown };

function Dropdown<T extends string>(props: {
  defaultItem?: string;
  disabled?: boolean;
  error?: boolean;
  items: Array<{ value: T; displayedText: string }>;
  label: string;
  onChange: (value: T) => void;
  style?: CSSProperties;
}): ReactElement {
  const style = buildStyle();
  const [value, setValue] = useState(props.defaultItem);
  const labelId = `label-id-${Math.random()}`;

  return (
    <FormControl
      disabled={props.disabled}
      error={props.error}
      style={{ ...style.formControl, ...props.style }}
      variant="outlined"
    >
      <InputLabel id={labelId}>{props.label}</InputLabel>

      <Select labelId={labelId} value={value} onChange={handleChange}>
        {props.items.map(({ value, displayedText }, ind) => (
          <MenuItem key={ind} value={value}>
            {displayedText}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  function buildStyle() {
    return {
      formControl: {
        minWidth: 200,
      },
    };
  }

  function handleChange(event: ChangeEvent<{ value: unknown }>) {
    const value = event.target.value as T;
    setValue(value);
    props.onChange(value);
  }
}
