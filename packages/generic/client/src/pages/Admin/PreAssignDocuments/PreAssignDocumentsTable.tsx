import React from 'react';
import { Table, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType, timeOperator } from '@label/core';
import { apiCaller } from '../../../api';
import { useAlert } from '../../../services/alert';
import { wordings } from '../../../wordings';

export { PreAssignDocumentsTable };

function PreAssignDocumentsTable(props: {
  refetch: () => void;
  preAssignations: apiRouteOutType<'get', 'preAssignations'>;
}) {
  const { displayAlert } = useAlert();

  const preAssignationFields = buildPreAssignationFields();

  return (
    <Table
      data={props.preAssignations}
      fields={preAssignationFields}
      buildOptionItems={buildOptionItems}
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
    />
  );

  function buildPreAssignationFields(): Array<tableRowFieldType<apiRouteOutType<'get', 'preAssignations'>[number]>> {
    return [
      {
        id: 'source',
        title: wordings.preAssignDocumentsPage.table.columnTitles.source,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.preAssignation.source,
        width: 10,
      },
      {
        id: 'number',
        title: wordings.preAssignDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.preAssignation.number,
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.preAssignDocumentsPage.table.columnTitles.agent,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.userName,
        width: 10,
      },
      {
        id: 'creationDate',
        title: wordings.preAssignDocumentsPage.table.columnTitles.creationDate,
        canBeSorted: true,
        extractor: (preAssignation) =>
          timeOperator.convertTimestampToReadableDate(preAssignation.preAssignation.creationDate),
        width: 10,
      },
    ];
  }

  function buildOptionItems(preAssignations: apiRouteOutType<'get', 'preAssignations'>[number]) {
    return [
      {
        kind: 'text' as const,
        text: wordings.preAssignDocumentsPage.table.optionItems.delete,
        onClick: async () => {
          try {
            await apiCaller.post<'deletePreAssignation'>('deletePreAssignation', {
              preAssignationId: preAssignations.preAssignation._id,
            });
          } catch (error) {
            displayAlert({
              text: wordings.business.errors.deletePreAssignationFailed,
              variant: 'alert',
              autoHide: true,
            });
            console.warn(error);
            return;
          }
          props.refetch();
        },
        iconName: 'delete' as const,
      },
    ];
  }
}
