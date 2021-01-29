import React, { ReactElement, useState } from 'react';
import { get } from 'lodash';
import styled from 'styled-components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { TableSortLabel, Text } from '../../materialUI';
import { OptionButton } from './OptionButton';

export { Table };

const DEFAULT_ORDER_DIRECTION = 'asc';

const ROW_DEFAULT_HEIGHT = 40;

type orderByPropertyType<FormattedDataT> = keyof FormattedDataT;

type orderDirectionType = 'asc' | 'desc';

function Table<DataT, FormattedDataT extends { _id: string }>(props: {
  footer?: Array<{
    id: string;
    content: ReactElement;
  }>;
  header?: Array<{
    id: keyof FormattedDataT;
    content: ReactElement;
    canBeSorted?: boolean;
  }>;
  isFooterSticky?: boolean;
  isHeaderSticky?: boolean;
  data: DataT[];
  dataFormatter: (data: DataT) => FormattedDataT;
  optionItems?: Array<{
    text: string;
    onClick: (data: DataT) => void;
  }>;
}) {
  const theme = useCustomTheme();
  const [orderByProperty, setOrderByProperty] = useState<orderByPropertyType<FormattedDataT> | undefined>();
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

    return <tbody>{sortedData.map((row) => renderRow(row))}</tbody>;

    function renderRow(row: DataT) {
      const formattedRow = props.dataFormatter(row);
      const { optionItems } = props;
      if (!optionItems) {
        return (
          <Tr styleProps={styleProps}>
            {Object.values(formattedRow).map((value) => (
              <td>
                <Text variant="h3">{value}</Text>
              </td>
            ))}
          </Tr>
        );
      }

      const items = optionItems.map((optionItem) => ({
        text: optionItem.text,
        value: optionItem.text,
      }));
      const onSelect = (optionItemText: string) => {
        const optionItem = optionItems.find(({ text }) => text === optionItemText);
        optionItem && optionItem.onClick(row);
      };

      return (
        <>
          <Div_OptionButtonContainer styleProps={styleProps}>
            <OptionButton items={items} onSelect={onSelect} />
          </Div_OptionButtonContainer>
          <Tr styleProps={styleProps}>
            {Object.values(formattedRow).map((value) => (
              <td>
                <Text variant="h3">{value}</Text>
              </td>
            ))}
          </Tr>
        </>
      );
    }
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

  function sortData(data: DataT[]): DataT[] {
    if (!orderByProperty) {
      return data;
    }
    return data.sort((dataA, dataB) => {
      const formattedDataA = props.dataFormatter(dataA);
      const formattedDataB = props.dataFormatter(dataB);
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      const propertyA = get(formattedDataA, orderByProperty);
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      const propertyB = get(formattedDataB, orderByProperty);
      if (propertyA === propertyB) {
        return 0;
      } else if (propertyA < propertyB) {
        return orderDirection === 'asc' ? 1 : -1;
      } else {
        return orderDirection === 'asc' ? -1 : 1;
      }
    });
  }

  function onOrderByPropertyClickBuilder(newOrderByProperty: orderByPropertyType<FormattedDataT>) {
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
          }
      `;
      }}
    `;

    const Div_OptionButtonContainer = styled.div<stylePropsType>`
      right: 0;
      z-index: 10;
      position: absolute;
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
