import React from 'react';
import { apiRouteOutType, idModule, ressourceFilterType, userType } from '@label/core';
import { FilterButton, FilterChip } from '../../../components';
import { wordings } from '../../../wordings';
import { customThemeType, useCustomTheme } from '../../../styles';

export { StatisticsFilterButton };

function StatisticsFilterButton(props: {
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  users: Pick<userType, '_id' | 'name'>[];
  refetch: (ressourceFilter: ressourceFilterType) => void;
  isLoading: boolean;
  ressourceFilter: ressourceFilterType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const filters = buildFilters();

  return (
    <div style={styles.container}>
      <FilterButton filters={filters} isLoading={props.isLoading} />
      <div style={styles.chipsContainer}>
        {filters.map((filter) => (
          <FilterChip filter={filter} />
        ))}
      </div>
    </div>
  );

  function buildFilters() {
    const mustHaveSubAnnotationsFilter = buildMustHaveSubAnnotationsFilter();
    const mustHaveSurAnnotationsFilter = buildMustHaveSurAnnotationsFilter();
    const publicationCategoryFilter = buildPublicationCategoryFilter();
    const dateIntervalFilter = buildDateIntervalFilter();
    const sourceFilter = buildSourceFilter();
    const jurisdictionFilter = buildJurisdictionFilter();
    const userFilter = buildUserFilter();

    return [
      dateIntervalFilter,
      userFilter,
      jurisdictionFilter,
      sourceFilter,
      publicationCategoryFilter,
      mustHaveSubAnnotationsFilter,
      mustHaveSurAnnotationsFilter,
    ];

    function buildMustHaveSubAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveSubAnnotations',
        label: wordings.business.filters.fields.mustHaveSubAnnotations,
        checked: props.ressourceFilter.mustHaveSubAnnotations,
        chipLabel: wordings.business.filters.chips.mustHaveSubAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveSubAnnotations: !props.ressourceFilter.mustHaveSubAnnotations,
          });
        },
      };
    }

    function buildMustHaveSurAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveSurAnnotations',
        label: wordings.business.filters.fields.mustHaveSurAnnotations,
        checked: props.ressourceFilter.mustHaveSurAnnotations,
        chipLabel: wordings.business.filters.chips.mustHaveSurAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveSurAnnotations: !props.ressourceFilter.mustHaveSurAnnotations,
          });
        },
      };
    }

    function buildPublicationCategoryFilter() {
      return {
        kind: 'dropdown' as const,
        name: 'publicationCategory',
        label: wordings.business.filters.fields.publicationCategoryLetter,
        possibleValues: props.availableStatisticFilters.publicationCategories,
        value: props.ressourceFilter.publicationCategory,
        onChange: (newPublicationCategory: string | undefined) => {
          props.refetch({ ...props.ressourceFilter, publicationCategory: newPublicationCategory });
        },
      };
    }

    function buildDateIntervalFilter() {
      return {
        kind: 'dateInterval' as const,
        name: 'treatmentDate',
        value: {
          startDate: props.ressourceFilter.startDate ? new Date(props.ressourceFilter.startDate) : undefined,
          endDate: props.ressourceFilter.endDate ? new Date(props.ressourceFilter.endDate) : undefined,
        },
        labelStart: wordings.business.filters.fields.treatmentDate.start,
        labelEnd: wordings.business.filters.fields.treatmentDate.end,
        chipLabelPrefix: wordings.business.filters.chips.treatmentDate,
        extremumAvailableDates: {
          min: props.availableStatisticFilters.minDate,
          max: props.availableStatisticFilters.maxDate,
        },
        onChange: (value: { startDate: Date | undefined; endDate: Date | undefined }) => {
          props.refetch({
            ...props.ressourceFilter,
            startDate: value.startDate ? value.startDate.getTime() : undefined,
            endDate: value.endDate ? value.endDate.getTime() : undefined,
          });
        },
      };
    }

    function buildSourceFilter() {
      return {
        kind: 'dropdown' as const,
        name: 'source',
        label: wordings.business.filters.fields.source,
        possibleValues: props.availableStatisticFilters.sources,
        value: props.ressourceFilter.source,
        onChange: (newSource: string | undefined) => {
          props.refetch({ ...props.ressourceFilter, source: newSource });
        },
      };
    }

    function buildJurisdictionFilter() {
      return {
        kind: 'dropdown' as const,
        name: 'jurisdiction',
        label: wordings.business.filters.fields.jurisdiction,
        possibleValues: props.availableStatisticFilters.jurisdictions,
        value: props.ressourceFilter.jurisdiction,
        onChange: (newJurisdiction: string | undefined) => {
          props.refetch({ ...props.ressourceFilter, jurisdiction: newJurisdiction });
        },
      };
    }

    function buildUserFilter() {
      const userName = props.ressourceFilter.userId && findUserNameByUserId(props.ressourceFilter.userId);

      return {
        kind: 'dropdown' as const,
        name: 'user',
        label: wordings.business.filters.fields.userName,
        possibleValues: props.users.map(({ name }) => name),
        value: userName,
        onChange: (userName: string | undefined) => {
          if (!userName) {
            return props.refetch({ ...props.ressourceFilter, userId: undefined });
          }
          const userId = findUserIdByUserName(userName);
          if (!!userId) {
            props.refetch({ ...props.ressourceFilter, userId });
          }
        },
      };
    }
  }

  function findUserIdByUserName(userName: userType['name']) {
    const user = props.users.find(({ name }) => name === userName);
    if (user) {
      return user._id;
    }
  }

  function findUserNameByUserId(userId: userType['_id']) {
    const user = props.users.find(({ _id }) => idModule.lib.equalId(userId, _id));
    if (user) {
      return user.name;
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
    },
    chipsContainer: {
      paddingLeft: theme.spacing,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
  } as const;
}
