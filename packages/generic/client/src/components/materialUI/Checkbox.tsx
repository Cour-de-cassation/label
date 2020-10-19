import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import React, { ReactElement, useState } from 'react';

export { Checkbox };

function Checkbox(props: {
  defaultChecked: boolean;
  onChange: (checked: boolean) => void;
  text?: string;
}): ReactElement {
  const [checked, setChecked] = useState(props.defaultChecked);

  if (props.text) {
    return <FormControlLabel control={<MuiCheckbox checked={checked} />} label={props.text} onChange={handleChange} />;
  } else {
    return <MuiCheckbox checked={checked} onChange={handleChange} />;
  }

  function handleChange(event: any, checked: boolean) {
    setChecked(checked);
    props.onChange(checked);
  }
}
