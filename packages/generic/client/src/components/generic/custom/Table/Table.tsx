import React, { useState } from 'react';
import { sumBy } from 'lodash';
import { iconNameType } from '../../materialUI';
import { DEFAULT_ORDER_DIRECTION, TableHeader } from './TableHeader';
import { TableBody, tableRowFieldType } from './TableBody';
import { footerCellType, TableFooter } from './TableFooter';

export { Table };

export type { optionItemType, tableRowFieldType };

const OPTION_CELL_WIDTH = 40;

type orderDirectionType = 'asc' | 'desc';

type optionItemType = {
  text: string;
  onClick: () => void;
  iconName?: iconNameType;
};

function Table<InputT, orderByPropertyT extends string = string>(props: {
  defaultOrderByProperty?: orderByPropertyT;
  defaultOrderDirection?: orderDirectionType;
  footer?: Array<footerCellType>;
  isRowHighlighted?: (row: InputT) => boolean;
  isRowMinored?: (row: InputT) => boolean;
  data: InputT[];
  buildOptionItems?: (data: InputT) => Array<optionItemType>;
  onOrderByPropertyChange?: (newOrderByProperty: orderByPropertyT) => void;
  onOrderDirectionChange?: (newOrderDirection: orderDirectionType) => void;
  onRowClick?: (row: InputT) => void;
  pagination?: { start: number; end: number };
  fields: Array<tableRowFieldType<InputT, orderByPropertyT>>;
}) {
  const [orderByProperty, setOrderByProperty] = useState<orderByPropertyT | undefined>(props.defaultOrderByProperty);
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>(
    props.defaultOrderDirection || DEFAULT_ORDER_DIRECTION,
  );
  const tableStyle = buildTableStyle();
  const fieldCellStyles = buildFieldCellStyles();
  const optionCellStyle = props.buildOptionItems ? buildOptionCellStyle() : undefined;
  return (
    <table style={tableStyle}>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </table>
  );

  function renderHeader() {
    return (
      <TableHeader
        cells={props.fields.map(({ id, title, canBeSorted, tooltipText }) => ({
          id,
          canBeSorted,
          title,
          tooltipText,
        }))}
        fieldCellStyles={fieldCellStyles}
        optionCellStyle={optionCellStyle}
        orderByProperty={orderByProperty}
        orderDirection={orderDirection}
        setOrderByProperty={onOrderByPropertyChange}
        setOrderDirection={onOrderDirectionChange}
      />
    );
  }

  function onOrderByPropertyChange(newOrderByProperty: orderByPropertyT) {
    setOrderByProperty(newOrderByProperty);
    props.onOrderByPropertyChange && props.onOrderByPropertyChange(newOrderByProperty);
  }

  function onOrderDirectionChange(newOrderDirection: orderDirectionType) {
    setOrderDirection(newOrderDirection);
    props.onOrderDirectionChange && props.onOrderDirectionChange(newOrderDirection);
  }

  function renderBody() {
    return (
      <TableBody
        data={props.data}
        fields={props.fields}
        isRowHighlighted={props.isRowHighlighted}
        isRowMinored={props.isRowMinored}
        orderByProperty={orderByProperty}
        orderDirection={orderDirection}
        buildOptionItems={props.buildOptionItems}
        optionCellStyle={optionCellStyle}
        pagination={props.pagination}
        onRowClick={props.onRowClick}
      />
    );
  }

  function renderFooter() {
    if (!props.footer) {
      return;
    }
    return <TableFooter cells={props.footer} />;
  }

  function buildFieldCellStyles() {
    const totalWidths = sumBy(props.fields, (field) => field.width);
    const styles = props.fields.reduce((accumulator, field) => {
      return {
        ...accumulator,
        [field.id]: {
          width: `${(field.width / totalWidths) * 100}%`,
        },
      };
    }, {} as Record<string, { width: string }>);
    return styles;
  }

  function buildTableStyle() {
    return {
      borderCollapse: 'collapse',
      width: '100%',
    } as const;
  }

  function buildOptionCellStyle() {
    return {
      display: 'block',
      width: OPTION_CELL_WIDTH,
    } as const;
  }
}
