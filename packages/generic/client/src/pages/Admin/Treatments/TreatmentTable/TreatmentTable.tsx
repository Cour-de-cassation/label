import React from 'react';
import { fetchedTreatmentType } from '@label/core';
import { Table, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { timeOperator } from './utils';

export { TreatmentTable };

type formattedTreatmentType = {
  _id: string;
  duration: string;
};

function TreatmentTable(props: { treatments: fetchedTreatmentType[] }) {
  const formattedTreatments = formatTreatments(props.treatments);
  const durations = props.treatments.map(({ duration }) => duration);
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

function formatTreatments(treatments: fetchedTreatmentType[]): formattedTreatmentType[] {
  return treatments.map((treatment) => ({
    _id: `${treatment._id}`,
    duration: timeOperator.convertDurationToReadableDuration(treatment.duration),
  }));
}
