import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type ressourceFilterRequestType = {
  'addedAnnotationsCount.sensitive'?: { $gte: 0 } | 0;
  'addedAnnotationsCount.other'?: { $gte: 0 } | 0;
  'deletedAnnotationsCount.anonymised'?: { $gte: 0 } | 0;
  'deletedAnnotationsCount.other'?: { $gte: 0 } | 0;
  'modifiedAnnotationsCount.nonAnonymisedToSensitive'?: { $gte: 0 } | 0;
  'modifiedAnnotationsCount.anonymisedToNonAnonymised'?: { $gte: 0 } | 0;
  'modifiedAnnotationsCount.other'?: { $gte: 0 } | 0;
  publicationCategory: string[];
  'resizedBiggerAnnotationsCount.sensitive'?: { $gte: 0 } | 0;
  'resizedBiggerAnnotationsCount.other'?: { $gte: 0 } | 0;
  'resizedSmallerAnnotationsCount.anonymised'?: { $gte: 0 } | 0;
  'resizedSmallerAnnotationsCount.other'?: { $gte: 0 } | 0;
  treatmentDate: { $gte?: number; $lte?: number };
  source: ressourceFilterType['source'];
  userId: ressourceFilterType['userId'];
};

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  if (ressourceFilter.mustHaveNoModifications) {
    ressourceFilterRequest['addedAnnotationsCount.sensitive'] = 0;
    ressourceFilterRequest['addedAnnotationsCount.other'] = 0;
    ressourceFilterRequest['deletedAnnotationsCount.anonymised'] = 0;
    ressourceFilterRequest['deletedAnnotationsCount.other'] = 0;
    ressourceFilterRequest[
      'modifiedAnnotationsCount.nonAnonymisedToSensitive'
    ] = 0;
    ressourceFilterRequest[
      'modifiedAnnotationsCount.anonymisedToNonAnonymised'
    ] = 0;
    ressourceFilterRequest['modifiedAnnotationsCount.other'] = 0;
    ressourceFilterRequest['resizedBiggerAnnotationsCount.sensitive'] = 0;
    ressourceFilterRequest['resizedSmallerAnnotationsCount.anonymised'] = 0;
  }

  if (ressourceFilter.mustHaveAddedAnnotations) {
    ressourceFilterRequest['addedAnnotationsCount.sensitive'] = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveDeletedAnnotations) {
    ressourceFilterRequest['deletedAnnotationsCount.anonymised'] = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveModifiedAnnotations) {
    ressourceFilterRequest[
      'modifiedAnnotationsCount.nonAnonymisedToSensitive'
    ] = { $gte: 0 };
    ressourceFilterRequest[
      'modifiedAnnotationsCount.anonymisedToNonAnonymised'
    ] = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveResizedBiggerAnnotations) {
    ressourceFilterRequest['resizedBiggerAnnotationsCount.sensitive'] = {
      $gte: 0,
    };
  }

  if (ressourceFilter.mustHaveResizedSmallerAnnotations) {
    ressourceFilterRequest['resizedSmallerAnnotationsCount.anonymised'] = {
      $gte: 0,
    };
  }

  if (ressourceFilter.publicationCategory) {
    ressourceFilterRequest.publicationCategory = [
      ressourceFilter.publicationCategory,
    ];
  }

  if (ressourceFilter.startDate) {
    ressourceFilterRequest.treatmentDate = {
      ...ressourceFilterRequest.treatmentDate,
      $gte: ressourceFilter.startDate,
    };
  }

  if (ressourceFilter.endDate) {
    ressourceFilterRequest.treatmentDate = {
      ...ressourceFilterRequest.treatmentDate,
      $lte: ressourceFilter.endDate,
    };
  }

  if (ressourceFilter.source) {
    ressourceFilterRequest.source = ressourceFilter.source;
  }

  if (ressourceFilter.userId) {
    ressourceFilterRequest.userId = ressourceFilter.userId;
  }

  return ressourceFilterRequest;
}
