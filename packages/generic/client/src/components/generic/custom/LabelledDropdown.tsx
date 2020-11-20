import React, { MouseEvent, ReactElement } from 'react';
import { useCustomTheme, customThemeType } from '../../../styles';
import { Button, Icon, LayoutGrid, Text } from '../materialUI';
import { ComponentsList } from './ComponentsList';
import { Dropdown } from './Dropdown';

export { LabelledDropdown };

const LABELLED_DROPDOWN_BORDER_THICKNESS = 2;

function LabelledDropdown<T extends string>(props: {
  disabled?: boolean;
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
          disabled={props.disabled}
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
    ></Dropdown>
  );
}

function LabelledDropdownButton<T extends string>(props: {
  disabled?: boolean;
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
    <Button
      disabled={props.disabled}
      disabledHover
      onClick={props.onClick}
      style={style.dropdown}
      variant="outlined"
      width="100%"
    >
      <LayoutGrid container alignItems="center">
        <LayoutGrid item style={style.dropdownText} xs={11}>
          {props.item
            ? buildDropdownLabel(props.item.text, props.item.icon)
            : buildDropdownLabel(props.label, props.labelIcon)}
        </LayoutGrid>
        <LayoutGrid item style={style.dropdownArrow} xs={1}>
          <Icon iconName={props.isOpen ? 'arrowReduce' : 'arrowExpand'} />
        </LayoutGrid>
      </LayoutGrid>
    </Button>
  );

  function buildDropdownLabel(text: string, icon?: ReactElement) {
    return icon ? (
      <ComponentsList
        components={[icon, <Text style={{ color: 'inherit' }}>{text}</Text>]}
        spaceBetweenComponents={theme.spacing}
      />
    ) : (
      text
    );
  }

  function buildStyle(theme: customThemeType) {
    return {
      dropdown: {
        backgroundColor: theme.colors.background,
        border: `${LABELLED_DROPDOWN_BORDER_THICKNESS}px solid ${theme.colors.dropdown.border}`,
        textTransform: 'none',
        width: `${props.width}px`,
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
