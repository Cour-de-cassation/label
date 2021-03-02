import React, { useState } from 'react';
import { sumBy } from 'lodash';
import { apiRouteOutType } from '@label/core';
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
              <Text variant="h3">{title}</Text>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {statisticsCells.map(({ value }) => (
              <Text>{value}</Text>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  function buildStatisticsCells() {
    return [
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
        return Math.floor(total / props.treatmentsWithDetails.length);
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
    };
  }
}
