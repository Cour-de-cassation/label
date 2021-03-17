export type { filterType };

type filterType<filterNameT extends string> =
  | {
      kind: 'dropdown';
      name: filterNameT;
      label: string;
      possibleValues: string[];
      value: string | undefined;
      onChange: (value: string) => void;
    }
  | {
      kind: 'boolean';
      name: filterNameT;
      label: string;
      checked: boolean;
      onToggle: () => void;
    }
  | {
      kind: 'dateInterval';
      name: filterNameT;
      value: { startDate: Date | undefined; endDate: Date | undefined };
      onChangeStartDate: (startDate: Date) => void;
      onChangeEndDate: (endDate: Date) => void;
    };
