import React from 'react';
import { Radio } from '@material-ui/core';
import { LayoutGrid } from './LayoutGrid';
import { Text } from './Text';

export { RadioButton };

function RadioButton(props: { isChecked: boolean; label: string; onClick: () => void }) {
  return (
    <LayoutGrid container alignItems="center">
      <Radio color="default" checked={props.isChecked} onClick={props.onClick} />
      <Text>{props.label}</Text>
    </LayoutGrid>
  );
}
