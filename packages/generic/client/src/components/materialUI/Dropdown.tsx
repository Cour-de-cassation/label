import { FormControl, MenuItem, Select } from '@material-ui/core';
import React, { ChangeEvent, ReactElement, useState } from 'react';

export { Dropdown };

function Dropdown(props: { defaultItem: string; items: string[]; onChange: (item: string) => void }): ReactElement {
  const [value, setValue] = useState(props.defaultItem);

  return (
    <FormControl variant="outlined">
      <Select value={value} onChange={handleChange}>
        {props.items.map((item, ind) => (
          <MenuItem key={ind} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  function handleChange(event: ChangeEvent<{ value: unknown }>) {
    const value = event.target.value as string;
    setValue(value);
    props.onChange(value);
  }
}
