import React from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';
import { LayoutGrid } from './LayoutGrid';

export { RadioButton };

function RadioButton(props: { isChecked: boolean; label: string; onClick: () => void }) {
  return (
    <LayoutGrid container alignItems="center">
      <FormControlLabel
        onClick={props.onClick}
        value={props.label}
        control={<Radio checked={props.isChecked} color="default" />}
        label={props.label}
      />
    </LayoutGrid>
  );
}
