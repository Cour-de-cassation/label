import React from 'react';
import format from 'string-template';
import { timeOperator } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { filterType } from '../FilterButton';
import { Chip } from './Chip';

export { FilterChip };

function FilterChip(props: { filter: filterType }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const { filter } = props;

  switch (filter.kind) {
    case 'dropdown':
      if (!filter.value) {
        return null;
      }
      const dropdownLabel = filter.computeChipLabel ? filter.computeChipLabel(filter.value) : filter.value;
      return (
        <div style={styles.chipContainer}>
          <Chip label={dropdownLabel} onClose={() => filter.onChange(undefined)} />
        </div>
      );
    case 'boolean':
      if (!filter.checked) {
        return null;
      }
      return (
        <div style={styles.chipContainer}>
          <Chip label={filter.chipLabel} onClose={filter.onToggle} />
        </div>
      );
    case 'dateInterval':
      const dateIntervalLabel = computeDateIntervalChipLabel(filter.value.startDate, filter.value.endDate);
      if (!dateIntervalLabel) {
        return null;
      }
      return (
        <div style={styles.chipContainer}>
          <Chip
            label={dateIntervalLabel}
            onClose={() => filter.onChange({ startDate: undefined, endDate: undefined })}
          />
        </div>
      );
  }

  function computeDateIntervalChipLabel(startDate: Date | undefined, endDate: Date | undefined) {
    if (!startDate && endDate) {
      return format(wordings.shared.intervalDate.endDate, {
        endDate: timeOperator.convertTimestampToReadableDate(endDate.getTime(), false),
      });
    }
    if (startDate && !endDate) {
      return format(wordings.shared.intervalDate.startDate, {
        startDate: timeOperator.convertTimestampToReadableDate(startDate.getTime(), false),
      });
    }
    if (startDate && endDate) {
      return format(wordings.shared.intervalDate.both, {
        startDate: timeOperator.convertTimestampToReadableDate(startDate.getTime(), false),
        endDate: timeOperator.convertTimestampToReadableDate(endDate.getTime(), false),
      });
    }
    return undefined;
  }
}

function buildStyles(theme: customThemeType) {
  return {
    chipContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing,
    },
  };
}
