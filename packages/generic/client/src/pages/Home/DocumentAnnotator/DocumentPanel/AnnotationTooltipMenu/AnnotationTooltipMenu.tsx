import React, { ReactElement } from 'react';
import { fetchedAnnotationType } from '@label/core';
import {
  LayoutGrid,
  FloatingTooltipMenu,
  ComponentsList,
  LinkAnnotationDropdown,
  UnlinkAnnotationDropdown,
} from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { clientAnonymizerType, positionType } from '../../../../../types';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryDropdown } from './ChangeAnnotationCategoryDropdown';
import { DeleteAnnotationDropdown } from './DeleteAnnotationDropdown';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
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
          <AnnotationTooltipMenuHeader
            annotation={props.annotation}
            anonymizer={props.anonymizer}
            isAnonymizedView={props.isAnonymizedView}
          />
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
            <ChangeAnnotationCategoryDropdown annotation={props.annotation} />,
            <LinkAnnotationDropdown context="tooltip_update" annotation={props.annotation} />,
            <UnlinkAnnotationDropdown annotation={props.annotation} context="tooltip_update" />,
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
