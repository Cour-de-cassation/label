import React, { ReactNode } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { zIndices } from '../materialUI/constants';

export { PopUp };

function PopUp(props: { children: ReactNode }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.overlay} />
      <div style={styles.popUpContainer}>
        <div style={styles.popUp}>{props.children}</div>
      </div>
    </>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.colors.overlay,
      opacity: 0.5,
      zIndex: zIndices.popUpOverlay,
    },
    popUpContainer: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: zIndices.popUp,
    },
    popUp: {
      borderRadius: theme.shape.borderRadius.s,
      width: '30vw',
      backgroundColor: theme.colors.background,
      padding: `${theme.spacing * 9}px ${theme.spacing * 8}px`,
    },
  } as const;
}
