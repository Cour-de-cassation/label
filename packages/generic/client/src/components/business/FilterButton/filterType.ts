export type { filterType };

type filterType =
  | {
      kind: 'dropdown';
      name: string;
      computeChipLabel?: (value: string) => string;
      label: string;
      possibleValues: string[];
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
      value: { startDate: Date | undefined; endDate: Date | undefined };
      onChange: (value: { startDate: Date | undefined; endDate: Date | undefined }) => void;
    };
