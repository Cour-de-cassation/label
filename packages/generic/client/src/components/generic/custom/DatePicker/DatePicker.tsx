import React, { MouseEvent, useState } from 'react';
import { timeOperator } from '@label/core';
import { rectPositionType } from '../../../../types';
import { DropdownButton } from '../DropdownButton';
import { DatePickerTooltip, momentOfTheDayType } from './DatePickerTooltip';

export { DatePicker };

function DatePicker(props: {
  momentOfTheDay: momentOfTheDayType;
  onChange: (date: Date) => void;
  value: Date | undefined;
  label: string;
  width?: number;
  parentRectPosition?: rectPositionType;
}) {
  const [tooltipMenuRectPosition, setTooltipMenuRectPosition] = useState<rectPositionType | undefined>();
  const isDatePickerOpen = !!tooltipMenuRectPosition;
  const item = props.value
    ? {
        text: timeOperator.convertTimestampToReadableDate(props.value.getTime(), false),
        value: props.value.getTime().toString(),
      }
    : undefined;

  return (
    <>
      <DropdownButton
        isOpen={isDatePickerOpen}
        label={props.label}
        item={item}
        onClick={openToolTip}
        width={props.width}
      />
      {!!tooltipMenuRectPosition && (
        <DatePickerTooltip
          momentOfTheDay={props.momentOfTheDay}
          value={props.value}
          onChange={props.onChange}
          rectPosition={tooltipMenuRectPosition}
          onClose={closeToolTip}
        />
      )}
    </>
  );

  function openToolTip(event: MouseEvent<Element>) {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const left =
      props.parentRectPosition && props.parentRectPosition.left
        ? `calc(${buttonRect.left}px - ${props.parentRectPosition.left}`
        : `${buttonRect.left}px`;
    const top =
      props.parentRectPosition && props.parentRectPosition.top
        ? `calc(${buttonRect.top}px - ${props.parentRectPosition.top} + ${buttonRect.height}px)`
        : `${buttonRect.top + buttonRect.height}px`;
    setTooltipMenuRectPosition({
      left,
      top,
    });
  }

  function closeToolTip() {
    setTooltipMenuRectPosition(undefined);
  }
}
