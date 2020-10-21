import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { ChangeEvent, ReactElement, useState } from 'react';

export { Dropdown };

function Dropdown(props: {
  defaultItem?: string;
  disabled?: boolean;
  items: Array<string>;
  label: string;
  onChange: (item: string) => void;
}): ReactElement {
  const style = buildStyle();
  const [value, setValue] = useState(props.defaultItem);
  const labelId = `label-id-${Math.random()}`;

  return (
    <FormControl disabled={props.disabled} style={style.formControl} variant="outlined">
      <InputLabel id={labelId}>{props.label}</InputLabel>

      <Select labelId={labelId} value={value} onChange={handleChange}>
        {props.items.map((item, ind) => (
          <MenuItem key={ind} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  function buildStyle() {
    return {
      formControl: {
        minWidth: 160,
      },
    };
  }

  function handleChange(event: ChangeEvent<{ value: unknown }>) {
    const value = event.target.value as string;
    setValue(value);
    props.onChange(value);
  }
}
