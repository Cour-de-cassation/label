import React, { MouseEvent, useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';
import { FilterTooltipMenu } from './FilterTooltipMenu';

export { FilterButton };

function FilterButton() {
  const theme = useCustomTheme();
  const [tooltipMenuRectPosition, setTooltipMenuRectPosition] = useState<rectPositionType | undefined>(undefined);

  return (
    <>
      {!!tooltipMenuRectPosition && <FilterTooltipMenu onClose={closeToolTip} rectPosition={tooltipMenuRectPosition} />}
      <ButtonWithIcon onClick={openToolTip} iconName="filter" text={wordings.treatmentsPage.table.filter.title} />
    </>
  );

  function openToolTip(event: MouseEvent<Element>) {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const rectPosition = { left: `${buttonRect.x}px`, top: `${buttonRect.y + buttonRect.height + theme.spacing}px` };
    setTooltipMenuRectPosition(rectPosition);
  }

  function closeToolTip() {
    setTooltipMenuRectPosition(undefined);
  }
}
