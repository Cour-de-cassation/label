import React from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';

export { RadioButton };

function RadioButton(props: { isChecked: boolean; label: string; onClick: () => void }) {
  const styles = buildStyles();
  return (
    <div style={styles.container}>
      <FormControlLabel
        onClick={props.onClick}
        value={props.label}
        control={<Radio checked={props.isChecked} color="default" />}
        label={props.label}
      />
    </div>
  );
}

function buildStyles() {
  return {
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
  };
}
