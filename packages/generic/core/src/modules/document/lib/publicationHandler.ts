export { publicationHandler };

const PUBLISHED_PUBLICATION_CATEGORY_LETTERS = ['P', 'B'];

const PRIORITIZED_NAC_CODE = ['97H'];

const publicationHandler = {
  mustBePublished,
  getPublishedPublicationCategory,
};

function getPublishedPublicationCategory() {
  return PUBLISHED_PUBLICATION_CATEGORY_LETTERS;
}

function mustBePublished(publicationCategory: string[], NACCode?: string) {
  return (
    PUBLISHED_PUBLICATION_CATEGORY_LETTERS.some((publicationCategoryLetter) =>
      publicationCategory.includes(publicationCategoryLetter),
    ) ||
    (NACCode && PRIORITIZED_NAC_CODE.some((prioritizedNACCode) => prioritizedNACCode.includes(NACCode)))
  );
}
