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
    <MUButton variant="contained" color={props.color} onClick={props.onClick} style={props.style}>
      {!!props.iconName && (
        <div style={styles.iconContainer}>
          <Icon iconName={props.iconName} />
        </div>
      )}
      {props.children}
    </MUButton>
  );

  function buildStyles(theme: Theme) {
    return {
      iconContainer: {
        display: 'flex',
        paddingRight: theme.spacing(),
      },
    };
  }
}
