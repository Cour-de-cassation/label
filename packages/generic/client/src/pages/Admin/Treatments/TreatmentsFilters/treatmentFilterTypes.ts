export type { treatmentFilterType, treatmentFilterInfoType };

type treatmentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  userName: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

type treatmentFilterInfoType = {
  userNames: string[];
};
