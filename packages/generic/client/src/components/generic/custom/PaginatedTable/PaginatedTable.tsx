import React, { useState } from 'react';
import { optionItemType, Table, tableRowFieldType } from '../Table';
import { footerCellType } from '../Table/TableFooter';
import { orderDirectionType } from '../Table/TableHeader';
import { computeNumberOfPages, computePagination } from './lib';
import { PaginationFooter } from './PaginationFooter';

const ROWS_PER_PAGE = 20;

export { PaginatedTable };

function PaginatedTable<InputT, orderByPropertyT extends string = string>(props: {
  defaultOrderByProperty?: orderByPropertyT;
  defaultOrderDirection?: orderDirectionType;
  footer?: Array<footerCellType>;
  data: InputT[];
  onOrderByPropertyChange?: (newOrderByProperty: orderByPropertyT) => void;
  onOrderDirectionChange?: (newOrderDirection: orderDirectionType) => void;
  buildOptionItems?: (data: InputT) => Array<optionItemType>;
  fields: Array<tableRowFieldType<InputT, orderByPropertyT>>;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const numberOfPages = computeNumberOfPages(props.data.length, ROWS_PER_PAGE);
  const pagination = computePagination(ROWS_PER_PAGE, currentPage);

  return (
    <>
      <Table
        data={props.data}
        defaultOrderByProperty={props.defaultOrderByProperty}
        defaultOrderDirection={props.defaultOrderDirection}
        fields={props.fields}
        onOrderByPropertyChange={props.onOrderByPropertyChange}
        onOrderDirectionChange={props.onOrderDirectionChange}
        buildOptionItems={props.buildOptionItems}
        pagination={pagination}
      />
      <PaginationFooter numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
}
