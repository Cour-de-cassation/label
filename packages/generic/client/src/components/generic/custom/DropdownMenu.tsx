import React, { ReactElement, ReactNode } from 'react';
import { useCustomTheme } from '../../../styles';
import { Menu, Text } from '../materialUI';
import { ComponentsList } from './ComponentsList';

export { DropdownMenu };

function DropdownMenu<T extends string>(props: {
  anchorElement: Element | undefined;
  dropdownPosition: 'bottom' | 'top';
  items: Array<{ icon?: ReactElement; text: string; value: T; isDisabled?: boolean }>;
  onChange: (value: T) => void;
  onClose: () => void;
  width?: number;
}): ReactElement {
  const theme = useCustomTheme();

  return (
    <Menu
      anchorElement={props.anchorElement}
      dropdownPosition={props.dropdownPosition}
      items={props.items.map(({ icon, text, value, isDisabled }) => ({
        element: icon ? (
          <ComponentsList
            components={[icon, <ItemText isDisabled={isDisabled}>{text}</ItemText>]}
            spaceBetweenComponents={theme.spacing}
          />
        ) : (
          <ItemText isDisabled={isDisabled}>{text}</ItemText>
        ),
        value,
        isDisabled,
      }))}
      onChange={props.onChange}
      onClose={props.onClose}
      width={props.width}
    />
  );
}

function ItemText(props: { children: ReactNode; isDisabled?: boolean }) {
  const styles = buildStyles();
  return (
    <Text variant="h3" style={styles.itemText}>
      {props.children}
    </Text>
  );
}

function buildStyles() {
  return {
    itemText: {
      whiteSpace: 'normal',
      color: 'inherit',
    } as const,
  };
}
