import React, { useState } from 'react';
import { Table, tableRowFieldType } from '../Table';
import { footerCellType } from '../Table/TableFooter';
import { orderDirectionType } from '../Table/TableHeader';
import { computeNumberOfPages, computePagination } from './lib';
import { PaginationFooter } from './PaginationFooter';

const ROWS_PER_PAGE = 20;

export { PaginatedTable };

function PaginatedTable<InputT>(props: {
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
  fields: Array<tableRowFieldType<InputT>>;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const numberOfPages = computeNumberOfPages(props.data.length, ROWS_PER_PAGE);
  const pagination = computePagination(ROWS_PER_PAGE, currentPage);

  return (
    <>
      <Table
        isHeaderSticky
        defaultOrderByProperty={props.defaultOrderByProperty}
        defaultOrderDirection={props.defaultOrderDirection}
        fields={props.fields}
        pagination={pagination}
        data={props.data}
        optionItems={props.optionItems}
      />
      <PaginationFooter numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
}
