import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType, idModule } from '@label/core';
import { Table, tableRowFieldType, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { wordings } from '../../../../wordings';

export { TreatmentTable };

function TreatmentTable(props: { treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'> }) {
  const history = useHistory();

  const durations = props.treatmentsWithDetails.map(({ treatment }) => treatment.duration);
  const optionItems = buildOptionItems();
  return (
    <Table
      isHeaderSticky
      isFooterSticky
      fields={treatmentsFields}
      data={props.treatmentsWithDetails}
      header={treatmentsFields.map(({ id, title, canBeSorted }) => ({
        id,
        canBeSorted,
        content: <Text variant="h3">{title}</Text>,
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

const treatmentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatmentsWithDetails'>[number]>> = [
  {
    id: '_id',
    title: wordings.treatmentsPage.table.columnTitles.number,
    canBeSorted: true,
    extractor: (treatmentWithDetails) => idModule.lib.convertToString(treatmentWithDetails.treatment._id),
  },
  {
    id: 'userName',
    title: wordings.treatmentsPage.table.columnTitles.agent,
    canBeSorted: true,
    extractor: (treatmentWithDetails) => treatmentWithDetails.userName,
  },
  {
    id: 'date',
    title: wordings.treatmentsPage.table.columnTitles.date,
    canBeSorted: true,
    extractor: (treatmentWithDetails) =>
      timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.lastUpdateDate),
  },
  {
    id: 'duration',
    canBeSorted: true,
    title: wordings.treatmentsPage.table.columnTitles.duration,
    extractor: (treatmentWithDetails) =>
      timeOperator.convertDurationToReadableDuration(treatmentWithDetails.treatment.duration),
  },
];
