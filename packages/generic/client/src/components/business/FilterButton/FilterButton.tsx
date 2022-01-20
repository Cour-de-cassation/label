import React, { MouseEvent, useState } from 'react';
import { useCustomTheme, ButtonWithIcon, rectPositionType } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { FilterTooltipMenu } from './FilterTooltipMenu';
import { filterType } from './filterType';

export { FilterButton };

const BUTTON_HEIGHT = 40;

function FilterButton(props: { filters: filterType[]; isLoading?: boolean }) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  const [tooltipMenuRectPosition, setTooltipMenuRectPosition] = useState<rectPositionType | undefined>(undefined);
  const filterCount = computeFilterCount();
  const buttonText = wordings.business.filters.button + (filterCount ? ` (${filterCount})` : '');

  return (
    <>
      {!!tooltipMenuRectPosition && (
        <FilterTooltipMenu filters={props.filters} onClose={closeToolTip} rectPosition={tooltipMenuRectPosition} />
      )}
      <ButtonWithIcon
        isLoading={props.isLoading}
        style={styles.button}
        onClick={openToolTip}
        iconName={!!tooltipMenuRectPosition ? 'minus' : 'plus'}
        text={buttonText}
      />
    </>
  );

  function computeFilterCount() {
    return props.filters.reduce((accumulator, filter) => {
      switch (filter.kind) {
        case 'boolean':
          return filter.checked ? accumulator + 1 : accumulator;
        case 'dropdown':
          return filter.value ? accumulator + 1 : accumulator;
        case 'dateInterval':
          return !!filter.value.startDate || !!filter.value.endDate ? accumulator + 1 : 0;
      }
    }, 0);
  }

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
