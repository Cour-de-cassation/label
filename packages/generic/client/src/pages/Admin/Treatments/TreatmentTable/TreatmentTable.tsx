import React from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType, idModule, treatmentModule } from '@label/core';
import { Table, tableRowFieldType, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { wordings } from '../../../../wordings';

export { TreatmentTable };

function TreatmentTable(props: { treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'> }) {
  const history = useHistory();

  const durations = props.treatmentsWithDetails.map(({ treatment }) => treatment.duration);
  const treatmentsFields = buildTreatmentFields();
  const optionItems = buildOptionItems();
  return (
    <Table
      isHeaderSticky
      isFooterSticky
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
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

  function buildTreatmentFields() {
    const treatmentsInfo = treatmentModule.lib.computeTreatmentsInfo(
      props.treatmentsWithDetails.map(({ treatment }) => treatment),
    );

    const treatmentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatmentsWithDetails'>[number]>> = [
      {
        id: 'documentId',
        title: wordings.treatmentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (treatmentWithDetails) => JSON.stringify(treatmentWithDetails.documentId),
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.treatmentsPage.table.columnTitles.agent,
        canBeSorted: true,
        extractor: (treatmentWithDetails) => treatmentWithDetails.userName,
        width: 10,
      },
      {
        id: 'date',
        title: wordings.treatmentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.lastUpdateDate),
        width: 10,
      },
      {
        id: 'deletions',
        title: wordings.treatmentsPage.table.columnTitles.surAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].deletionsCount,
        width: 3,
      },
      {
        id: 'additions',
        title: wordings.treatmentsPage.table.columnTitles.subAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].additionsCount,
        width: 3,
      },
      {
        id: 'modifications',
        title: wordings.treatmentsPage.table.columnTitles.changeAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].modificationsCount,
        width: 3,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatmentsPage.table.columnTitles.duration,
        extractor: (treatmentWithDetails) =>
          timeOperator.convertDurationToReadableDuration(treatmentWithDetails.treatment.duration),
        width: 3,
      },
    ];
    return treatmentsFields;
  }

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
