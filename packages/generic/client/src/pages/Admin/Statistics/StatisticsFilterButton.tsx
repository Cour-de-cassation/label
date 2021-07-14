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
  ressourceFilter: ressourceFilterType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const filters = buildFilters();

  return (
    <div style={styles.container}>
      <FilterButton filters={filters} />
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
    const userFilter = buildUserFilter();

    return [
      dateIntervalFilter,
      userFilter,
      sourceFilter,
      publicationCategoryFilter,
      mustHaveSubAnnotationsFilter,
      mustHaveSurAnnotationsFilter,
    ];

    function buildMustHaveSubAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveSubAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveSubAnnotations,
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
        label: wordings.statisticsPage.filter.fields.mustHaveSurAnnotations,
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
        label: wordings.statisticsPage.filter.fields.publicationCategory,
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
        name: 'dateInterval',
        value: {
          startDate: props.ressourceFilter.startDate ? new Date(props.ressourceFilter.startDate) : undefined,
          endDate: props.ressourceFilter.endDate ? new Date(props.ressourceFilter.endDate) : undefined,
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
        label: wordings.statisticsPage.filter.fields.source,
        possibleValues: props.availableStatisticFilters.sources,
        value: props.ressourceFilter.source,
        onChange: (newSource: string | undefined) => {
          props.refetch({ ...props.ressourceFilter, source: newSource });
        },
      };
    }

    function buildUserFilter() {
      const userName = props.ressourceFilter.userId && findUserNameByUserId(props.ressourceFilter.userId);

      return {
        kind: 'dropdown' as const,
        name: 'user',
        label: wordings.statisticsPage.filter.fields.agents,
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
