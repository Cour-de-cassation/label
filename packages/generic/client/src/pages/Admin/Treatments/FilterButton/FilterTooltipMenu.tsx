import React from 'react';
import { TooltipMenu, LabelledDropdown, SwitchButton, Text, DatePicker, Icon } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';

export { FilterTooltipMenu, DEFAULT_TREATMENT_FILTER };

export type { treatmentFilterType, treatmentFilterInfoType };

const TOOLTIP_MENU_WIDTH = 400;

const DROPDOWN_WIDTH = 280;

const DATE_DROPDOWN_WIDTH = 150;

type treatmentFilterInfoType = {
  userNames: string[];
};

type treatmentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  userName: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

const DEFAULT_TREATMENT_FILTER = {
  startDate: undefined,
  endDate: undefined,
  userName: undefined,
  mustHaveSurAnnotations: false,
  mustHaveSubAnnotations: false,
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
        <div style={styles.filterContainer}>
          <DatePicker
            onChange={updateStartDateFilter}
            value={props.filters.startDate}
            width={DATE_DROPDOWN_WIDTH}
            label={wordings.treatmentsPage.table.filter.fields.startDate}
            parentRectPosition={props.rectPosition}
          />
          <Icon iconName="doubleArrow" />
          <DatePicker
            onChange={updateEndDateFilter}
            value={props.filters.endDate}
            width={DATE_DROPDOWN_WIDTH}
            label={wordings.treatmentsPage.table.filter.fields.endDate}
            parentRectPosition={props.rectPosition}
          />
        </div>
        <div style={styles.filterContainer}>
          <LabelledDropdown<treatmentFilterInfoType['userNames'][number]>
            defaultValue={props.filters.userName}
            items={props.filterInfo.userNames.map((userName) => ({ text: userName, value: userName }))}
            label={wordings.treatmentsPage.table.filter.fields.agents}
            onChange={updateUserNameFilter}
            width={DROPDOWN_WIDTH}
          />
        </div>
        <div style={styles.filterContainer}>
          <div style={styles.switchFilter}>
            <Text>{wordings.treatmentsPage.table.filter.fields.mustHaveSubAnnotations}</Text>
            <SwitchButton
              onChange={updateMustHaveSubAnnotationsFilter}
              checked={!!props.filters.mustHaveSubAnnotations}
              color="primary"
            />
          </div>
        </div>
        <div style={styles.filterContainer}>
          <div style={styles.switchFilter}>
            <Text>{wordings.treatmentsPage.table.filter.fields.mustHaveSurAnnotations}</Text>
            <SwitchButton
              onChange={updateMustHaveSurAnnotationsFilter}
              checked={!!props.filters.mustHaveSurAnnotations}
              color="primary"
            />
          </div>
        </div>
      </div>
    </TooltipMenu>
  );

  function updateUserNameFilter(userName: string) {
    props.setFilters({ ...props.filters, userName });
  }

  function updateStartDateFilter(startDate: Date) {
    props.setFilters({
      ...props.filters,
      startDate,
    });
  }

  function updateEndDateFilter(endDate: Date) {
    props.setFilters({
      ...props.filters,
      endDate,
    });
  }

  function updateMustHaveSubAnnotationsFilter() {
    props.setFilters({
      ...props.filters,
      mustHaveSubAnnotations: !props.filters.mustHaveSubAnnotations,
    });
  }

  function updateMustHaveSurAnnotationsFilter() {
    props.setFilters({
      ...props.filters,
      mustHaveSurAnnotations: !props.filters.mustHaveSurAnnotations,
    });
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
      filterContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        marginTop: theme.spacing * 2,
        justifyContent: 'space-between',
      },
      switchFilter: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    } as const;
  }
}
