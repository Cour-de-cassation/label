import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type $andOperatorType = Array<
  | {
      $or: [
        { 'addedAnnotationsCount.sensitive': { $gt: 0 } },
        { 'modifiedAnnotationsCount.nonAnonymisedToSensitive': { $gt: 0 } },
        { 'resizedBiggerAnnotationsCount.sensitive': { $gt: 0 } },
      ];
    }
  | {
      $or: [
        { 'deletedAnnotationsCount.anonymised': { $gt: 0 } },
        { 'modifiedAnnotationsCount.anonymisedToNonAnonymised': { $gt: 0 } },
        { 'resizedSmallerAnnotationsCount.anonymised': { $gt: 0 } },
      ];
    }
>;

type ressourceFilterRequestType = {
  $and?: $andOperatorType;
  publicationCategory?: string[];
  treatmentDate?: { $gt?: number; $lte?: number };
  source?: ressourceFilterType['source'];
  userId?: ressourceFilterType['userId'];
};

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  let $andOperator = [] as $andOperatorType;
  if (ressourceFilter.mustHaveSubAnnotations) {
    $andOperator = [
      ...$andOperator,
      {
        $or: [
          { 'addedAnnotationsCount.sensitive': { $gt: 0 } },
          { 'modifiedAnnotationsCount.nonAnonymisedToSensitive': { $gt: 0 } },
          { 'resizedBiggerAnnotationsCount.sensitive': { $gt: 0 } },
        ],
      },
    ];
  }

  if (ressourceFilter.mustHaveSurAnnotations) {
    $andOperator = [
      ...$andOperator,
      {
        $or: [
          { 'deletedAnnotationsCount.anonymised': { $gt: 0 } },
          { 'modifiedAnnotationsCount.anonymisedToNonAnonymised': { $gt: 0 } },
          { 'resizedSmallerAnnotationsCount.anonymised': { $gt: 0 } },
        ],
      },
    ];
  }

  if ($andOperator.length > 0) {
    ressourceFilterRequest.$and = $andOperator;
  }

  if (ressourceFilter.publicationCategory) {
    ressourceFilterRequest.publicationCategory = [
      ressourceFilter.publicationCategory,
    ];
  }

  if (ressourceFilter.startDate) {
    ressourceFilterRequest.treatmentDate = {
      ...ressourceFilterRequest.treatmentDate,
      $gt: ressourceFilter.startDate,
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
