import React from 'react';
import { Snackbar as MUSnackbar } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from './Text';

export { Snackbar };

const DELAY_SHOW = 3 * 1000;

const MAX_WIDTH = 400;

function Snackbar(props: { variant: 'success' | 'alert'; text: string; isOpen: boolean; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <MUSnackbar open={props.isOpen} onClose={props.onClose} autoHideDuration={DELAY_SHOW}>
      <div style={styles.container}>
        <Text>{props.text}</Text>
      </div>
    </MUSnackbar>
  );

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
        maxWidth: MAX_WIDTH,
        borderRadius: theme.shape.borderRadius.xxxs,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors[props.variant].background,
      },
    };
  }
}
