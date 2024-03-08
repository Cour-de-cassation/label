import React, { useState } from 'react';
import { timeOperator, statisticType, idType } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';


export { DocumentStatisticsBox };
type treatmentsSummaryType = {
  value: {
    email: string,
    id: string,
    name: string,
  },
  treatmentDuration: number
};

interface statsType {
  NACCode: string,
  annotationsCount: number,
  appealNumber: string | undefined,
  chamberName: string | undefined,
  decisionDate: number | undefined,
  documentExternalId: string,
  documentNumber: number,
  endCaseCode: string | undefined,
  importer: ['recent', 'chained', 'filler', 'manual', 'default'],
  jurisdiction: string | undefined,
  linkedEntitiesCount: number,
  publicationCategory: Array<string>,
  route: string | undefined,
  session: string,
  source: string,
  subAnnotationsNonSensitiveCount: string,
  subAnnotationsSensitiveCount: string,
  surAnnotationsCount: string,
  treatmentDate: string,
  treatmentsSummary: Array<treatmentsSummaryType>,
  wordsCount: number,
  _id: string,
}

const ROW_HEIGHT = 25;


function DocumentStatisticsBox(props: {
  documentStatistic: statsType;
  width: number;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const DocumentStatisticsRows = buildDocumentStatisticRow();
  return (
    <div style={styles.container}>
      <div style={styles.rowsContainer}>
        {DocumentStatisticsRows.map((documentStatisticsRows) => (
          <div style={styles.rowContainer}>
            <Text weight='normal' >{documentStatisticsRows.label} </Text>
            <Text weight='normal' color="textPrimary" >{documentStatisticsRows.value}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  function buildDocumentStatisticRow() {
    const { documentStatistic } = props;

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
        label: wordings.statisticsPage.box.fields.agent,
        value: getUser() + " " + getReadableDuration(),
      },
    ];
  }

  function getReadableDuration() {
    return props.documentStatistic.treatmentsSummary.map((val) => {
      return timeOperator.convertDurationToReadableDuration(
        val?.treatmentDuration,
      );
    })
  }

  function getUser() {
    console.log('treatmenntnn', props.documentStatistic.treatmentsSummary)
    return props.documentStatistic.treatmentsSummary.map(({ value }) => value?.email)
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
        marginBottum: '100px',
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
    } as const;
  }
}
