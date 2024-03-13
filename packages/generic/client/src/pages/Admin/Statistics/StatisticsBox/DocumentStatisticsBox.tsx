import React from 'react';
import { timeOperator } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { DocumentStatisticsBox };
type treatmentsSummaryType = {
  email: string;
  id: string;
  name: string;
  treatmentDuration: number;
};

type labelStat = {
  label: string;
  value: string[] | string | number | undefined;
};
export interface documentStatsType {
  NACCode: string;
  annotationsCount: number;
  appealNumber: string | undefined;
  chamberName: string | undefined;
  decisionDate: number | undefined;
  documentExternalId: string;
  documentNumber: number;
  endCaseCode: string | undefined;
  importer: ['recent', 'chained', 'filler', 'manual', 'default'];
  jurisdiction: string | undefined;
  linkedEntitiesCount: number;
  publicationCategory: Array<string>;
  route: string | undefined;
  session: string;
  source: string;
  subAnnotationsNonSensitiveCount: string;
  subAnnotationsSensitiveCount: string;
  surAnnotationsCount: string;
  treatmentDate: string;
  treatmentsSummary: Array<treatmentsSummaryType>;
  wordsCount: number;
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
    const ReadbleTreatmentDateTime = new Date(documentStatistic.treatmentDate);
    const ReadbleDateDecision = new Date(documentStatistic.decisionDate || '');

    return [
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
        label: wordings.statisticsPage.box.fields.decisionDate,
        value: timeOperator.convertTimestampToReadableDate(ReadbleDateDecision.getDate()),
      },
      {
        label: wordings.statisticsPage.box.fields.treatmentDate,
        value: timeOperator.convertTimestampToReadableDate(ReadbleTreatmentDateTime.getDate()),
      },
    ];
  }

  function buildAgentDurationRow(): Array<labelStat> {
    if (props.documentStatistic.treatmentsSummary != undefined) {
      const treatments = removeNull(props.documentStatistic.treatmentsSummary);

      const duration = treatments?.map((value: treatmentsSummaryType) => {
        return ' ' + timeOperator.convertDurationToReadableDuration(value.treatmentDuration) + ' ';
      });

      const agent = treatments?.map((value: treatmentsSummaryType) => {
        return ' ' + value.email + ' ';
      });

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
    } else {
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
  }

  function removeNull(arr: Array<treatmentsSummaryType>) {
    if (arr != undefined && arr.length != 0) {
      return arr.filter((val) => val != null);
    }
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        width: `700px`,
        borderRadius: theme.shape.borderRadius.s,
        padding: '10px',
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
