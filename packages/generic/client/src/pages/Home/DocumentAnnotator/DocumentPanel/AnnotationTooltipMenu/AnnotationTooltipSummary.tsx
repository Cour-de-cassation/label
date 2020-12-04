import React, { ReactElement } from 'react';
import { fetchedAnnotationType } from '@label/core';
import { LayoutGrid, FloatingTooltipMenu } from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../../types';
import { mousePositionType } from '../../../../../utils';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';

export { AnnotationTooltipSummary };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipSummary(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
  isAnonymizedView: boolean;
  isOpen: boolean;
  mousePosition: mousePositionType;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <FloatingTooltipMenu isOpen={props.isOpen} mousePosition={props.mousePosition}>
      <LayoutGrid container alignItems="center" style={style.tooltipItem}>
        <AnnotationTooltipMenuHeader
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.annotation}
          anonymizer={props.anonymizer}
          isAnonymizedView={props.isAnonymizedView}
        />
      </LayoutGrid>
    </FloatingTooltipMenu>
  );

  function buildStyle(theme: customThemeType) {
    return {
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_SUMMARY_WIDTH,
        padding: `${theme.spacing}px 0px`,
      },
    };
  }
}
