import React from 'react';
import { Snackbar as MUSnackbar } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from './Text';
import { Icon } from './Icon';

export { Snackbar };

export type { snackbarVariantType };

const DELAY_SHOW = 3 * 1000;

const MAX_WIDTH = 400;

type snackbarVariantType = 'success' | 'alert' | 'info';

function Snackbar(props: {
  variant: snackbarVariantType;
  text: string;
  isOpen: boolean;
  onClose: () => void;
  autoHide: boolean;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme, props.variant);
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
}
function buildStyles(theme: customThemeType, variant: snackbarVariantType) {
  const backgroundColor = getBackgroundColor(theme, variant);
  return {
    container: {
      padding: `${theme.spacing * 2}px ${theme.spacing}px ${theme.spacing * 2}px ${theme.spacing * 4}px`,
      maxWidth: MAX_WIDTH,
      borderRadius: theme.shape.borderRadius.xxxs,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: backgroundColor,
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

function getBackgroundColor(theme: customThemeType, variant: snackbarVariantType) {
  switch (variant) {
    case 'alert':
      return theme.colors.alert.background;
    case 'info':
      return theme.colors.primary.background;
    case 'success':
      return theme.colors.success.background;
  }
}
