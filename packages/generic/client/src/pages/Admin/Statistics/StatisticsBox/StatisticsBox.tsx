import React, { useState } from 'react';
import { timeOperator } from '@label/core';
import { Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { ComputationToggle, computationType } from './ComputationToggle';

export { StatisticsBox };

export type { aggregatedStatisticType };

const HEIGHT = 75;

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
  const statisticsCells = buildStatisticsCells();
  return (
    <div style={styles.container}>
      <ComputationToggle value={computation} onChange={setComputation} />
      <table>
        <thead>
          <tr>
            {statisticsCells.map(({ title }) => (
              <td style={styles.cell}>
                <Text variant="h3">{title}</Text>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {statisticsCells.map(({ value }) => (
              <td style={styles.cell}>
                <Text>{value}</Text>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  function buildStatisticsCells() {
    const { aggregatedStatistic } = props;

    return [
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.surAnnotation,
        value: getComputationValue(aggregatedStatistic.deletedAnnotationsCount),
      },
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.resizeAnnotationSmaller,
        value: getComputationValue(aggregatedStatistic.resizedSmallerAnnotationsCount),
      },
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.subAnnotation,
        value: getComputationValue(aggregatedStatistic.addedAnnotationsCount),
      },
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.resizeAnnotationBigger,
        value: getComputationValue(aggregatedStatistic.resizedBiggerAnnotationsCount),
      },
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.changeAnnotation,
        value: getComputationValue(aggregatedStatistic.modifiedAnnotationsCount),
      },
      {
        title: wordings.treatedDocumentsPage.table.statistics.fields.duration,
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
        height: `${HEIGHT}px`,
        borderRadius: theme.shape.borderRadius.s,
        paddingRight: theme.spacing * 3,
        paddingLeft: theme.spacing * 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.boxShadow.minor.out,
        flex: 1,
      },
      cell: {
        paddingRight: theme.spacing * 2,
        paddingLeft: theme.spacing * 2,
      },
    };
  }
}
