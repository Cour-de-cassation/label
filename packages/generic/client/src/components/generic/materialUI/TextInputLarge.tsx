import React, { ChangeEvent, ReactElement, CSSProperties } from 'react';
import { TextField } from '@material-ui/core';

export { TextInputLarge };

function TextInputLarge(props: {
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  size: number;
  style?: CSSProperties;
}): ReactElement {
  return (
    <TextField
      placeholder={props.placeholder}
      multiline
      onChange={props.onChange}
      rows={props.size}
      style={props.style}
      variant={'outlined'}
    />
  );
}
