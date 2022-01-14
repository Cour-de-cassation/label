import React from 'react';
import { dateType } from '@label/core';
import { TooltipMenu, LabelledDropdown, SwitchButton, Text, DatePicker, Icon } from '../../generic';
import { customThemeType, useCustomTheme } from '../../../styles';
import { rectPositionType } from '../../../types';
import { filterType } from './filterType';
import { buildComputeIsDateAvailable } from './lib';

export { FilterTooltipMenu };

const TOOLTIP_MENU_WIDTH = 400;
const TOOLTIP_MENU_MAX_HEIGHT = 500;

const DROPDOWN_WIDTH = 280;

const DATE_DROPDOWN_WIDTH = 150;

function FilterTooltipMenu(props: { filters: filterType[]; onClose: () => void; rectPosition: rectPositionType }) {
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

  function renderFilter(filter: filterType) {
    switch (filter.kind) {
      case 'dropdown':
        return (
          <LabelledDropdown<string>
            defaultValue={filter.value}
            items={filter.possibleValues.map((value) => ({
              text: filter.computeReadableValue ? filter.computeReadableValue(value) : value,
              value,
            }))}
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
        const computeIsDateAvailable = buildComputeIsDateAvailable(filter.extremumAvailableDates);
        return (
          <div style={styles.dateIntervalContainer}>
            <DatePicker
              isDisabled={!filter.extremumAvailableDates.min}
              onChange={buildOnStartDateChange(filter.onChange, filter.value.endDate)}
              value={filter.value.startDate}
              width={DATE_DROPDOWN_WIDTH}
              label={filter.labelStart}
              parentRectPosition={props.rectPosition}
              computeIsDateAvailable={computeIsDateAvailable}
            />
            <Icon iconName="doubleArrow" />
            <DatePicker
              isDisabled={!filter.extremumAvailableDates.max}
              onChange={buildOnEndDateChange(filter.onChange, filter.value.startDate)}
              value={filter.value.endDate}
              width={DATE_DROPDOWN_WIDTH}
              label={filter.labelEnd}
              parentRectPosition={props.rectPosition}
              computeIsDateAvailable={computeIsDateAvailable}
            />
          </div>
        );
    }
  }

  function buildOnEndDateChange(
    onFilterChange: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => void,
    currentStartDate: Date | undefined,
  ) {
    return (date: dateType) => {
      const endDate = new Date(date.year, date.month, date.dayOfMonth, 23, 59, 59);
      onFilterChange({ endDate, startDate: currentStartDate });
    };
  }

  function buildOnStartDateChange(
    onFilterChange: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => void,
    currentEndDate: Date | undefined,
  ) {
    return (date: dateType) => {
      const startDate = new Date(date.year, date.month, date.dayOfMonth, 0, 0, 1);
      onFilterChange({ startDate, endDate: currentEndDate });
    };
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        maxHeight: TOOLTIP_MENU_MAX_HEIGHT,
        overflowX: 'scroll',
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
