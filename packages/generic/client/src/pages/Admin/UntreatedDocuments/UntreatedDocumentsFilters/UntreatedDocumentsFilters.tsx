import React from 'react';
import format from 'string-template';
import { keysOf } from '@label/core';
import { FilterButton, Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { untreatedDocumentFilterInfoType, untreatedDocumentFilterType } from './untreatedDocumentFilterTypes';

export { UntreatedDocumentsFilters };

function UntreatedDocumentsFilters(props: {
  filterValues: untreatedDocumentFilterType;
  setFilterValues: (filterValues: untreatedDocumentFilterType) => void;
  filterInfo: untreatedDocumentFilterInfoType;
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
      <div style={styles.chipsContainer}>{keysOf(props.filterValues).map(() => renderFilterChip())}</div>
    </div>
  );

  function buildFilters() {
    return [];
  }

  function renderFilterChip() {
    return null;
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
