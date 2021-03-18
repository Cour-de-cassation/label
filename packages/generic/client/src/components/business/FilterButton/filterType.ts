export type { filterType };

type filterType =
  | {
      kind: 'dropdown';
      name: string;
      label: string;
      possibleValues: string[];
      value: string | undefined;
      onChange: (value: string) => void;
    }
  | {
      kind: 'boolean';
      name: string;
      label: string;
      checked: boolean;
      onToggle: () => void;
    }
  | {
      kind: 'dateInterval';
      name: string;
      value: { startDate: Date | undefined; endDate: Date | undefined };
      onChangeStartDate: (startDate: Date) => void;
      onChangeEndDate: (endDate: Date) => void;
    };
