import React, { ReactElement } from 'react';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { LayoutGrid, TooltipMenu } from '../../../../../components';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { AnnotationTooltipMenuHeader } from './AnnotationTooltipMenuHeader';

export { AnnotationTooltipSummary };

const ANNOTATION_TOOLTIP_SUMMARY_WIDTH = 300;

function AnnotationTooltipSummary(props: {
  anchorAnnotation: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
  onClickOnAnchorAnnotation: () => void;
  onClose: () => void;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <TooltipMenu
      anchorElement={props.anchorAnnotation}
      hover
      onClickOnAnchorElement={props.onClickOnAnchorAnnotation}
      onClose={props.onClose}
      style={style.tooltip}
    >
      <LayoutGrid container alignItems="center" style={style.tooltipItem}>
        <AnnotationTooltipMenuHeader
          annotatorStateHandler={props.annotatorStateHandler}
          annotation={props.annotation}
          anonymizer={props.anonymizer}
          isAnonymizedView={props.isAnonymizedView}
        />
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle(theme: customThemeType) {
    return {
      tooltip: {
        zIndex: 1,
      },
      tooltipItem: {
        maxWidth: ANNOTATION_TOOLTIP_SUMMARY_WIDTH,
        padding: `${theme.spacing}px 0px`,
      },
    };
  }
}
