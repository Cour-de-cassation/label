import React, { MouseEvent, ReactElement } from 'react';
import { useCustomTheme, customThemeType } from '../../../styles';
import { Icon, Text } from '../materialUI';
import { Button } from './Button';
import { ComponentsList } from './ComponentsList';
import { Dropdown } from './Dropdown';

export { LabelledDropdown };

const LABELLED_DROPDOWN_BORDER_THICKNESS = 2;

function LabelledDropdown<T extends string>(props: {
  error?: boolean;
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  label: string;
  labelIcon?: ReactElement;
  onChange: (value: T) => void;
  width?: number;
}): ReactElement {
  return (
    <Dropdown
      buildButton={({ isOpen, item, onClick }) => (
        <LabelledDropdownButton
          error={props.error}
          isOpen={isOpen}
          item={item}
          label={props.label}
          labelIcon={props.labelIcon}
          onClick={onClick}
          width={props.width}
        />
      )}
      items={props.items}
      onChange={props.onChange}
      width={props.width}
    />
  );
}

function LabelledDropdownButton<T extends string>(props: {
  error?: boolean;
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
    <Button disabledHover onClick={props.onClick} style={style.dropdown}>
      <div style={style.dropdownContent}>
        <div style={style.dropdownText}>
          {props.item
            ? buildDropdownLabel(props.item.text, props.item.icon)
            : buildDropdownLabel(props.label, props.labelIcon)}
        </div>
        <div style={style.dropdownArrow}>
          <Icon iconName={props.isOpen ? 'arrowUp' : 'arrowDown'} />
        </div>
      </div>
    </Button>
  );

  function buildDropdownLabel(text: string, icon?: ReactElement) {
    return icon ? (
      <ComponentsList
        components={[icon, <Text style={{ color: 'inherit' }}>{text}</Text>]}
        spaceBetweenComponents={theme.spacing}
      />
    ) : (
      <Text style={{ color: 'inherit' }}>{text}</Text>
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
      },
      dropdownArrow: {
        display: 'flex',
      },
    } as const;
  }
}
