import React, { ReactElement } from 'react';
import { useCustomTheme } from '../../../styles';
import { Menu, Text } from '../materialUI';
import { ComponentsList } from './ComponentsList';

export { DropdownMenu };

function DropdownMenu<T extends string>(props: {
  anchorElement: Element | undefined;
  dropdownPosition: 'bottom' | 'top';
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  onChange: (value: T) => void;
  onClose: () => void;
  width?: number;
}): ReactElement {
  const theme = useCustomTheme();

  return (
    <Menu
      anchorElement={props.anchorElement}
      dropdownPosition={props.dropdownPosition}
      items={props.items.map(({ icon, text, value }) => ({
        element: icon ? (
          <ComponentsList
            components={[icon, <Text style={{ color: 'inherit' }}>{text}</Text>]}
            spaceBetweenComponents={theme.spacing}
          />
        ) : (
          text
        ),
        value,
      }))}
      onChange={props.onChange}
      onClose={props.onClose}
      width={props.width}
    />
  );
}
