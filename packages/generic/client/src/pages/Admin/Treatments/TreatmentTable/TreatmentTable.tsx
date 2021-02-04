import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType, idModule } from '@label/core';
import { Table, Text } from '../../../../components';
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
      dataFormatter={treatmentFormatter}
      data={props.treatmentsWithDetails}
      header={[
        {
          id: '_id',
          content: <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.number}</Text>,
          canBeSorted: true,
        },
        {
          id: 'userName',
          content: <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.agent}</Text>,
          canBeSorted: true,
        },
        {
          id: 'date',
          content: <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.date}</Text>,
          canBeSorted: true,
        },
        {
          id: 'duration',
          content: <Text variant="h3">{wordings.treatmentsPage.table.columnTitles.duration}</Text>,
          canBeSorted: true,
        },
      ]}
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

function treatmentFormatter(treatmentWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>[0]) {
  return {
    _id: idModule.lib.convertToString(treatmentWithDetails.treatment._id),
    userName: treatmentWithDetails.userName,
    date: timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.lastUpdateDate),
    duration: timeOperator.convertDurationToReadableDuration(treatmentWithDetails.treatment.duration),
  };
}
