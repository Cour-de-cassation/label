import React, { ChangeEvent, CSSProperties, ReactElement } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';

export { TextInput, buildInputClasses };

function TextInput(props: {
  name: string;
  placeholder?: string;
  value: string;
  error?: boolean;
  errorText?: string;
  multiline?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  size?: number;
  style?: CSSProperties;
  type?: React.InputHTMLAttributes<unknown>['type'];
}): ReactElement {
  const theme = useCustomTheme();
  const inputClasses = buildInputClasses(theme);
  return (
    <TextField
      id={props.name}
      InputProps={{ classes: inputClasses }}
      error={!!props.errorText || !!props.error}
      helperText={props.errorText}
      label={props.placeholder}
      multiline={props.multiline}
      onChange={props.onChange}
      rows={props.size}
      style={props.style}
      type={props.type}
      value={props.value}
      variant="outlined"
    />
  );
}

function buildInputClasses(theme: customThemeType) {
  return makeStyles({
    notchedOutline: {
      borderWidth: 2,
      borderColor: theme.colors.line.level2,
    },
  })();
}
