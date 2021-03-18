import React from 'react';
import format from 'string-template';
import { keysOf } from '@label/core';
import { Chip, FilterButton, filterType, Text } from '../../../../components';
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
          <Text>
            {format(wordings.untreatedDocumentsPage.table.filter.resultsCount, { count: props.resultsCount })}
          </Text>
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
        kind: 'dropdown',
        name: 'publicationCategoryLetter',
        label: wordings.untreatedDocumentsPage.table.filter.fields.publicationCategoryLetter,
        possibleValues: props.filterInfo.publicationCategoryLetters,
        value: props.filterValues.publicationCategoryLetter,
        onChange: (publicationCategoryLetter: string) =>
          props.setFilterValues({ ...props.filterValues, publicationCategoryLetter }),
      },
    ] as filterType[];
  }

  function renderFilterChip(filterKey: keyof untreatedDocumentFilterType, filterValues: untreatedDocumentFilterType) {
    switch (filterKey) {
      case 'publicationCategoryLetter':
        return renderPublicationCategoryLetterChip('publicationCategoryLetter', filterValues.publicationCategoryLetter);
    }
  }

  function renderPublicationCategoryLetterChip(
    filterKey: keyof untreatedDocumentFilterType,
    filterValue: string | undefined,
  ) {
    if (!filterValue) {
      return null;
    }
    const filterText = format(wordings.untreatedDocumentsPage.table.filter.chips.publicationCategoryLetter, {
      publicationCategoryLetter: filterValue,
    });
    return (
      !!filterValue && (
        <div style={styles.chipContainer}>
          <Chip label={filterText} onClose={buildRemoveFilter(filterKey)} />
        </div>
      )
    );
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
