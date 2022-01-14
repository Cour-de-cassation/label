export type { filterType };

type filterType =
  | {
      kind: 'dropdown';
      name: string;
      computeChipLabel?: (value: string) => string;
      label: string;
      possibleValues: string[];
      computeReadableValue?: (value: string) => string;
      value: string | undefined;
      onChange: (value: string | undefined) => void;
    }
  | {
      kind: 'boolean';
      name: string;
      label: string;
      chipLabel: string;
      checked: boolean;
      onToggle: () => void;
    }
  | {
      kind: 'dateInterval';
      name: string;
      chipLabelPrefix: string;
      labelStart: string;
      labelEnd: string;
      extremumAvailableDates: { min: number | undefined; max: number | undefined };
      value: { startDate: Date | undefined; endDate: Date | undefined };
      onChange: (value: { startDate: Date | undefined; endDate: Date | undefined }) => void;
    };
