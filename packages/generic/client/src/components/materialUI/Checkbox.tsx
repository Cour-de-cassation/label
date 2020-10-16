import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import React, { ReactElement } from 'react';

export { Checkbox };

function Checkbox(props: { onChange: (event: any, checked: boolean) => void; text?: string }): ReactElement {
  if (props.text) {
    return <FormControlLabel control={<MuiCheckbox />} label={props.text} onChange={props.onChange} />;
  } else {
    return <MuiCheckbox onChange={props.onChange} />;
  }
}
