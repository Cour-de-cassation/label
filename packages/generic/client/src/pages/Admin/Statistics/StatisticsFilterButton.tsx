import React from 'react';
import { apiRouteOutType, idModule, ressourceFilterType, userType } from '@label/core';
import { FilterButton } from '../../../components';
import { wordings } from '../../../wordings';

export { StatisticsFilterButton };

function StatisticsFilterButton(props: {
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  users: Omit<userType, 'hashedPassword'>[];
  refetch: (ressourceFilter: ressourceFilterType) => void;
  ressourceFilter: ressourceFilterType;
}) {
  const filters = buildFilters();

  return <FilterButton filters={filters} />;

  function buildFilters() {
    const mustHaveAddedAnnotationsFilter = buildMustHaveAddedAnnotationsFilter();
    const mustHaveDeletedAnnotationsFilter = buildMustHaveDeletedAnnotationsFilter();
    const mustHaveModifiedAnnotationsFilter = buildMustHaveModifiedAnnotationsFilter();
    const mustHaveNoModificationsFilter = buildMustHaveNoModificationsFilter();
    const mustHaveResizedBiggerAnnotationsFilter = buildMustHaveResizedBiggerAnnotationsFilter();
    const mustHaveResizedSmallerAnnotationsFilter = buildMustHaveResizedSmallerAnnotationsFilter();
    const publicationCategoryFilter = buildPublicationCategoryFilter();
    const sourceFilter = buildSourceFilter();
    const userFilter = buildUserFilter();

    return [
      userFilter,
      sourceFilter,
      publicationCategoryFilter,
      mustHaveNoModificationsFilter,
      mustHaveAddedAnnotationsFilter,
      mustHaveResizedBiggerAnnotationsFilter,
      mustHaveDeletedAnnotationsFilter,
      mustHaveResizedSmallerAnnotationsFilter,
      mustHaveModifiedAnnotationsFilter,
    ];

    function buildMustHaveAddedAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveAddedAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveAddedAnnotations,
        checked: props.ressourceFilter.mustHaveAddedAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveAddedAnnotations: !props.ressourceFilter.mustHaveAddedAnnotations,
          });
        },
      };
    }

    function buildMustHaveDeletedAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveDeletedAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveDeletedAnnotations,
        checked: props.ressourceFilter.mustHaveDeletedAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveDeletedAnnotations: !props.ressourceFilter.mustHaveDeletedAnnotations,
          });
        },
      };
    }

    function buildMustHaveModifiedAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveModifiedAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveModifiedAnnotations,
        checked: props.ressourceFilter.mustHaveModifiedAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveModifiedAnnotations: !props.ressourceFilter.mustHaveModifiedAnnotations,
          });
        },
      };
    }

    function buildMustHaveNoModificationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveNoModifications',
        label: wordings.statisticsPage.filter.fields.mustHaveNoModifications,
        checked: props.ressourceFilter.mustHaveNoModifications,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveNoModifications: !props.ressourceFilter.mustHaveNoModifications,
          });
        },
      };
    }

    function buildMustHaveResizedBiggerAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveResizedBiggerAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveResizedBiggerAnnotations,
        checked: props.ressourceFilter.mustHaveResizedBiggerAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveResizedBiggerAnnotations: !props.ressourceFilter.mustHaveResizedBiggerAnnotations,
          });
        },
      };
    }

    function buildMustHaveResizedSmallerAnnotationsFilter() {
      return {
        kind: 'boolean' as const,
        name: 'mustHaveResizedSmallerAnnotations',
        label: wordings.statisticsPage.filter.fields.mustHaveResizedSmallerAnnotations,
        checked: props.ressourceFilter.mustHaveResizedSmallerAnnotations,
        onToggle: () => {
          props.refetch({
            ...props.ressourceFilter,
            mustHaveResizedSmallerAnnotations: !props.ressourceFilter.mustHaveResizedSmallerAnnotations,
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
        onChange: (newPublicationCategory: string) => {
          if (newPublicationCategory !== undefined) {
            props.refetch({ ...props.ressourceFilter, publicationCategory: newPublicationCategory });
          }
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
        onChange: (newSource: string) => {
          if (newSource !== undefined) {
            props.refetch({ ...props.ressourceFilter, source: newSource });
          }
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
        onChange: (userName: string) => {
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
