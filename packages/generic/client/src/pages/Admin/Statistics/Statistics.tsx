import React from 'react';
import { apiRouteOutType, ressourceFilterType, userType } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { StatisticsBox } from './StatisticsBox';
import { StatisticsFilterButton } from './StatisticsFilterButton';

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.filtersContainer}>
          <StatisticsFilterButton
            availableStatisticFilters={props.availableStatisticFilters}
            users={props.users}
            refetch={props.refetch}
            isLoading={props.isLoading}
            ressourceFilter={props.ressourceFilter}
          />
        </div>
      </div>
      <div style={styles.body}>
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
      paddingTop: theme.spacing * 4,
      paddingLeft: theme.spacing * 3,
    },
    body: {
      height: heights.statisticsBodyHeight,
      width: widths.adminContent,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberOfDecisionContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing * 3,
      width: `${WIDTH}px`,
    },
  } as const;
}
