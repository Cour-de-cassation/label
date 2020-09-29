import React, { ChangeEvent, FunctionComponent } from 'react';
import { TextField } from '@material-ui/core';

export { TextInput };

type propsType = {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: FunctionComponent<propsType> = ({ name, placeholder, value, onChange }) => (
  <TextField id={name} label={placeholder} onChange={onChange} value={value} />
);
