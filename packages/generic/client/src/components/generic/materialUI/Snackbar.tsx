import React from 'react';
import { Snackbar as MUSnackbar } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from './Text';
import { Icon } from './Icon';

export { Snackbar };

const DELAY_SHOW = 3 * 1000;

const MAX_WIDTH = 400;

function Snackbar(props: {
  variant: 'success' | 'alert';
  text: string;
  isOpen: boolean;
  onClose: () => void;
  autoHide: boolean;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <MUSnackbar open={props.isOpen} onClose={props.onClose} autoHideDuration={props.autoHide ? DELAY_SHOW : undefined}>
      <div style={styles.container}>
        <Text style={styles.text}>{props.text}</Text>
        {!props.autoHide && (
          <div style={styles.iconContainer} onClick={props.onClose}>
            <Icon iconName="close" />
          </div>
        )}
      </div>
    </MUSnackbar>
  );

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        padding: `${theme.spacing * 2}px ${theme.spacing}px ${theme.spacing * 2}px ${theme.spacing * 4}px`,
        maxWidth: MAX_WIDTH,
        borderRadius: theme.shape.borderRadius.xxxs,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors[props.variant].background,
      },
      text: {
        marginRight: theme.spacing * 2,
      },
      iconContainer: {
        paddingTop: '2px',
        cursor: 'pointer',
      },
    };
  }
}
