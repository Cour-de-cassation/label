import React, { CSSProperties, ReactElement, MouseEvent } from 'react';
import { iconNameType, Icon, Text } from '../materialUI';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Button, buttonColorType } from './Button';
import { Loader } from './Loader';

export { ButtonWithIcon };

function ButtonWithIcon(props: {
  color?: buttonColorType;
  disabled?: boolean;
  iconName: iconNameType;
  isLoading?: boolean;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
  text: string;
  type?: 'submit';
}): ReactElement {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <Button
      color={props.color}
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ ...styles.button, ...props.style }}
      type={props.type}
    >
      {props.isLoading ? (
        <Loader />
      ) : (
        <div style={styles.iconContainer}>
          <Icon iconName={props.iconName} />
        </div>
      )}
      <Text style={styles.buttonText}>{props.text}</Text>
    </Button>
  );

  function buildStyles(theme: customThemeType) {
    return {
      button: {
        justifyContent: 'start',
        textTransform: 'none',
        padding: `${theme.spacing}px ${theme.spacing * 2}px`,
      },
      iconContainer: {
        display: 'flex',
      },
      loadingWheelContainer: {
        backgroundColor: 'red',
      },
      loadingWheel: {
        margin: 0,
      },
      buttonText: {
        paddingLeft: theme.spacing,
      },
    } as const;
  }
}
