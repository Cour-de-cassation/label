import React from 'react';
import { TooltipMenu, LabelledDropdown } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';

export { FilterTooltipMenu, DEFAULT_TREATMENT_FILTER };

export type { treatmentFilterType, treatmentFilterInfoType };

const TOOLTIP_MENU_WIDTH = 400;

const DROPDOWN_WIDTH = 280;

type treatmentFilterInfoType = {
  userNames: string[];
};

type treatmentFilterType = {
  userName: string | undefined;
};

const DEFAULT_TREATMENT_FILTER = {
  userName: undefined,
};

function FilterTooltipMenu(props: {
  filters: treatmentFilterType;
  setFilters: (filters: treatmentFilterType) => void;
  filterInfo: treatmentFilterInfoType;
  onClose: () => void;
  rectPosition: rectPositionType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <TooltipMenu
      rectPosition={props.rectPosition}
      shouldCloseWhenClickedAway
      onClose={props.onClose}
      width={TOOLTIP_MENU_WIDTH}
    >
      <div style={styles.container}>
        <LabelledDropdown<treatmentFilterInfoType['userNames'][number]>
          items={props.filterInfo.userNames.map((userName) => ({ text: userName, value: userName }))}
          label={wordings.treatmentsPage.table.filter.fields.agents}
          onChange={updateUserNameFilter}
          width={DROPDOWN_WIDTH}
        />
      </div>
    </TooltipMenu>
  );

  function updateUserNameFilter(userName: string) {
    props.setFilters({ ...props.filters, userName });
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
      },
      button: {
        alignSelf: 'flex-end',
        padding: `${theme.spacing}px ${theme.spacing * 2}px`,
      },
    } as const;
  }
}
