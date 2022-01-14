import React from 'react';
import format from 'string-template';
import { FilterButton, FilterChip } from '../../business';
import { Text } from '../../generic';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import {
  buildDocumentCreationDateFilter,
  buildDocumentReviewStatusFilter,
  buildJurisdictionFilter,
  buildMustHaveSubAnnotationsFilter,
  buildMustHaveSurAnnotationsFilter,
  buildPublicationCategoryLetterFilter,
  buildRouteFilter,
  buildSourceFilter,
  buildTreatmentDateFilter,
  buildUserNameFilter,
  filtersType,
} from '../../../services/filters';

export { DocumentsFilters };

function DocumentsFilters(props: { filters: Partial<filtersType>; resultsCount: number }) {
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
          <Text>{format(wordings.business.filters.resultsCount, { count: props.resultsCount })}</Text>
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
    const filters = [];
    if (props.filters.treatmentDate) {
      filters.push(buildTreatmentDateFilter(props.filters.treatmentDate));
    }
    if (props.filters.documentCreationDate) {
      filters.push(buildDocumentCreationDateFilter(props.filters.documentCreationDate));
    }
    if (props.filters.source) {
      filters.push(buildSourceFilter(props.filters.source));
    }
    if (props.filters.publicationCategoryLetter) {
      filters.push(buildPublicationCategoryLetterFilter(props.filters.publicationCategoryLetter));
    }
    if (props.filters.route) {
      filters.push(buildRouteFilter(props.filters.route));
    }
    if (props.filters.jurisdiction) {
      filters.push(buildJurisdictionFilter(props.filters.jurisdiction));
    }
    if (props.filters.userName) {
      filters.push(buildUserNameFilter(props.filters.userName));
    }
    if (props.filters.documentReviewFilterStatus) {
      filters.push(buildDocumentReviewStatusFilter(props.filters.documentReviewFilterStatus));
    }
    if (props.filters.mustHaveSubAnnotations) {
      filters.push(buildMustHaveSubAnnotationsFilter(props.filters.mustHaveSubAnnotations));
    }
    if (props.filters.mustHaveSurAnnotations) {
      filters.push(buildMustHaveSurAnnotationsFilter(props.filters.mustHaveSurAnnotations));
    }
    return filters;
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
