import React, { ReactElement } from 'react';
import {
  customThemeType,
  useCustomTheme,
  FloatingTooltipMenu,
  ComponentsList,
  positionType,
} from 'pelta-design-system';
import { annotationType } from '@label/core';
import {
  ChangeAnnotationCategoryDropdown,
  LinkAnnotationDropdown,
  UnlinkAnnotationDropdown,
} from '../../../../../components';
import { clientAnonymizerType } from '../../../../../types';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { DeleteAnnotationDropdown } from './DeleteAnnotationDropdown';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  annotation: annotationType;
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
        <AnnotationTooltipMenuHeader
          annotation={props.annotation}
          anonymizer={props.anonymizer}
          isAnonymizedView={props.isAnonymizedView}
        />
        {renderAnnotationButtons()}
      </>
    </FloatingTooltipMenu>
  );

  function renderAnnotationButtons() {
    if (!props.isExpanded) {
      return null;
    }

    return (
      <div style={style.annotationButtonsContainer}>
        <ComponentsList
          components={[
            <ChangeAnnotationCategoryDropdown annotation={props.annotation} origin="document" />,
            <LinkAnnotationDropdown annotation={props.annotation} origin="document" />,
            <UnlinkAnnotationDropdown annotation={props.annotation} origin="document" />,
            <DeleteAnnotationDropdown annotation={props.annotation} onClose={props.onClose} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </div>
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
