export type { untreatedDocumentFilterType, untreatedDocumentFilterInfoType };

type untreatedDocumentFilterType = {
  source: string | undefined;
  publicationCategoryLetter: string | undefined;
};

type untreatedDocumentFilterInfoType = {
  publicationCategoryLetters: string[];
  sources: string[];
};
