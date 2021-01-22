import React, { ReactElement, useState } from 'react';
import { get } from 'lodash';
import styled from 'styled-components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { TableSortLabel, Text } from '../../materialUI';
import { OptionButton } from './OptionButton';

export { Table };

const DEFAULT_ORDER_DIRECTION = 'asc';

const ROW_DEFAULT_HEIGHT = 40;

type orderByPropertyType<T> = keyof T;

type orderDirectionType = 'asc' | 'desc';

function Table<T>(props: {
  footer?: Array<{
    id: string;
    content: ReactElement;
  }>;
  header?: Array<{
    id: keyof T;
    content: ReactElement;
    canBeSorted?: boolean;
  }>;
  isFooterSticky?: boolean;
  isHeaderSticky?: boolean;
  data: T[];
}) {
  const theme = useCustomTheme();
  const [rowFocused, setRowFocused] = useState<T | undefined>();
  const [orderByProperty, setOrderByProperty] = useState<orderByPropertyType<T> | undefined>();
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>(DEFAULT_ORDER_DIRECTION);
  const tableStyle = buildTableStyle();
  return (
    <table style={tableStyle}>
      {renderHeader()}
      {renderBody(theme)}
      {renderFooter()}
    </table>
  );

  function renderHeader() {
    if (!props.header) {
      return;
    }
    const headerStyles = props.isHeaderSticky
      ? { ...buildHeaderStyles(), ...buildHeaderStickyStyle() }
      : buildHeaderStyles();
    return (
      <thead>
        <tr style={headerStyles}>
          {props.header.map((cell) => (
            <td>
              {cell.canBeSorted ? (
                <TableSortLabel
                  direction={orderDirection}
                  active={orderByProperty === cell.id}
                  onClick={onOrderByPropertyClickBuilder(cell.id)}
                >
                  {cell.content}
                </TableSortLabel>
              ) : (
                cell.content
              )}
            </td>
          ))}
        </tr>
      </thead>
    );
  }

  function renderBody(theme: customThemeType) {
    const sortedData = sortData(props.data);
    const styleProps = {
      theme,
    };
    const { Div_OptionButtonContainer, Tr } = buildStyledComponents();
    return (
      <tbody>
        {sortedData.map((row) => (
          <>
            <Div_OptionButtonContainer isFocused={rowFocused === row} styleProps={styleProps}>
              <OptionButton onClick={() => {}} />
            </Div_OptionButtonContainer>
            <Tr
              onMouseOut={() => setRowFocused(undefined)}
              onMouseOver={() => setRowFocused(row)}
              styleProps={styleProps}
            >
              {Object.values(row).map((value) => (
                <td>
                  <Text variant="h3">{value}</Text>
                </td>
              ))}
            </Tr>
          </>
        ))}
      </tbody>
    );
  }

  function renderFooter() {
    if (!props.footer) {
      return;
    }
    const footerStyles = props.isFooterSticky
      ? { ...buildFooterStyles(), ...buildFooterStickyStyle() }
      : buildFooterStyles();
    return (
      <tfoot>
        <tr style={footerStyles}>
          {props.footer.map((cell) => (
            <td key={cell.id}>{cell.content}</td>
          ))}
        </tr>
      </tfoot>
    );
  }

  function sortData(data: T[]): T[] {
    if (!orderByProperty) {
      return data;
    }
    return data.sort((dataA, dataB) => {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      const propertyA = get(dataA, orderByProperty);
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      const propertyB = get(dataB, orderByProperty);
      if (propertyA === propertyB) {
        return 0;
      } else if (propertyA < propertyB) {
        return orderDirection === 'asc' ? 1 : -1;
      } else {
        return orderDirection === 'asc' ? -1 : 1;
      }
    });
  }

  function onOrderByPropertyClickBuilder(newOrderByProperty: orderByPropertyType<T>) {
    const onOrderByPropertyClick = () => {
      if (newOrderByProperty === orderByProperty) {
        setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setOrderDirection(DEFAULT_ORDER_DIRECTION);
        setOrderByProperty(newOrderByProperty);
      }
    };
    return onOrderByPropertyClick;
  }

  function buildTableStyle() {
    return {
      borderCollapse: 'collapse',
      width: '100%',
    } as const;
  }

  function buildStyledComponents() {
    type stylePropsType = {
      styleProps: {
        theme: customThemeType;
      };
    };

    const Tr = styled.tr<stylePropsType>`
      ${({ styleProps }) => {
        return `
          height: ${ROW_DEFAULT_HEIGHT}px;
          position: relative;
          &:hover {
            background-color: ${styleProps.theme.colors.default.background};
            cursor: pointer;
          }
      `;
      }}
    `;

    const Div_OptionButtonContainer = styled.div<stylePropsType & { isFocused: boolean }>`
      ${({ isFocused }) => {
        return `
        right: 0;
        z-index: 10;
        position: absolute;
        ${!isFocused && 'display: none;'}

    `;
      }}
    `;
    return {
      Div_OptionButtonContainer,
      Tr,
    };
  }

  function buildHeaderStickyStyle() {
    return {
      backgroundColor: theme.colors.background,
      top: 0,
      position: 'sticky',
    } as const;
  }

  function buildHeaderStyles() {
    return {
      borderBottom: `1px solid ${theme.colors.line.level2}`,
    };
  }

  function buildFooterStickyStyle() {
    return {
      backgroundColor: theme.colors.background,
      bottom: 0,
      position: 'sticky',
    } as const;
  }

  function buildFooterStyles() {
    return {
      borderTop: `1px solid ${theme.colors.line.level2}`,
    };
  }
}
