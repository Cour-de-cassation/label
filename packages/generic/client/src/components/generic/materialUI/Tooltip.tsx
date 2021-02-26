import React, { ReactElement } from 'react';
import { Tooltip as MuiTooltip } from '@material-ui/core';
import { Text } from './Text';

export { Tooltip };

function Tooltip(props: { arrow?: boolean; title: string; children: ReactElement }) {
  return (
    <MuiTooltip arrow={props.arrow} title={<Text>{props.title}</Text>}>
      {props.children}
    </MuiTooltip>
  );
}
