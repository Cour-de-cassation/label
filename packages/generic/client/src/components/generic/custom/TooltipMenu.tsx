import React, { ReactElement } from 'react';
import { useCustomTheme } from '../../../styles';
import { rectPositionType } from '../../../types';
import { zIndices } from '../materialUI/constants';

export { TooltipMenu };

function TooltipMenu(props: {
  children: ReactElement;
  onClose: () => void;
  shouldCloseWhenClickedAway: boolean;
  rectPosition: rectPositionType;
  width: number;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  return (
    <>
      {props.shouldCloseWhenClickedAway && <div onClick={props.onClose} style={styles.overlay} />}
      <div style={styles.tooltipMenu}>
        <div style={styles.tooltipMenuContent}>{props.children}</div>
      </div>
    </>
  );

  function buildStyles() {
    return {
      overlay: {
        backgroundColor: theme.colors.overlay,
        opacity: 0.2,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      },
      tooltipMenuContent: {
        padding: `${theme.spacing * 2}px`,
      },
      tooltipMenu: {
        boxShadow: theme.boxShadow.minor.out,
        backgroundColor: theme.colors.default.background,
        borderRadius: theme.shape.borderRadius.xxs,
        position: 'absolute',
        width: props.width,
        zIndex: zIndices.tooltipMenu,
        ...props.rectPosition,
      },
    } as const;
  }
}
