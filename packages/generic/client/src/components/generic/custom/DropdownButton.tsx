import React, { MouseEvent, ReactElement } from 'react';
import { useCustomTheme, customThemeType } from '../../../styles';
import { Icon, Text } from '../materialUI';
import { Button } from './Button';
import { ComponentsList } from './ComponentsList';

export { DropdownButton };

const LABELLED_DROPDOWN_BORDER_THICKNESS = 2;

function DropdownButton<T extends string>(props: {
  error?: boolean;
  isDisabled?: boolean;
  isOpen: boolean;
  item?: { icon?: ReactElement; text: string; value: T };
  label: string;
  labelIcon?: ReactElement;
  onClick: (event: MouseEvent) => void;
  width?: number;
}) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <Button disabledHover disabled={props.isDisabled} onClick={props.onClick} style={style.dropdown}>
      <div style={style.dropdownContent}>
        <div style={style.dropdownText}>
          {props.item
            ? buildDropdownLabel(props.item.text, props.item.icon, true)
            : buildDropdownLabel(props.label, props.labelIcon)}
        </div>
        <div style={style.dropdownArrow}>
          <Icon iconName={props.isOpen ? 'arrowUp' : 'arrowDown'} />
        </div>
      </div>
    </Button>
  );

  function buildDropdownLabel(text: string, icon?: ReactElement, isItemSelected?: boolean) {
    const textStyle = isItemSelected
      ? { color: theme.colors.line.level1 }
      : props.error
      ? { color: theme.colors.dropdown.border.error }
      : { color: theme.colors.line.level2 };
    return icon ? (
      <ComponentsList
        components={[icon, <Text style={textStyle}>{text}</Text>]}
        spaceBetweenComponents={theme.spacing}
      />
    ) : (
      <Text style={textStyle}>{text}</Text>
    );
  }

  function buildStyle(theme: customThemeType) {
    const borderColor = props.error ? theme.colors.dropdown.border.error : theme.colors.dropdown.border.default;
    return {
      dropdown: {
        backgroundColor: 'transparent',
        border: `${LABELLED_DROPDOWN_BORDER_THICKNESS}px solid ${borderColor}`,
        textTransform: 'none',
        width: props.width ? `${props.width - theme.spacing * 2}px` : '100%',
        padding: theme.spacing,
        borderRadius: theme.shape.borderRadius.xxs,
      },
      dropdownContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
      },
      dropdownText: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        paddingLeft: theme.spacing,
      },
      dropdownArrow: {
        display: 'flex',
      },
    } as const;
  }
}
