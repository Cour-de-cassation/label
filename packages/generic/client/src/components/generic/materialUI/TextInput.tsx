import React, { ChangeEvent, ReactElement } from 'react';
import { TextField } from '@material-ui/core';

export { TextInput };

function TextInput(props: {
  name: string;
  placeholder?: string;
  value: string;
  error?: boolean;
  errorText?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: React.InputHTMLAttributes<unknown>['type'];
}): ReactElement {
  return (
    <TextField
      id={props.name}
      error={!!props.errorText || !!props.error}
      helperText={props.errorText}
      label={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      type={props.type}
      variant="outlined"
    />
  );
}
