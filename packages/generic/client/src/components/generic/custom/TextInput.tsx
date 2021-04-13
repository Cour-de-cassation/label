import React, { ChangeEvent, ReactElement } from 'react';
import { customThemeType, typography, useCustomTheme } from '../../../styles';

export { TextInput };

function TextInput(props: {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}): ReactElement {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <input
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={onChange}
      style={styles.input}
    />
  );

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    return props.onChange(event.target.value);
  }
}

function buildStyles(theme: customThemeType) {
  return {
    input: {
      padding: theme.spacing,
      backgroundColor: 'transparent',
      border: 'none',
      color: theme.colors.line.level1,
      borderBottom: `${theme.colors.line.level2} 2px solid`,
      textAlign: 'right',
      ...typography.body1.normal,
    },
  } as const;
}
