import React, { useState } from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { StatisticsBox } from './StatisticsBox';
import { FilterButton } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';

export { Statistics };

type statisticFilterType = {
  userName: string | undefined;
};

const INITIAL_FILTER_VALUES = { userName: undefined };

function Statistics(props: {
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  users: Omit<userType, 'hashedPassword'>[];
  refetch: (params: { userId: userType['_id'] }) => void;
}) {
  const [filterValues, setFilterValues] = useState<statisticFilterType>(INITIAL_FILTER_VALUES);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const aggregatedStatistics = {
    addedAnnotationsCount: props.aggregatedStatistics.perAssignation.cumulatedValue.addedAnnotationsCount,
    annotationsCount: props.aggregatedStatistics.perDocument.cumulatedValue.annotationsCount,
    deletedAnnotationsCount: props.aggregatedStatistics.perAssignation.cumulatedValue.deletedAnnotationsCount,
    linkedEntitiesCount: props.aggregatedStatistics.perAssignation.cumulatedValue.linkedEntitiesCount,
    modifiedAnnotationsCount: props.aggregatedStatistics.perAssignation.cumulatedValue.modifiedAnnotationsCount,
    resizedBiggerAnnotationsCount:
      props.aggregatedStatistics.perAssignation.cumulatedValue.resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount:
      props.aggregatedStatistics.perAssignation.cumulatedValue.resizedSmallerAnnotationsCount,
    treatmentDuration: props.aggregatedStatistics.perAssignation.cumulatedValue.treatmentDuration,
    wordsCount: props.aggregatedStatistics.perDocument.cumulatedValue.wordsCount,
  };

  const filters = buildFilters();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.filtersContainer}>
          <FilterButton filters={filters} />
        </div>
      </div>
      <div style={styles.body}>
        <StatisticsBox
          aggregatedStatistic={aggregatedStatistics}
          statisticsCount={props.aggregatedStatistics.perAssignation.total}
        />
      </div>
    </div>
  );

  function buildFilters() {
    const userFilter = {
      kind: 'dropdown' as const,
      name: 'user',
      label: wordings.statisticsPage.filter.fields.agents,
      possibleValues: props.users.map(({ name }) => name),
      value: filterValues.userName,
      onChange: (userName: string) => {
        setFilterValues({ userName });
        const user = props.users.find(({ name }) => name === userName);
        if (!!user) {
          props.refetch({ userId: user._id });
        }
      },
    };
    return [userFilter];
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
      justifyContent: 'center',
      alignItems: 'center',
    },
  } as const;
}
