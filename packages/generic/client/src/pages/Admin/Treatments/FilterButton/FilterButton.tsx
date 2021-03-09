import React, { MouseEvent, useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { useCustomTheme } from '../../../../styles';
import { rectPositionType } from '../../../../types';
import { wordings } from '../../../../wordings';
import { treatmentFilterInfoType, treatmentFilterType, FilterTooltipMenu } from './FilterTooltipMenu';

export { FilterButton };

const BUTTON_HEIGHT = 40;

function FilterButton(props: {
  filters: treatmentFilterType;
  setFilters: (filters: treatmentFilterType) => void;
  filterInfo: treatmentFilterInfoType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  const [tooltipMenuRectPosition, setTooltipMenuRectPosition] = useState<rectPositionType | undefined>(undefined);
  const filtersCount = Object.values(props.filters).filter(Boolean).length;
  const buttonText = wordings.treatmentsPage.table.filter.title + (filtersCount ? ` (${filtersCount})` : '');

  return (
    <>
      {!!tooltipMenuRectPosition && (
        <FilterTooltipMenu
          filters={props.filters}
          setFilters={props.setFilters}
          filterInfo={props.filterInfo}
          onClose={closeToolTip}
          rectPosition={tooltipMenuRectPosition}
        />
      )}
      <ButtonWithIcon
        style={styles.button}
        onClick={openToolTip}
        iconName={!!tooltipMenuRectPosition ? 'minus' : 'plus'}
        text={buttonText}
      />
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

  function buildStyles() {
    return {
      button: {
        height: BUTTON_HEIGHT,
      },
    };
  }
}
