import React, { ChangeEvent, FunctionComponent } from 'react';
import { TextField } from '@material-ui/core';

export { TextInput };

type propsType = {
  name: string;
  placeholder?: string;
  value: string;
  errorText?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: React.InputHTMLAttributes<unknown>['type'];
};

const TextInput: FunctionComponent<propsType> = ({
  name,
  placeholder,
  value,
  onChange,
  errorText,
  type,
}: propsType) => (
  <TextField
    id={name}
    error={!!errorText}
    helperText={errorText}
    label={placeholder}
    onChange={onChange}
    value={value}
    type={type}
  />
);
