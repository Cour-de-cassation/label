import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { Text } from '../../materialUI';
import { OptionButton } from './OptionButton';
import { orderDirectionType } from './TableHeader';

export { TableBody };

export type { tableRowFieldType };

type tableRowFieldType<InputT> = {
  id: string;
  title: string;
  tooltipText?: string;
  canBeSorted: boolean;
  extractor: (data: InputT) => string | number;
  getSortingValue?: (data: InputT) => number;
  render?: (data: InputT) => JSX.Element;
  width: number;
};

const ROW_DEFAULT_HEIGHT = 50;

function TableBody<InputT>(props: {
  data: InputT[];
  fields: Array<tableRowFieldType<InputT>>;
  isRowHighlighted?: (row: InputT) => boolean;
  onRowClick?: (row: InputT) => void;
  optionCellStyle?: CSSProperties;
  optionItems?: Array<{
    text: string;
    onClick: (data: InputT) => void;
  }>;
  orderByProperty: string | undefined;
  orderDirection: orderDirectionType;
  pagination?: { start: number; end: number };
}) {
  const theme = useCustomTheme();
  const sortedData = paginateData(sortData(props.data));

  const { Tr } = buildStyledComponents();

  return <tbody>{sortedData.map(renderRow)}</tbody>;

  function renderRow(row: InputT) {
    const styleProps = {
      theme,
      hasOnClick: !!props.onRowClick,
    };
    const cellTextStyle =
      props.isRowHighlighted && props.isRowHighlighted(row) ? ({ fontWeight: 'bold' } as const) : undefined;
    const formattedRow = props.fields.map((field) =>
      field.render ? field.render(row) : <Text variant="h3">{field.extractor(row)}</Text>,
    );
    const { onRowClick, optionItems } = props;

    if (!optionItems) {
      return (
        <Tr onClick={!!onRowClick ? () => onRowClick(row) : undefined} styleProps={styleProps}>
          {formattedRow.map((cellContent) => (
            <td>
              <Text style={cellTextStyle} variant="h3">
                {cellContent}
              </Text>
            </td>
          ))}
          <td style={props.optionCellStyle} />
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
        <Tr onClick={!!onRowClick ? () => onRowClick(row) : undefined} styleProps={styleProps}>
          {Object.values(formattedRow).map((value) => (
            <td>
              <Text style={cellTextStyle} variant="h3">
                {value}
              </Text>
            </td>
          ))}
          <td className="optionItemCell" style={props.optionCellStyle}>
            <div>
              <OptionButton items={items} onSelect={onSelect} />
            </div>
          </td>
        </Tr>
      </>
    );
  }

  function paginateData(data: InputT[]): InputT[] {
    if (!props.pagination) {
      return data;
    }

    return data.slice(props.pagination.start, props.pagination.end);
  }

  function sortData(data: InputT[]): InputT[] {
    const orderByField = props.fields.find((field) => field.id === props.orderByProperty);
    if (!orderByField) {
      return data;
    }
    return data.sort((dataA, dataB) => {
      const propertyA = orderByField.getSortingValue
        ? orderByField.getSortingValue(dataA)
        : orderByField.extractor(dataA);
      const propertyB = orderByField.getSortingValue
        ? orderByField.getSortingValue(dataB)
        : orderByField.extractor(dataB);
      if (propertyA === propertyB) {
        return 0;
      } else if (propertyA < propertyB) {
        return props.orderDirection === 'asc' ? 1 : -1;
      } else {
        return props.orderDirection === 'asc' ? -1 : 1;
      }
    });
  }

  function buildStyledComponents() {
    type stylePropsType = {
      styleProps: {
        theme: customThemeType;
        hasOnClick?: boolean;
      };
    };

    const Tr = styled.tr<stylePropsType>`
      ${({ styleProps }) => {
        return `
          cursor: ${styleProps.hasOnClick ? 'pointer' : 'default'};
          height: ${ROW_DEFAULT_HEIGHT}px;
          &:hover {
            background-color: ${styleProps.theme.colors.default.background};
          }
          td.optionItemCell > div  {
            display: none;
          }
          &:hover > td.optionItemCell > div  {
            display: block;
          }
      `;
      }}
    `;

    return {
      Tr,
    };
  }
}
