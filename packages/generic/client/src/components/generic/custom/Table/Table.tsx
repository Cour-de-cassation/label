import React, { useState } from 'react';
import { sumBy } from 'lodash';
import { DEFAULT_ORDER_DIRECTION, TableHeader } from './TableHeader';
import { TableBody, tableRowFieldType } from './TableBody';
import { footerCellType, TableFooter } from './TableFooter';

export { Table };

export type { tableRowFieldType };

const OPTION_CELL_WIDTH = 40;

type orderDirectionType = 'asc' | 'desc';

function Table<InputT>(props: {
  defaultOrderByProperty?: string;
  defaultOrderDirection?: orderDirectionType;
  footer?: Array<footerCellType>;
  isFooterSticky?: boolean;
  isHeaderSticky?: boolean;
  data: InputT[];
  optionItems?: Array<{
    text: string;
    onClick: (data: InputT) => void;
  }>;
  pagination?: { start: number; end: number };
  fields: Array<tableRowFieldType<InputT>>;
}) {
  const [orderByProperty, setOrderByProperty] = useState<string | undefined>(props.defaultOrderByProperty);
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>(
    props.defaultOrderDirection || DEFAULT_ORDER_DIRECTION,
  );
  const tableStyle = buildTableStyle();
  const fieldCellStyles = buildFieldCellStyles();
  const optionCellStyle = props.optionItems ? buildOptionCellStyle() : undefined;
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
        isSticky={props.isHeaderSticky}
        optionCellStyle={optionCellStyle}
        orderByProperty={orderByProperty}
        orderDirection={orderDirection}
        setOrderByProperty={setOrderByProperty}
        setOrderDirection={setOrderDirection}
      />
    );
  }

  function renderBody() {
    return (
      <TableBody
        data={props.data}
        fields={props.fields}
        orderByProperty={orderByProperty}
        orderDirection={orderDirection}
        optionItems={props.optionItems}
        optionCellStyle={optionCellStyle}
        pagination={props.pagination}
      />
    );
  }

  function renderFooter() {
    if (!props.footer) {
      return;
    }
    return <TableFooter cells={props.footer} isSticky={props.isFooterSticky} />;
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
