import React, { ReactElement } from 'react';
import { fetchedAnnotationType } from '@label/core';
import { LayoutGrid, FloatingTooltipMenu, ComponentsList, LinkAnnotationDropdown } from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType, positionType } from '../../../../../types';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';
import { ChangeAnnotationCategoryDropdown } from './ChangeAnnotationCategoryDropdown';
import { UnlinkAnnotationDropdown } from '../../AnnotationsPanel/CategoryTableEntry/UnlinkAnnotationDropdown';
import { DeleteAnnotationDropdown } from './DeleteAnnotationDropdown';

export { AnnotationTooltipMenu };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipMenu(props: {
  annotatorStateHandler: annotatorStateHandlerType;
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
    <FloatingTooltipMenu onClose={props.onClose} isExpanded={props.isExpanded} originPosition={props.originPosition}>
      <div>
        <LayoutGrid container alignItems="center" style={style.tooltipItem}>
          <AnnotationTooltipMenuHeader
            annotatorStateHandler={props.annotatorStateHandler}
            annotation={props.annotation}
            anonymizer={props.anonymizer}
            isAnonymizedView={props.isAnonymizedView}
          />
        </LayoutGrid>
        {renderAnnotationButtons()}
      </div>
    </FloatingTooltipMenu>
  );

  function renderAnnotationButtons() {
    if (!props.isExpanded) {
      return null;
    }

    return (
      <LayoutGrid container style={style.tooltipItem}>
        <ComponentsList
          components={[
            <ChangeAnnotationCategoryDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={props.annotation}
            />,
            <LinkAnnotationDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={props.annotation}
            />,
            <UnlinkAnnotationDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={props.annotation}
            />,
            <DeleteAnnotationDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={props.annotation}
              onClose={props.onClose}
            />,
          ]}
          spaceBetweenComponents={theme.spacing}
        />
      </LayoutGrid>
    );
  }

  function buildStyle(theme: customThemeType) {
    return {
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_SUMMARY_WIDTH,
        padding: `${theme.spacing}px 0px`,
      },
    };
  }
}
