import React, { useState } from 'react';
import { timeOperator } from '../../../../services/timeOperator';
import { rectPositionType } from '../../../../types';
import { DropdownButton } from '../DropdownButton';
import { DatePickerTooltip } from './DatePickerTooltip';

export { DatePicker };

function DatePicker(props: { onChange: (date: Date) => void; value: Date | undefined; label: string; width?: number }) {
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
          value={props.value}
          onChange={props.onChange}
          rectPosition={tooltipMenuRectPosition}
          onClose={closeToolTip}
        />
      )}
    </>
  );

  function openToolTip() {
    setTooltipMenuRectPosition({});
  }

  function closeToolTip() {
    setTooltipMenuRectPosition(undefined);
  }
}
