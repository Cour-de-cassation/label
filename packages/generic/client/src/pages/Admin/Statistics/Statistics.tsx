import React from 'react';
import { apiRouteInType, apiRouteOutType, idModule, userType } from '@label/core';
import { StatisticsBox } from './StatisticsBox';
import { FilterButton } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';

export { Statistics };

function Statistics(props: {
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  users: Omit<userType, 'hashedPassword'>[];
  refetch: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
  ressourceFilter: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter'];
}) {
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
    const userName = props.ressourceFilter.userId && findUserNameByUserId(props.ressourceFilter.userId);
    const userFilter = {
      kind: 'dropdown' as const,
      name: 'user',
      label: wordings.statisticsPage.filter.fields.agents,
      possibleValues: props.users.map(({ name }) => name),
      value: userName,
      onChange: (userName: string) => {
        const userId = findUserIdByUserName(userName);
        if (!!userId) {
          props.refetch({ userId });
        }
      },
    };
    return [userFilter];
  }

  function findUserIdByUserName(userName: userType['name']) {
    const user = props.users.find(({ name }) => name === userName);
    if (user) {
      return user._id;
    }
  }

  function findUserNameByUserId(userId: userType['_id']) {
    const user = props.users.find(({ _id }) => idModule.lib.equalId(userId, _id));
    if (user) {
      return user.name;
    }
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
