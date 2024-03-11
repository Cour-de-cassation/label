import React, { useState } from 'react';
import { apiRouteOutType, ressourceFilterType, statisticType, userType } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { StatisticsBox } from './StatisticsBox';
import { DocumentStatisticsBox } from './StatisticsBox/DocumentStatisticsBox';
import { DocumentsTableHeaderStatistics } from '../../../components/business/DocumentsTableHeaderStatistics';

export { Statistics };

const WIDTH = 350;

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
    setSearchedDocumentNumber(searchedDocumentNumber)
    return searchedDocumentNumber;
  }
  // get documentStatistics
  const [documentStatistics, setdocumentStatistics] = useState<Array<any>>();
  const receivedocumentStatistics = (data: Array<any>) => {
    setdocumentStatistics(data);
  };

  const titleAlert = searchDocumentNumber != undefined ? <p> {wordings.statisticsPage.alertMessageStats} </p> : <p> </p>;
  return (
    <div>
      <div>
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
              <Text variant="h1">{wordings.statisticsPage.alertMessage}</Text>
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
                width={WIDTH}
              />
            </>
          )}
        </div>
        <hr style={styles.hrLine} />
        <div style={styles.row}>
          {
            documentStatistics?.length == 0 ? (
              <div style={styles.numberOfDecisionContainer}>
                <Text variant="h1">{wordings.statisticsPage.alertMessagePasStats}</Text>
              </div>
            ) : (
              <>
                <div style={styles.numberOfDecisionContainer}>
                  <Text variant="h1">{titleAlert}</Text>
                </div>
                <div style={styles.rowBox}>
                  {
                    documentStatistics?.map((val) => {
                      return (
                        <div>
                          <DocumentStatisticsBox documentStatistic={val} width={WIDTH} />
                        </div>
                      )
                    })
                  }
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
      height: "70%", // à changer et à tester pour le problème d'espace blanc dans statistique/ admin onglet
      //height: heights.statisticsBodyHeight,
      width: widths.adminContent,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      height: heights.statisticsBodyHeight, // à changer et à tester pour le problème d'espace blanc dans statistique/ admin onglet
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
      width: `${WIDTH}px`,
    },
    hrLine: {
      border: 'none',
      borderLeft: '1px solid hsla(200, 10%, 50%,100)',
      height: '70%',
      width: ' 1px'
    }
  } as const;
}
