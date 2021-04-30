import React, { CSSProperties } from 'react';
import { optionItemType } from './Table';
import { orderDirectionType } from './TableHeader';
import { TableRow } from './TableRow';

export { TableBody };

export type { tableRowFieldType };

type tableRowFieldType<InputT, orderByPropertyT = string> = {
  id: orderByPropertyT;
  title: string;
  tooltipText?: string;
  canBeSorted: boolean;
  extractor: (data: InputT) => string | number;
  getSortingValue?: (data: InputT) => number;
  render?: (data: InputT) => JSX.Element;
  width: number;
};

function TableBody<InputT, orderByPropertyT extends string = string>(props: {
  data: InputT[];
  fields: Array<tableRowFieldType<InputT, orderByPropertyT>>;
  isRowHighlighted?: (row: InputT) => boolean;
  onRowClick?: (row: InputT) => void;
  optionCellStyle?: CSSProperties;
  buildOptionItems?: (data: InputT) => Array<optionItemType>;
  orderByProperty: string | undefined;
  orderDirection: orderDirectionType;
  pagination?: { start: number; end: number };
}) {
  const sortedData = paginateData(sortData(props.data));
  const { onRowClick } = props;
  return (
    <tbody>
      {sortedData.map((row) => (
        <TableRow
          fields={props.fields}
          isHighlighted={!!props.isRowHighlighted && props.isRowHighlighted(row)}
          onRowClick={onRowClick ? () => onRowClick(row) : undefined}
          optionCellStyle={props.optionCellStyle}
          buildOptionItems={props.buildOptionItems}
          row={row}
        />
      ))}
    </tbody>
  );

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
        return props.orderDirection === 'asc' ? -1 : 1;
      } else {
        return props.orderDirection === 'asc' ? 1 : -1;
      }
    });
  }
}
