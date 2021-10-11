export type { treatedDocumentFilterInfoType };

type treatedDocumentFilterInfoType = {
  maxDate: number | undefined;
  minDate: number | undefined;
  jurisdictions: string[];
  publicationCategoryLetters: string[];
  userNames: string[];
  sources: string[];
};
