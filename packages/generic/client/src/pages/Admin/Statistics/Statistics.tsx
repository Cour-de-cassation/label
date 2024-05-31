import React, { useState } from 'react';
import { apiRouteOutType, ressourceFilterType, userType } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { StatisticsBox } from './StatisticsBox';
import { DocumentStatisticsBox, documentStatsType } from './StatisticsBox/DocumentStatisticsBox';
import { DocumentsTableHeaderStatistics } from '../../../components/business/DocumentsTableHeaderStatistics';

export { Statistics };

const STATISTICS_BOX_WIDTH = 350;
const DOCUMENT_STATISTIC_BOX_WIDTH = 450;

function Statistics(props: {
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  users: Pick<userType, '_id' | 'name'>[];
  refetch: (ressourceFilter: ressourceFilterType) => void;
  isLoading: boolean;
  ressourceFilter: ressourceFilterType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const aggregatedStatistics = buildAggregatedStatistics();
  const [searchedDocumentNumber, setSearchedDocumentNumber] = useState<number | undefined>();
  const searchDocumentNumber = (searchedDocumentNumber: number | undefined) => {
    setSearchedDocumentNumber(searchedDocumentNumber);
    return searchedDocumentNumber;
  };
  const [documentStatistics, setdocumentStatistics] = useState<Array<documentStatsType>>();
  const receivedocumentStatistics = (data: Array<documentStatsType>) => {
    setdocumentStatistics(data);
  };

  const titleAlert =
    searchedDocumentNumber == undefined ? <p> {wordings.statisticsPage.specificStatisticsHintMessage} </p> : <p> </p>;
  return (
    <div>
      <div style={styles.table}>
        <DocumentsTableHeaderStatistics
          availableStatisticFilters={props.availableStatisticFilters}
          users={props.users}
          refetch={props.refetch}
          isLoading={props.isLoading}
          ressourceFilter={props.ressourceFilter}
          documentNumber={searchedDocumentNumber}
          setSearchedDocumentNumber={searchDocumentNumber}
          documentStatistics={receivedocumentStatistics}
        />
      </div>
      <div style={styles.body}>
        <div style={styles.row}>
          {props.aggregatedStatistics.total == -1 ? (
            <div style={styles.numberOfDecisionContainer}>
              <Text variant="h1">{wordings.statisticsPage.agregatedStatisticsHintMessage}</Text>
            </div>
          ) : (
            <>
              <div style={styles.numberOfDecisionContainer}>
                <Text variant="h1">{wordings.statisticsPage.treatedDecisions}</Text>
                <Text variant="h1">{props.aggregatedStatistics.total}</Text>
              </div>
              <StatisticsBox
                aggregatedStatistic={aggregatedStatistics}
                statisticsCount={props.aggregatedStatistics.total}
                width={STATISTICS_BOX_WIDTH}
              />
            </>
          )}
        </div>
        <hr style={styles.hrLine} />
        <div style={styles.row}>
          {documentStatistics?.length == 0 ? (
            <div style={styles.numberOfDecisionContainer}>
              <Text variant="h1">{wordings.statisticsPage.specificStatisticsNotFound}</Text>
            </div>
          ) : (
            <>
              <div style={styles.numberOfDecisionContainer}>
                <Text variant="h1">
                  <p>{titleAlert}</p>
                </Text>
              </div>
              <div style={styles.rowBox}>
                {documentStatistics?.map((documentStatistic) => {
                  return (
                    <div>
                      <DocumentStatisticsBox
                        documentStatistic={documentStatistic}
                        width={DOCUMENT_STATISTIC_BOX_WIDTH}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  function buildAggregatedStatistics() {
    return {
      annotationsCount: props.aggregatedStatistics.cumulatedValue.annotationsCount,
      surAnnotationsCount: props.aggregatedStatistics.cumulatedValue.surAnnotationsCount,
      subAnnotationsSensitiveCount: props.aggregatedStatistics.cumulatedValue.subAnnotationsSensitiveCount,
      subAnnotationsNonSensitiveCount: props.aggregatedStatistics.cumulatedValue.subAnnotationsNonSensitiveCount,
      treatmentDuration: props.aggregatedStatistics.cumulatedValue.treatmentDuration,
      wordsCount: props.aggregatedStatistics.cumulatedValue.wordsCount,
    };
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      height: heights.statisticsHeaderHeight,
      width: widths.adminContent,
    },
    filtersContainer: {
      paddingTop: theme.spacing * 2,
      paddingLeft: theme.spacing * 3,
    },
    body: {
      height: '70%',
      // height: heights.statisticsBodyHeight,
      width: widths.adminContent,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      height: heights.statisticsBodyHeight,
      width: widths.adminContent,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowBox: {
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      overflow: 'auto',
    },
    numberOfDecisionContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing * 3,
      width: `${STATISTICS_BOX_WIDTH}px`,
    },
    hrLine: {
      border: 'none',
      borderLeft: '1px solid hsla(200, 10%, 50%,100)',
      height: '70%',
      width: ' 1px',
    },
    table: {
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
