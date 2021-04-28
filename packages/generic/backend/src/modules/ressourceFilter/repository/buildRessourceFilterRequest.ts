import { ressourceFilterType } from '@label/core';

export { buildRessourceFilterRequest };

type ressourceFilterRequestType = {
  addedAnnotationsCount?: { $gte: 0 } | 0;
  deletedAnnotationsCount?: { $gte: 0 } | 0;
  modifiedAnnotationsCount?: { $gte: 0 } | 0;
  publicationCategory: string[];
  resizedBiggerAnnotationsCount?: { $gte: 0 } | 0;
  resizedSmallerAnnotationsCount?: { $gte: 0 } | 0;
  source: ressourceFilterType['source'];
  userId: ressourceFilterType['userId'];
};

function buildRessourceFilterRequest(
  ressourceFilter: ressourceFilterType,
): ressourceFilterRequestType {
  const ressourceFilterRequest = {} as ressourceFilterRequestType;

  if (ressourceFilter.mustHaveNoModifications) {
    ressourceFilterRequest.addedAnnotationsCount = 0;
    ressourceFilterRequest.deletedAnnotationsCount = 0;
    ressourceFilterRequest.modifiedAnnotationsCount = 0;
    ressourceFilterRequest.resizedBiggerAnnotationsCount = 0;
    ressourceFilterRequest.resizedSmallerAnnotationsCount = 0;
  }

  if (ressourceFilter.mustHaveAddedAnnotations) {
    ressourceFilterRequest.addedAnnotationsCount = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveDeletedAnnotations) {
    ressourceFilterRequest.deletedAnnotationsCount = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveModifiedAnnotations) {
    ressourceFilterRequest.modifiedAnnotationsCount = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveResizedBiggerAnnotations) {
    ressourceFilterRequest.resizedBiggerAnnotationsCount = { $gte: 0 };
  }

  if (ressourceFilter.mustHaveResizedSmallerAnnotations) {
    ressourceFilterRequest.resizedSmallerAnnotationsCount = { $gte: 0 };
  }

  if (ressourceFilter.publicationCategory) {
    ressourceFilterRequest.publicationCategory = [
      ressourceFilter.publicationCategory,
    ];
  }

  if (ressourceFilter.source) {
    ressourceFilterRequest.source = ressourceFilter.source;
  }

  if (ressourceFilter.userId) {
    ressourceFilterRequest.userId = ressourceFilter.userId;
  }

  return ressourceFilterRequest;
}
