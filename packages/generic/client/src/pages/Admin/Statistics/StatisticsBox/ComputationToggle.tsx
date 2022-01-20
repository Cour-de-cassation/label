import React from 'react';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { ComputationToggle };

export type { computationType };

type computationType = 'average' | 'total';

const HEIGHT = 24;

function ComputationToggle(props: { value: computationType; onChange: (computation: computationType) => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.toggle}>
      <div onClick={() => props.onChange('total')} style={buildToggleItemStyle('total')}>
        <Text variant="h3">{wordings.statisticsPage.box.computation.total}</Text>
      </div>
      <div onClick={() => props.onChange('average')} style={buildToggleItemStyle('average')}>
        <Text variant="h3">{wordings.statisticsPage.box.computation.average}</Text>
      </div>
    </div>
  );

  function buildToggleItemStyle(toggleItem: computationType) {
    if (props.value === toggleItem) {
      return {
        ...styles.toggleItem,
        ...styles.toggleItemSelected,
      };
    }
    return styles.toggleItem;
  }

  function buildStyles(theme: customThemeType) {
    return {
      toggle: {
        height: `${HEIGHT}px`,
        display: 'flex',
        borderRadius: theme.shape.borderRadius.s,
        boxShadow: theme.boxShadow.minor.in,
      },
      toggleItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: theme.colors.line.level2,
        paddingLeft: theme.spacing * 2,
        paddingRight: theme.spacing * 2,
        borderRadius: theme.shape.borderRadius.s,
      },
      toggleItemSelected: {
        backgroundColor: theme.colors.primary.background,
        color: theme.colors.line.level1,
        boxShadow: 'none',
      },
    };
  }
}
