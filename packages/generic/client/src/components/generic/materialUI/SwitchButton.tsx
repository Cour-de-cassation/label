import React, { ChangeEvent, ReactElement } from 'react';
import { makeStyles, Switch as MUSwitch } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';

export { SwitchButton };

function SwitchButton(props: {
  checked: boolean;
  color: 'primary' | 'secondary' | 'default';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}): ReactElement {
  const theme = useCustomTheme();
  const classes = buildSwitchButtonClasses(theme);

  return <MUSwitch checked={props.checked} classes={{ ...classes }} color={props.color} onChange={props.onChange} />;

  function buildSwitchButtonClasses(theme: customThemeType) {
    return makeStyles({
      root: {
        width: 50,
        height: 30,
        padding: 0,
        borderRadius: theme.shape.borderRadius.medium,
        border: '2px solid',
      },
      switchBase: {
        color: theme.colors.line.level1,
        position: 'absolute',
        top: '-7px',
        left: '-7px',
        '&$checked': {
          color: theme.colors.line.level1,
        },
        '&$checked + $track': {
          backgroundColor: theme.colors.primary,
          opacity: 1,
        },
      },
      thumb: { height: 22, width: 22 },
      checked: {},
      track: {
        backgroundColor: theme.colors.background,
      },
    })();
  }
}
