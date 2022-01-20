import React, { useState } from 'react';
import { timeOperator } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { ComputationToggle, computationType } from './ComputationToggle';

export { StatisticsBox };

export type { aggregatedStatisticType };

const ROW_HEIGHT = 30;

type aggregatedStatisticType = {
  surAnnotationsCount: number;
  subAnnotationsSensitiveCount: number;
  subAnnotationsNonSensitiveCount: number;
  treatmentDuration: number;
  annotationsCount: number;
  wordsCount: number;
};

function StatisticsBox(props: {
  aggregatedStatistic: aggregatedStatisticType;
  statisticsCount: number;
  width: number;
}) {
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
        label: wordings.statisticsPage.box.fields.wordsCount,
        value: getComputationValue(aggregatedStatistic.wordsCount),
      },
      {
        label: wordings.statisticsPage.box.fields.annotationsCount,
        value: getComputationValue(aggregatedStatistic.annotationsCount),
      },
      {
        label: wordings.statisticsPage.box.fields.subAnnotationsSensitiveCount,
        value: getComputationValue(aggregatedStatistic.subAnnotationsSensitiveCount),
      },
      {
        label: wordings.statisticsPage.box.fields.subAnnotationsNonSensitiveCount,
        value: getComputationValue(aggregatedStatistic.subAnnotationsNonSensitiveCount),
      },
      {
        label: wordings.statisticsPage.box.fields.surAnnotationsCount,
        value: getComputationValue(aggregatedStatistic.surAnnotationsCount),
      },
      {
        label: wordings.statisticsPage.box.fields.treatmentDuration,
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
        width: `${props.width}px`,
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
