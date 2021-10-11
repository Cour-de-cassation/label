import React, { useState } from 'react';
import { range } from 'lodash';
import { dateType } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';
import { Icon, Text } from '../../materialUI';
import { TooltipMenu } from '../TooltipMenu';
import { getMonthFromDate, getNextMonthDate, getPreviousMonthDate } from './lib';
import { createCalendarTable } from './lib/createCalendarTable';

export { DatePickerTooltip };

const TOOLTIP_WIDTH = 300;

const dayOfTheWeekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function DatePickerTooltip(props: {
  value: Date | undefined;
  computeIsDateAvailable: (date: dateType) => boolean;
  onChange: (value: dateType) => void;
  rectPosition: rectPositionType;
  onClose: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const now = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    props.value || new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  );

  return (
    <TooltipMenu
      rectPosition={props.rectPosition}
      shouldCloseWhenClickedAway
      onClose={props.onClose}
      width={TOOLTIP_WIDTH}
    >
      <div style={styles.tooltipContent}>
        <div style={styles.header}>
          <div style={styles.arrowContainer} onClick={() => setCurrentDate(getPreviousMonthDate(currentDate))}>
            <Icon iconName="arrowLeft" />
          </div>
          <Text>
            {getMonthFromDate(currentDate)}/{currentDate.getFullYear()}
          </Text>
          <div style={styles.arrowContainer} onClick={() => setCurrentDate(getNextMonthDate(currentDate))}>
            <Icon iconName="arrowRight" />
          </div>
        </div>
        <table style={styles.daysTable}>
          <tr>
            {range(7).map((day) => (
              <td key={day}>
                <Text>{wordings.shared.daysOfWeek[dayOfTheWeekKeys[day]]}</Text>
              </td>
            ))}
          </tr>
          {renderCalendar(currentDate.getFullYear(), currentDate.getMonth())}
        </table>
      </div>
    </TooltipMenu>
  );

  function renderCalendar(year: number, month: number) {
    const calendarTable = createCalendarTable(year, month);
    const calendar = calendarTable.map((week) => (
      <tr>
        {week.map((dayOfMonth) => {
          if (dayOfMonth === undefined) {
            return <td />;
          }
          const isDateAvailable = props.computeIsDateAvailable({ year, month, dayOfMonth });
          return (
            <td>
              <div
                style={{
                  ...styles.dayContainer,
                  ...(isDateAvailable ? undefined : styles.unavailableDayContainer),
                }}
                onClick={isDateAvailable ? () => changeDate({ year, month, dayOfMonth }) : undefined}
              >
                <Text>{dayOfMonth}</Text>
              </div>
            </td>
          );
        })}
      </tr>
    ));

    return calendar;
  }

  function changeDate(date: dateType) {
    props.onChange(date);
    props.onClose();
  }
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    arrowContainer: {
      cursor: 'pointer',
    },
    tooltipContent: {
      display: 'flex',
      flexDirection: 'column',
    },
    daysTable: { width: '100%' },
    dayContainer: {
      cursor: 'pointer',
    },
    unavailableDayContainer: {
      color: theme.colors.disabled.color,
      cursor: 'default',
    },
  } as const;
}
