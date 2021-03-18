export type { treatedDocumentFilterType, treatedDocumentFilterInfoType };

type treatedDocumentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  userName: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

type treatedDocumentFilterInfoType = {
  userNames: string[];
};
