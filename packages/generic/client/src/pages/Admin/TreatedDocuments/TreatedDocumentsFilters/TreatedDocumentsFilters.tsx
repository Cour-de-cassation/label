import { documentModule, documentType } from '@label/core';
import React from 'react';
import format from 'string-template';
import { FilterButton, FilterChip, filterType, Text } from '../../../../components';
import { documentReviewFilterStatuses, treatedDocumentFilterType } from '../../../../services/localStorage';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { treatedDocumentFilterInfoType } from './treatedDocumentFilterInfoType';

export { TreatedDocumentsFilters };

export type { treatedDocumentFilterInfoType };

function TreatedDocumentsFilters(props: {
  filterValues: treatedDocumentFilterType;
  setFilterValues: (filterValues: treatedDocumentFilterType) => void;
  filterInfo: treatedDocumentFilterInfoType;
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
          <Text>{format(wordings.treatedDocumentsPage.table.filter.resultsCount, { count: props.resultsCount })}</Text>
        </div>
      </div>
      <div style={styles.chipsContainer}>
        {filters.map((filter) => (
          <FilterChip filter={filter} />
        ))}
      </div>
    </div>
  );

  function buildFilters(): filterType[] {
    return [
      {
        kind: 'dateInterval' as const,
        name: 'dateInterval',
        extremumAvailableDates: {
          min: props.filterInfo.minDate,
          max: props.filterInfo.maxDate,
        },
        value: { startDate: props.filterValues.startDate, endDate: props.filterValues.endDate },
        onChange: (value: { startDate: Date | undefined; endDate: Date | undefined }) => {
          props.setFilterValues({ ...props.filterValues, startDate: value.startDate, endDate: value.endDate });
        },
      },
      {
        kind: 'dropdown' as const,
        name: 'userName',
        label: wordings.treatedDocumentsPage.table.filter.fields.workingUser,
        possibleValues: props.filterInfo.userNames,
        value: props.filterValues.userName,
        onChange: (userName?: string) => props.setFilterValues({ ...props.filterValues, userName }),
      },
      {
        kind: 'dropdown' as const,
        name: 'source',
        label: wordings.treatedDocumentsPage.table.filter.fields.source,
        possibleValues: props.filterInfo.sources,
        value: props.filterValues.source,
        computeChipLabel: (source: string) =>
          format(wordings.treatedDocumentsPage.table.filter.chips.source, {
            source,
          }),
        onChange: (source?: string) => props.setFilterValues({ ...props.filterValues, source }),
      },
      {
        kind: 'dropdown' as const,
        name: 'source',
        label: wordings.treatedDocumentsPage.table.filter.fields.jurisdiction,
        possibleValues: props.filterInfo.jurisdictions,
        value: props.filterValues.jurisdiction,
        onChange: (jurisdiction?: string) => props.setFilterValues({ ...props.filterValues, jurisdiction }),
      },
      {
        kind: 'dropdown' as const,
        name: 'publicationCategoryLetter',
        label: wordings.treatedDocumentsPage.table.filter.fields.publicationCategoryLetter,
        possibleValues: props.filterInfo.publicationCategoryLetters,
        value: props.filterValues.publicationCategoryLetter,
        onChange: (publicationCategoryLetter?: string) =>
          props.setFilterValues({ ...props.filterValues, publicationCategoryLetter }),
      },
      {
        kind: 'dropdown' as const,
        name: 'documentReviewFilterStatus',
        label: wordings.treatedDocumentsPage.table.filter.fields.documentReviewFilterStatus,
        possibleValues: (documentReviewFilterStatuses as unknown) as string[],
        value: props.filterValues.documentReviewFilterStatus,
        computeChipLabel: convertDocumentReviewStatusToReadable,
        computeReadableValue: convertDocumentReviewStatusToReadable,
        onChange: (documentReviewFilterStatus?: string) =>
          props.setFilterValues({
            ...props.filterValues,
            documentReviewFilterStatus: documentReviewFilterStatus as
              | typeof documentReviewFilterStatuses[number]
              | undefined,
          }),
      },
      {
        kind: 'dropdown' as const,
        name: 'route',
        label: wordings.treatedDocumentsPage.table.filter.fields.route,
        possibleValues: (documentModule.fetchedModel.content.route.content as unknown) as string[],
        value: props.filterValues.route,
        computeChipLabel: (route: string) =>
          wordings.treatedDocumentsPage.table.filter.chips.routes[route as documentType['route']],
        computeReadableValue: (route: string) => wordings.business.documentRoute[route as documentType['route']],
        onChange: (route?: string) =>
          props.setFilterValues({
            ...props.filterValues,
            route: route as documentType['route'] | undefined,
          }),
      },
      {
        kind: 'boolean' as const,
        name: 'mustHaveSubAnnotations',
        chipLabel: wordings.treatedDocumentsPage.table.filter.chips.mustHaveSubAnnotations,
        label: wordings.treatedDocumentsPage.table.filter.fields.mustHaveSubAnnotations,
        checked: props.filterValues.mustHaveSubAnnotations,
        onToggle: () =>
          props.setFilterValues({
            ...props.filterValues,
            mustHaveSubAnnotations: !props.filterValues.mustHaveSubAnnotations,
          }),
      },
      {
        kind: 'boolean' as const,
        name: 'mustHaveSurAnnotations',
        chipLabel: wordings.treatedDocumentsPage.table.filter.chips.mustHaveSurAnnotations,
        label: wordings.treatedDocumentsPage.table.filter.fields.mustHaveSurAnnotations,
        checked: props.filterValues.mustHaveSurAnnotations,
        onToggle: () =>
          props.setFilterValues({
            ...props.filterValues,
            mustHaveSurAnnotations: !props.filterValues.mustHaveSurAnnotations,
          }),
      },
    ];
  }
}

function convertDocumentReviewStatusToReadable(documentReviewFilterStatus: string) {
  return wordings.business.documentReviewFilterStatus[
    documentReviewFilterStatus as typeof documentReviewFilterStatuses[number]
  ].filter;
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
