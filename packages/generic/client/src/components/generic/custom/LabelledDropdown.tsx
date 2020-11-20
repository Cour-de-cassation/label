import React, { MouseEvent, ReactElement, ReactNode } from 'react';
import { Button, Icon, LayoutGrid } from '../materialUI';
import { Dropdown } from './Dropdown';
import { useCustomTheme, customThemeType } from '../../../styles';

export { LabelledDropdown };

const LABELLED_DROPDOWN_BORDER_THICKNESS = 2;

function LabelledDropdown<T extends string>(props: {
  disabled?: boolean;
  error?: boolean;
  items: Array<{ displayedText: string; value: T }>;
  label: string;
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
          onClick={onClick}
          width={props.width}
        />
      )}
      items={props.items.map((item) => ({ element: item.displayedText, value: item.value }))}
      onChange={props.onChange}
      width={props.width}
    ></Dropdown>
  );
}

function LabelledDropdownButton<T extends string>(props: {
  disabled?: boolean;
  isOpen: boolean;
  item?: { element: ReactNode; value: T };
  label: string;
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
          {props.item?.element || props.label}
        </LayoutGrid>
        <LayoutGrid item style={style.dropdownArrow} xs={1}>
          <Icon iconName={props.isOpen ? 'arrowReduce' : 'arrowExpand'} />
        </LayoutGrid>
      </LayoutGrid>
    </Button>
  );

  function buildStyle(theme: customThemeType) {
    return {
      dropdown: {
        backgroundColor: theme.colors.background,
        border: `${LABELLED_DROPDOWN_BORDER_THICKNESS}px solid ${theme.colors.dropdown.border}`,
        textTransform: 'none',
        width: `${props.width}px`,
      },
      dropdownText: {
        textAlign: 'left',
      },
      dropdownArrow: {
        display: 'flex',
      },
    } as const;
  }
}
