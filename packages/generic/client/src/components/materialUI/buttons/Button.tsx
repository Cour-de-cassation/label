import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton, Theme, useTheme } from '@material-ui/core';
import { iconNameType, Icon } from '../Icon';

export { Button };

function Button(props: {
  children?: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
  iconName?: iconNameType;
}): ReactElement {
  const theme = useTheme();
  const styles = buildStyles(theme);
  return (
    <MUButton
      variant="contained"
      color={props.color}
      onClick={props.onClick}
      style={{ ...styles.button, ...props.style }}
    >
      {!!props.iconName && (
        <div style={styles.iconContainer}>
          <Icon iconName={props.iconName} />
        </div>
      )}
      {!!props.children && (
        <div style={props.iconName ? styles.buttonContentWithIcon : undefined}>{props.children}</div>
      )}
    </MUButton>
  );

  function buildStyles(theme: Theme) {
    return {
      button: {
        minWidth: theme.shape.borderRadius * 2,
      },
      iconContainer: {
        display: 'flex',
      },
      buttonContentWithIcon: {
        paddingLeft: theme.spacing(),
      },
    };
  }
}
