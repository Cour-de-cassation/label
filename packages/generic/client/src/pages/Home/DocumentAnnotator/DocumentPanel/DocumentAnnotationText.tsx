import React, { ReactElement, useState, MouseEvent } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { anonymizerType } from '@label/core';
import { Button } from '../../../../components';
import { annotatorStateType } from '../../../../services/annotatorState';
import { getAnnotationCategoryColor } from '../../../../styles';
import { fetchedAnnotationType } from '../../../../types';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorState: annotatorStateType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  const [anchorAnnotation, setAnchorAnnotation] = useState<Element | undefined>(undefined);

  return (
    <span>
      <Button onClick={openTooltipMenu} style={style.annotationText}>
        {props.isAnonymizedView ? props.anonymizer.anonymize(props.annotation) : props.annotation.text}
      </Button>
      <AnnotationTooltipMenu
        anchorAnnotation={anchorAnnotation}
        annotatorState={props.annotatorState}
        annotation={props.annotation}
        open={isOpened()}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function isOpened() {
    return !!anchorAnnotation;
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setAnchorAnnotation(event.currentTarget);
  }

  function closeTooltipMenu() {
    setAnchorAnnotation(undefined);
  }

  function buildStyle(theme: Theme) {
    return {
      annotationText: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: getAnnotationCategoryColor(props.annotation.category, props.annotatorState.settings),
        padding: '0px 5px',
      },
    };
  }
}
