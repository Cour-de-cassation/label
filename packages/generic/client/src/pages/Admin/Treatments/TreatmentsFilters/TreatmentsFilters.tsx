import React from 'react';
import format from 'string-template';
import { keysOf } from '@label/core';
import { Chip, FilterButton, filterType, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { treatmentFilterInfoType, treatmentFilterType } from './treatmentFilterTypes';

export { TreatmentsFilters };

export type { treatmentFilterInfoType, treatmentFilterType };

function TreatmentsFilters(props: {
  filterValues: treatmentFilterType;
  setFilterValues: (filterValues: treatmentFilterType) => void;
  filterInfo: treatmentFilterInfoType;
  resultsCount: number;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const filters = buildFilters();

  return (
    <div style={styles.filterContainer}>
      <div style={styles.filterButtonContainer}>
        <div>
          <FilterButton filters={filters} />
        </div>
        <div style={styles.resultsCountContainer}>
          <Text>{format(wordings.treatmentsPage.table.filter.resultsCount, { count: props.resultsCount })}</Text>
        </div>
      </div>
      <div style={styles.chipsContainer}>
        {keysOf(props.filterValues).map((filterKey) => renderFilterChip(filterKey, props.filterValues))}
      </div>
    </div>
  );

  function buildFilters() {
    return [
      {
        kind: 'dateInterval',
        name: 'dateInterval',
        value: { startDate: props.filterValues.startDate, endDate: props.filterValues.endDate },
        onChangeStartDate: (startDate: Date) =>
          props.setFilterValues({
            ...props.filterValues,
            startDate,
          }),
        onChangeEndDate: (endDate: Date) =>
          props.setFilterValues({
            ...props.filterValues,
            endDate,
          }),
      },
      {
        kind: 'dropdown',
        name: 'userName',
        label: wordings.treatmentsPage.table.filter.fields.agents,
        possibleValues: props.filterInfo.userNames,
        value: props.filterValues.userName,
        onChange: (userName: string) => props.setFilterValues({ ...props.filterValues, userName }),
      },
      {
        kind: 'boolean',
        name: 'mustHaveSubAnnotations',
        label: wordings.treatmentsPage.table.filter.fields.mustHaveSubAnnotations,
        checked: props.filterValues.mustHaveSubAnnotations,
        onToggle: () =>
          props.setFilterValues({
            ...props.filterValues,
            mustHaveSubAnnotations: !props.filterValues.mustHaveSubAnnotations,
          }),
      },
      {
        kind: 'boolean',
        name: 'mustHaveSurAnnotations',
        label: wordings.treatmentsPage.table.filter.fields.mustHaveSurAnnotations,
        checked: props.filterValues.mustHaveSurAnnotations,
        onToggle: () =>
          props.setFilterValues({
            ...props.filterValues,
            mustHaveSurAnnotations: !props.filterValues.mustHaveSurAnnotations,
          }),
      },
    ] as filterType<keyof treatmentFilterType>[];
  }

  function renderFilterChip(filterKey: keyof treatmentFilterType, filterValues: treatmentFilterType) {
    switch (filterKey) {
      case 'mustHaveSubAnnotations':
        return renderMustHaveSubAnnotationsChip(filterValues.mustHaveSubAnnotations);
      case 'mustHaveSurAnnotations':
        return renderMustHaveSurAnnotationsChip(filterValues.mustHaveSurAnnotations);
      case 'startDate':
        return renderStartDateChip(filterValues.startDate);
      case 'endDate':
        return renderEndDateChip(filterValues.endDate);
      case 'userName':
        return renderUserNameChip(filterValues.userName);
    }

    function renderMustHaveSurAnnotationsChip(filterValue: boolean) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip
              label={wordings.treatmentsPage.table.filter.chips.mustHaveSurAnnotations}
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
              label={wordings.treatmentsPage.table.filter.chips.mustHaveSubAnnotations}
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
            <Chip label={filterText} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }

    function renderEndDateChip(filterValue: Date | undefined) {
      if (!filterValue) {
        return null;
      }
      const filterText = format(wordings.treatmentsPage.table.filter.chips.endDate, {
        endDate: timeOperator.convertTimestampToReadableDate(filterValue.getTime(), false),
      });
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip label={filterText} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }

    function renderUserNameChip(filterValue: string | undefined) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip label={filterValue} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }
  }

  function buildRemoveFilter(filterKeyToRemove: string) {
    return () => props.setFilterValues({ ...props.filterValues, [filterKeyToRemove]: undefined });
  }
}

function buildStyles(theme: customThemeType) {
  return {
    chipsContainer: {
      paddingTop: theme.spacing,
      paddingBottom: theme.spacing * 3,
      paddingLeft: theme.spacing,
      display: 'flex',
      flex: 1,
      flexWrap: 'wrap',
      alignItems: 'center',
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
      paddingTop: theme.spacing * 2,
    },
    resultsCountContainer: {
      paddingTop: theme.spacing,
      color: theme.colors.line.level2,
    },
  } as const;
}
