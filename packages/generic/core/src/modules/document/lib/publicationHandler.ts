import { documentType } from '../documentType';

export { publicationHandler };

const PUBLISHED_PUBLICATION_CATEGORY_LETTERS = ['P', 'B'];

const PRIORITIZED_NAC_CODES = ['97H'];

const publicationHandler = {
  mustBePublished,
  getPublishedPublicationCategory,
  getPrioritizedNACCodes,
};

function getPublishedPublicationCategory() {
  return PUBLISHED_PUBLICATION_CATEGORY_LETTERS;
}

function getPrioritizedNACCodes() {
  return PRIORITIZED_NAC_CODES;
}

function mustBePublished(
  publicationCategory: documentType['publicationCategory'],
  NACCode?: documentType['decisionMetadata']['NACCode'],
) {
  return (
    PUBLISHED_PUBLICATION_CATEGORY_LETTERS.some((publicationCategoryLetter) =>
      publicationCategory.includes(publicationCategoryLetter),
    ) ||
    (NACCode && PRIORITIZED_NAC_CODES.some((prioritizedNACCode) => prioritizedNACCode.includes(NACCode)))
  );
}
