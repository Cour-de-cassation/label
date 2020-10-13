import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import React, { ReactElement } from 'react';

export { Checkbox };

function Checkbox(props: { text?: string }): ReactElement {
  if (props.text) {
    return <FormControlLabel control={<MuiCheckbox />} label={props.text} />;
  } else {
    return <MuiCheckbox />;
  }
}
