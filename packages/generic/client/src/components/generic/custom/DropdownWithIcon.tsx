import React, { ReactElement, ReactNode } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { LayoutGrid, Text } from '../materialUI';
import { Dropdown } from './Dropdown';

export { DropdownWithIcon };

function DropdownWithIcon<T extends string>(props: {
  color?: string;
  defaultItem: T;
  icon: ReactNode;
  items: Array<{ value: T; displayedText: string }>;
  onChange: (value: T) => void;
  width?: number;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);

  return (
    <Dropdown
      buildDisplayedItem={({ displayedText }) => (
        <div>
          <LayoutGrid container item alignItems="center">
            <LayoutGrid item>{props.icon}</LayoutGrid>
            <LayoutGrid item style={style.dropdownText}>
              <Text>{displayedText}</Text>
            </LayoutGrid>
          </LayoutGrid>
        </div>
      )}
      color={props.color}
      defaultItem={props.defaultItem}
      items={props.items}
      onChange={props.onChange}
      width={props.width}
    ></Dropdown>
  );

  function buildStyle(theme: Theme) {
    return {
      dropdownText: {
        paddingLeft: theme.spacing(),
      },
    };
  }
}
