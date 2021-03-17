import React from 'react';
import { TooltipMenu, LabelledDropdown, SwitchButton, Text, DatePicker, Icon } from '../../generic';
import { customThemeType, useCustomTheme } from '../../../styles';
import { rectPositionType } from '../../../types';
import { wordings } from '../../../wordings';
import { filterType } from './filterType';

export { FilterTooltipMenu };

const TOOLTIP_MENU_WIDTH = 400;

const DROPDOWN_WIDTH = 280;

const DATE_DROPDOWN_WIDTH = 150;

function FilterTooltipMenu<filterNameT extends string>(props: {
  filters: filterType<filterNameT>[];
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
        {props.filters.map((filter) => (
          <div style={styles.filterContainer}>{renderFilter(filter)}</div>
        ))}
      </div>
    </TooltipMenu>
  );

  function renderFilter(filter: filterType<filterNameT>) {
    switch (filter.kind) {
      case 'dropdown':
        return (
          <LabelledDropdown<string>
            defaultValue={filter.value}
            items={filter.possibleValues.map((userName) => ({ text: userName, value: userName }))}
            label={filter.label}
            onChange={filter.onChange}
            width={DROPDOWN_WIDTH}
          />
        );

      case 'boolean':
        return (
          <div style={styles.switchFilter}>
            <Text>{filter.label}</Text>
            <SwitchButton onChange={filter.onToggle} checked={filter.checked} color="primary" />
          </div>
        );

      case 'dateInterval':
        return (
          <div style={styles.dateIntervalContainer}>
            <DatePicker
              onChange={filter.onChangeStartDate}
              value={filter.value.startDate}
              width={DATE_DROPDOWN_WIDTH}
              label={wordings.business.filters.intervalDate.start}
              parentRectPosition={props.rectPosition}
            />
            <Icon iconName="doubleArrow" />
            <DatePicker
              onChange={filter.onChangeEndDate}
              value={filter.value.endDate}
              width={DATE_DROPDOWN_WIDTH}
              label={wordings.business.filters.intervalDate.end}
              parentRectPosition={props.rectPosition}
            />
          </div>
        );
    }
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
      dateIntervalContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
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
