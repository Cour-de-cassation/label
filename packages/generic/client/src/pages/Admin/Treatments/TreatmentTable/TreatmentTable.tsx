import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType } from '@label/core';
import { Table, tableRowFieldType, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { wordings } from '../../../../wordings';

export { TreatmentTable };

function TreatmentTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatmentsWithDetails'>[number], string | number>>;
  treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>;
}) {
  const history = useHistory();

  const durations = props.treatmentsWithDetails.map(({ treatment }) => treatment.duration);
  const optionItems = buildOptionItems();
  return (
    <Table
      isHeaderSticky
      isFooterSticky
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
      fields={props.fields}
      data={props.treatmentsWithDetails}
      header={props.fields.map(({ id, title, canBeSorted }) => ({
        id,
        canBeSorted,
        text: title,
      }))}
      footer={[
        {
          id: 'title',
          content: (
            <>
              <Text variant="h3" color="textSecondary">
                {wordings.treatmentsPage.table.footer.total}
              </Text>
              <Text variant="h3">{wordings.treatmentsPage.table.footer.average}</Text>
            </>
          ),
        },
        {
          id: 'durations',
          content: (
            <>
              <Text variant="h3" color="textSecondary">
                {timeOperator.getReadableTotalDuration(durations)}
              </Text>
              <Text variant="h3">{timeOperator.getReadableAverageDuration(durations)}</Text>
            </>
          ),
        },
      ]}
      optionItems={optionItems}
    />
  );

  function buildOptionItems() {
    return [
      {
        text: wordings.treatmentsPage.table.optionItems.openDocument,
        onClick: (treatmentWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>[number]) => {
          history.push(`/admin/document/${treatmentWithDetails.treatment.documentId}`);
          return;
        },
      },
    ];
  }
}
