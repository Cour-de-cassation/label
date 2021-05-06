export { publicationHandler };

const PUBLISHED_PUBLICATION_CATEGORY_LETTERS = ['P', 'B'];

const publicationHandler = {
  mustBePublished,
  getPublishedPublicationCategory,
};

function getPublishedPublicationCategory() {
  return PUBLISHED_PUBLICATION_CATEGORY_LETTERS;
}

function mustBePublished(publicationCategory: string[]) {
  return PUBLISHED_PUBLICATION_CATEGORY_LETTERS.some((publicationCategoryLetter) =>
    publicationCategory.includes(publicationCategoryLetter),
  );
}
