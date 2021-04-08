import React from 'react';
import { TextInput } from '../generic';
import { wordings } from '../../wordings';

export { DecisionNumberTextInput };

function DecisionNumberTextInput(props: {
  onChange: (decisionNumber: number | undefined) => void;
  value: number | undefined;
}) {
  return (
    <TextInput
      name="decisionNumber"
      value={props.value !== undefined ? props.value.toString() : ''}
      onChange={onChange}
      placeholder={wordings.business.decisionNumberPlaceholder}
    />
  );

  function onChange(value: string) {
    const decisionNumber = parseInt(value, 10);
    if (isNaN(decisionNumber)) {
      return props.onChange(undefined);
    }
    return props.onChange(decisionNumber);
  }
}
