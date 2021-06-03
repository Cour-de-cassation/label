import React from 'react';
import format from 'string-template';
import { FilterButton, FilterChip, Text } from '../../../../components';
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
        {filters.map((filter) => (
          <FilterChip filter={filter} />
        ))}
      </div>
    </div>
  );

  function buildFilters() {
    return [
      {
        kind: 'dropdown' as const,
        name: 'publicationCategoryLetter',
        computeChipLabel: (publicationCategoryLetter: string) =>
          format(wordings.untreatedDocumentsPage.table.filter.chips.publicationCategoryLetter, {
            publicationCategoryLetter,
          }),
        label: wordings.untreatedDocumentsPage.table.filter.fields.publicationCategoryLetter,
        possibleValues: props.filterInfo.publicationCategoryLetters,
        value: props.filterValues.publicationCategoryLetter,
        onChange: (publicationCategoryLetter?: string) =>
          props.setFilterValues({ ...props.filterValues, publicationCategoryLetter }),
      },
      {
        kind: 'dropdown' as const,
        name: 'source',
        computeChipLabel: (source: string) =>
          format(wordings.untreatedDocumentsPage.table.filter.chips.source, {
            source,
          }),
        label: wordings.untreatedDocumentsPage.table.filter.fields.source,
        possibleValues: props.filterInfo.sources,
        value: props.filterValues.source,
        onChange: (source?: string) => props.setFilterValues({ ...props.filterValues, source }),
      },
    ];
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
