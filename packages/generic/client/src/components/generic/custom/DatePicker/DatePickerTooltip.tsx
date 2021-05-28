import React, { useState } from 'react';
import { range } from 'lodash';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';
import { Icon, Text } from '../../materialUI';
import { TooltipMenu } from '../TooltipMenu';
import { getMonthFromDate, getNextMonthDate, getPreviousMonthDate } from './lib';
import { createCalendarTable } from './lib/createCalendarTable';

export { DatePickerTooltip };

export type { momentOfTheDayType };

const TOOLTIP_WIDTH = 300;

const dayOfTheWeekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

type momentOfTheDayType = 'beginning' | 'end';

function DatePickerTooltip(props: {
  value: Date | undefined;
  momentOfTheDay: momentOfTheDayType;
  onChange: (value: Date) => void;
  rectPosition: rectPositionType;
  onClose: () => void;
}) {
  const styles = buildStyles();
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
        {week.map((dayOfMonth) =>
          dayOfMonth ? (
            <td>
              <div style={styles.dayContainer} onClick={() => changeDate({ year, month, dayOfMonth })}>
                <Text>{dayOfMonth}</Text>
              </div>
            </td>
          ) : (
            <td />
          ),
        )}
      </tr>
    ));

    return calendar;
  }

  function changeDate({ year, month, dayOfMonth }: { year: number; month: number; dayOfMonth: number }) {
    const { hours, minutes, seconds } = computeTimeFromMomentOfTheDay(props.momentOfTheDay);
    const date = new Date(year, month, dayOfMonth, hours, minutes, seconds);
    props.onChange(date);
    props.onClose();
  }
}

function computeTimeFromMomentOfTheDay(momentOfTheDay: momentOfTheDayType) {
  switch (momentOfTheDay) {
    case 'beginning':
      return { hours: 0, minutes: 0, seconds: 0 };
    case 'end':
      return { hours: 23, minutes: 59, seconds: 59 };
  }
}

function buildStyles() {
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
  } as const;
}
