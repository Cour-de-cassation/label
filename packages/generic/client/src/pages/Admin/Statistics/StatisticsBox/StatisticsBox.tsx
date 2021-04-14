import React, { useState } from 'react';
import { timeOperator } from '@label/core';
import { Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { ComputationToggle, computationType } from './ComputationToggle';

export { StatisticsBox };

export type { aggregatedStatisticType };

const WIDTH = 350;
const ROW_HEIGHT = 30;

type aggregatedStatisticType = {
  addedAnnotationsCount: number;
  annotationsCount: number;
  deletedAnnotationsCount: number;
  linkedEntitiesCount: number;
  modifiedAnnotationsCount: number;
  resizedBiggerAnnotationsCount: number;
  resizedSmallerAnnotationsCount: number;
  treatmentDuration: number;
  wordsCount: number;
};

function StatisticsBox(props: { aggregatedStatistic: aggregatedStatisticType; statisticsCount: number }) {
  const [computation, setComputation] = useState<computationType>('average');
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const statisticsRows = buildStatisticRow();
  return (
    <div style={styles.container}>
      <ComputationToggle value={computation} onChange={setComputation} />
      <div style={styles.rowsContainer}>
        {statisticsRows.map((statisticRow) => (
          <div style={styles.rowContainer}>
            <Text>{statisticRow.label}</Text>
            <Text>{statisticRow.value}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  function buildStatisticRow() {
    const { aggregatedStatistic } = props;

    return [
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.wordsCount,
        value: getComputationValue(aggregatedStatistic.wordsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.annotationsCount,
        value: getComputationValue(aggregatedStatistic.annotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.linkedEntitiesCount,
        value: getComputationValue(aggregatedStatistic.linkedEntitiesCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.addedAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.addedAnnotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.resizedBiggerAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.resizedBiggerAnnotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.deletedAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.deletedAnnotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.resizedSmallerAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.resizedSmallerAnnotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.modifiedAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.modifiedAnnotationsCount),
      },
      {
        label: wordings.treatedDocumentsPage.table.statistics.fields.treatmentDuration,
        value: getReadableDuration(),
      },
    ];
  }

  function getReadableDuration() {
    return timeOperator.convertDurationToReadableDuration(
      getComputationDuration(props.aggregatedStatistic.treatmentDuration),
    );
  }

  function getComputationDuration(total: number) {
    switch (computation) {
      case 'average':
        return props.statisticsCount ? Math.floor(total / props.statisticsCount) : 0;
      case 'total':
        return total;
    }
  }

  function getComputationValue(total: number) {
    switch (computation) {
      case 'average':
        return props.statisticsCount ? (total / props.statisticsCount).toFixed(2) : 0;
      case 'total':
        return total;
    }
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        width: `${WIDTH}px`,
        borderRadius: theme.shape.borderRadius.s,
        padding: theme.spacing * 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.boxShadow.minor.out,
      },
      rowsContainer: {
        paddingTop: theme.spacing * 6,
        width: '100%',
      },
      rowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        height: ROW_HEIGHT,
        alignItems: 'center',
      },
    } as const;
  }
}
