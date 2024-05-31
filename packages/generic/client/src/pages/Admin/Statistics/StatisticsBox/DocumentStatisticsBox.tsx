import React from 'react';
import { timeOperator } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { statisticType } from '@label/core';
import { wordings } from '../../../../wordings';

export { DocumentStatisticsBox };

type treatmentsSummaryType = {
  email: string;
  id: string;
  name: string;
  statId: string;
  treatmentDuration: number;
};

type labelStat = {
  label: string;
  value: string[] | string | number | undefined;
};

export interface documentStatsType extends Omit<statisticType, '_id' | 'treatmentsSummary'> {
  treatmentsSummary: Array<treatmentsSummaryType>;
  _id: string;
}

const ROW_HEIGHT = 25;

function DocumentStatisticsBox(props: { documentStatistic: documentStatsType; width: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const DocumentStatisticsRows = buildDocumentStatisticRow();
  const DocumentAgentRows = buildAgentDurationRow();
  return (
    <div style={styles.container}>
      <div style={styles.rowsContainer}>
        <div>
          {DocumentStatisticsRows.map((documentStatisticsRows) => (
            <div style={styles.rowContainer}>
              <Text weight="normal">{documentStatisticsRows.label} </Text>
              <Text weight="normal" color="textPrimary">
                {documentStatisticsRows.value}
              </Text>
            </div>
          ))}
        </div>
        <div>
          {DocumentAgentRows.map((documentAgentRow) => (
            <div style={styles.rowAgentContainer}>
              <div>
                {' '}
                <Text weight="normal"> {documentAgentRow.label} </Text>{' '}
              </div>
              <div>
                {' '}
                <Text weight="normal" color="textPrimary">
                  {documentAgentRow.value}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function buildDocumentStatisticRow() {
    const { documentStatistic } = props;
    const result = [
      {
        label: wordings.statisticsPage.box.fields.wordsCount,
        value: documentStatistic.wordsCount,
      },
      {
        label: wordings.statisticsPage.box.fields.annotationsCount,
        value: documentStatistic.annotationsCount,
      },
      {
        label: wordings.statisticsPage.box.fields.subAnnotationsSensitiveCount,
        value: documentStatistic.subAnnotationsSensitiveCount,
      },
      {
        label: wordings.statisticsPage.box.fields.subAnnotationsNonSensitiveCount,
        value: documentStatistic.subAnnotationsNonSensitiveCount,
      },
      {
        label: wordings.statisticsPage.box.fields.surAnnotationsCount,
        value: documentStatistic.surAnnotationsCount,
      },
      {
        label: wordings.statisticsPage.box.fields.documentNumber,
        value: documentStatistic.documentNumber,
      },
      {
        label: wordings.statisticsPage.box.fields.endCaseCode,
        value: documentStatistic.endCaseCode,
      },
      {
        label: wordings.statisticsPage.box.fields.NACCode,
        value: documentStatistic.NACCode,
      },
      {
        label: wordings.statisticsPage.box.fields.chamberName,
        value: documentStatistic.chamberName,
      },
      {
        label: wordings.statisticsPage.box.fields.circuit,
        value: documentStatistic.route,
      },
      {
        label: wordings.statisticsPage.box.fields.importer,
        value: documentStatistic.importer,
      },
      {
        label: wordings.statisticsPage.box.fields.juridiction,
        value: documentStatistic.jurisdiction,
      },
      {
        label: wordings.statisticsPage.box.fields.decisionDate,
        value: timeOperator.convertTimestampToReadableDate(documentStatistic.decisionDate ?? 0),
      },
      {
        label: wordings.statisticsPage.box.fields.treatmentDate,
        value: timeOperator.convertTimestampToReadableDate(documentStatistic.treatmentDate),
      },
    ];
    return result.filter((row) => row.value !== undefined && row.value !== null && row.value !== '');
  }

  function buildAgentDurationRow(): Array<labelStat> {
    const { treatmentsSummary } = props.documentStatistic;

    if (!treatmentsSummary || !treatmentsSummary.length) {
      return [
        {
          label: wordings.statisticsPage.box.fields.agent,
          value: 'N/A',
        },
        {
          label: wordings.statisticsPage.box.fields.treatmentDuration,
          value: 'N/A',
        },
      ];
    }
    const uniqueTreatments = removeNullAndDuplicatesTreatments(treatmentsSummary);
    const duration = uniqueTreatments
      .map((treatment) => timeOperator.convertDurationToReadableDuration(treatment.treatmentDuration))
      .join(', ');

    const agent = uniqueTreatments.map((treatment) => treatment.name).join(', ');

    return [
      {
        label: wordings.statisticsPage.box.fields.agent,
        value: agent,
      },
      {
        label: wordings.statisticsPage.box.fields.treatmentDuration,
        value: duration,
      },
    ];
  }

  function removeNullAndDuplicatesTreatments(
    treatmentsSummaries: Array<treatmentsSummaryType>,
  ): Array<treatmentsSummaryType> {
    const filteredArray = treatmentsSummaries.filter((treatmentsSummary) => treatmentsSummary !== null);
    const uniqueArray = filteredArray.filter(
      (item, index, self) => index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(item)),
    );
    return uniqueArray;
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        width: `${props.width}px`,
        borderRadius: theme.shape.borderRadius.s,
        padding: theme.spacing * 4,
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.boxShadow.minor.out,
      },
      rowsContainer: {
        paddingTop: theme.spacing * 1,
        width: '90%',
      },
      rowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        height: ROW_HEIGHT,
        alignItems: 'right',
      },
      rowAgentContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: ROW_HEIGHT,
        alignItems: 'right',
      },
    } as const;
  }
}
