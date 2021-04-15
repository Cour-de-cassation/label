import React from 'react';
import { apiRouteOutType } from '@label/core';
import { StatisticsBox } from './StatisticsBox';
import { heights, widths } from '../../../styles';

export { Statistics };

function Statistics(props: { aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'> }) {
  const styles = buildStyles();

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

  return (
    <div style={styles.container}>
      <div style={styles.header}></div>
      <div style={styles.body}>
        <StatisticsBox
          aggregatedStatistic={aggregatedStatistics}
          statisticsCount={props.aggregatedStatistics.perAssignation.total}
        />
      </div>
    </div>
  );

  function buildStyles() {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
      },
      header: {
        height: heights.statisticsHeaderHeight,
        width: widths.adminContent,
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
}
