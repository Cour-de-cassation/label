import React, { FormEvent, useState } from 'react';
import { customThemeType, useCustomTheme, IconButton, TextInput } from 'pelta-design-system';
import { wordings } from '../../wordings';

export { DocumentNumberTextInput };

function DocumentNumberTextInput(props: {
  onChange: (decisionNumber: number | undefined) => void;
  value: number | undefined;
}) {
  const theme = useCustomTheme();
  const [decisionNumber, setDecisionNumber] = useState<number | undefined>(props.value);
  const styles = buildStyles(theme);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputContainer}>
        <TextInput
          name="decisionNumber"
          value={decisionNumber !== undefined ? decisionNumber.toString() : ''}
          onChange={onChange}
          placeholder={wordings.business.decisionNumberPlaceholder}
        />
      </div>
      <IconButton
        hint={wordings.business.decisionNumberHint}
        onClick={handleSubmit}
        backgroundColor="default"
        iconName="search"
        type="submit"
      />
    </form>
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    props.onChange(decisionNumber);
  }

  function onChange(value: string) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      return setDecisionNumber(undefined);
    }
    return setDecisionNumber(parsedValue);
  }
}

function buildStyles(theme: customThemeType) {
  return {
    form: {
      display: 'flex',
      marginRight: theme.spacing * 2,
    },
    inputContainer: {
      marginRight: theme.spacing,
    },
  } as const;
}
