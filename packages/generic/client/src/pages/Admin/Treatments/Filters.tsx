import React from 'react';
import format from 'string-template';
import { keysOf } from '@label/core';
import { timeOperator } from '../../../services/timeOperator';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { FilterButton, treatmentFilterType, treatmentFilterInfoType } from './FilterButton';
import { Chip } from './Chip';
import { Text } from '../../../components';

export { Filters };

function Filters(props: {
  filters: treatmentFilterType;
  setFilters: (filters: treatmentFilterType) => void;
  filterInfo: treatmentFilterInfoType;
  resultsCount: number;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.filterContainer}>
      <div style={styles.filterButtonContainer}>
        <div>
          <FilterButton filters={props.filters} setFilters={props.setFilters} filterInfo={props.filterInfo} />
        </div>
        <div style={styles.resultsCountContainer}>
          <Text>{format(wordings.treatmentsPage.table.filter.resultsCount, { count: props.resultsCount })}</Text>
        </div>
      </div>
      <div style={styles.chipsContainer}>
        {keysOf(props.filters).map((filterKey) => renderFilterChip(filterKey, props.filters))}
      </div>
    </div>
  );

  function renderFilterChip(filterKey: keyof treatmentFilterType, filters: treatmentFilterType) {
    switch (filterKey) {
      case 'mustHaveSubAnnotations':
        return renderMustHaveSubAnnotationsChip(filters.mustHaveSubAnnotations);
      case 'mustHaveSurAnnotations':
        return renderMustHaveSurAnnotationsChip(filters.mustHaveSurAnnotations);
      case 'startDate':
        return renderStartDateChip(filters.startDate);
      case 'userName':
        return renderUserNameChip(filters.userName);
    }

    function renderMustHaveSurAnnotationsChip(filterValue: boolean) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip
              filterText={wordings.treatmentsPage.table.filter.chips.mustHaveSurAnnotations}
              onClose={buildRemoveFilter(filterKey)}
            />
          </div>
        )
      );
    }

    function renderMustHaveSubAnnotationsChip(filterValue: boolean) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip
              filterText={wordings.treatmentsPage.table.filter.chips.mustHaveSubAnnotations}
              onClose={buildRemoveFilter(filterKey)}
            />
          </div>
        )
      );
    }

    function renderStartDateChip(filterValue: Date | undefined) {
      if (!filterValue) {
        return null;
      }
      const filterText = format(wordings.treatmentsPage.table.filter.chips.startDate, {
        startDate: timeOperator.convertTimestampToReadableDate(filterValue.getTime(), false),
      });
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip filterText={filterText} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }

    function renderUserNameChip(filterValue: string | undefined) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip filterText={filterValue} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }
  }

  function buildRemoveFilter(filterKeyToRemove: string) {
    return () => props.setFilters({ ...props.filters, [filterKeyToRemove]: undefined });
  }
}

function buildStyles(theme: customThemeType) {
  return {
    chipsContainer: {
      paddingTop: theme.spacing,
      paddingBottom: theme.spacing,
      paddingLeft: theme.spacing,
      display: 'flex',
      flex: 1,
    },
    chipContainer: {
      marginRight: theme.spacing,
    },
    filterContainer: {
      display: 'flex',
    },
    filterButtonContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    resultsCountContainer: {
      paddingTop: theme.spacing,
      color: theme.colors.line.level2,
    },
  } as const;
}
