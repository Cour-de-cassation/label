import React from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { Table, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { wordings } from '../../../../wordings';

export { TreatmentTable };

type formattedTreatmentType = {
  _id: string;
  date: string;
  duration: string;
  userName: string;
};

function TreatmentTable(props: { treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'> }) {
  const formattedTreatments = formatTreatments(props.treatmentsWithDetails);
  const durations = props.treatmentsWithDetails.map(({ treatment }) => treatment.duration);
  return (
    <Table
      isHeaderSticky
      isFooterSticky
      data={formattedTreatments}
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
    />
  );
}

function formatTreatments(
  treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>,
): formattedTreatmentType[] {
  return treatmentsWithDetails.map((treatmentWithDetails) => ({
    _id: idModule.lib.convertToString(treatmentWithDetails.treatment._id),
    userName: treatmentWithDetails.userName,
    date: timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.date),
    duration: timeOperator.convertDurationToReadableDuration(treatmentWithDetails.treatment.duration),
  }));
}
