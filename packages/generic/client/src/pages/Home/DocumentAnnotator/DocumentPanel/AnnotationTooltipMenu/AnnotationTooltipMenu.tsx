import React, { ReactElement } from 'react';
import { annotationType } from '@label/core';
import {
  LayoutGrid,
  FloatingTooltipMenu,
  ComponentsList,
  ChangeAnnotationCategoryDropdown,
  LinkAnnotationDropdown,
  UnlinkAnnotationDropdown,
} from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { positionType } from '../../../../../types';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { DeleteAnnotationDropdown } from './DeleteAnnotationDropdown';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  annotation: annotationType;
  closesOnBackdropClick: boolean;
  isAnonymizedView: boolean;
  isExpanded: boolean;
  onClose: () => void;
  originPosition: positionType;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <FloatingTooltipMenu
      onClose={props.onClose}
      shouldCloseWhenClickedAway={props.isExpanded}
      originPosition={props.originPosition}
      width={ANNOTATION_TOOLTIP_SUMMARY_WIDTH}
    >
      <>
        <LayoutGrid container>
          <AnnotationTooltipMenuHeader annotation={props.annotation} isAnonymizedView={props.isAnonymizedView} />
        </LayoutGrid>
        {renderAnnotationButtons()}
      </>
    </FloatingTooltipMenu>
  );

  function renderAnnotationButtons() {
    if (!props.isExpanded) {
      return null;
    }

    return (
      <LayoutGrid container style={style.annotationButtonsContainer}>
        <ComponentsList
          components={[
            <ChangeAnnotationCategoryDropdown annotation={props.annotation} origin="document" />,
            <LinkAnnotationDropdown annotation={props.annotation} origin="document" />,
            <UnlinkAnnotationDropdown annotation={props.annotation} origin="document" />,
            <DeleteAnnotationDropdown annotation={props.annotation} onClose={props.onClose} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </LayoutGrid>
    );
  }

  function buildStyle(theme: customThemeType) {
    return {
      annotationButtonsContainer: {
        paddingTop: `${theme.spacing * 3}px`,
      },
    };
  }
}
