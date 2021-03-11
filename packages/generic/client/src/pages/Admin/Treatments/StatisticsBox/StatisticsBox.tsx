import React, { useState } from 'react';
import { sumBy } from 'lodash';
import { apiRouteOutType, treatmentModule } from '@label/core';
import { Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { ComputationToggle, computationType } from './ComputationToggle';

export { StatisticsBox };

const HEIGHT = 75;

function StatisticsBox(props: { treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'> }) {
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
    const annotationStatistics = Object.values(
      treatmentModule.lib.computeTreatmentsInfo(props.treatmentsWithDetails.map(({ treatment }) => treatment)),
    );

    return [
      {
        title: wordings.treatmentsPage.table.statistics.fields.surAnnotation,
        value: getComputationValue(sumBy(annotationStatistics, ({ deletionsCount }) => deletionsCount)),
      },
      {
        title: wordings.treatmentsPage.table.statistics.fields.subAnnotation,
        value: getComputationValue(sumBy(annotationStatistics, ({ additionsCount }) => additionsCount)),
      },
      {
        title: wordings.treatmentsPage.table.statistics.fields.changeAnnotation,
        value: getComputationValue(sumBy(annotationStatistics, ({ modificationsCount }) => modificationsCount)),
      },
      {
        title: wordings.treatmentsPage.table.statistics.fields.duration,
        value: getReadableDuration(),
      },
    ];
  }

  function getReadableDuration() {
    const totalDuration = sumBy(props.treatmentsWithDetails, ({ treatment }) => treatment.duration);
    return timeOperator.convertDurationToReadableDuration(getComputationValue(totalDuration));
  }

  function getComputationValue(total: number) {
    switch (computation) {
      case 'average':
        return props.treatmentsWithDetails.length ? Math.floor(total / props.treatmentsWithDetails.length) : 0;
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
