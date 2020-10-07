import React, { ChangeEvent, ReactElement } from 'react';
import { Switch as MUSwitch } from '@material-ui/core';

export { SwitchButton };

function SwitchButton(props: {
  checked: boolean;
  color: 'primary' | 'secondary' | 'default';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}): ReactElement {
  return <MUSwitch checked={props.checked} color={props.color} onChange={props.onChange} />;
}
