import React, { ReactElement, useState, MouseEvent } from 'react';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
}): ReactElement {
  const style = buildStyle();
  const [anchorAnnotation, setAnchorAnnotation] = useState<Element | undefined>(undefined);

  return (
    <span>
      <span onClick={openTooltipMenu} style={style.annotationText}>
        {props.isAnonymizedView ? props.anonymizer.anonymize(props.annotation) : props.annotation.text}
      </span>
      <AnnotationTooltipMenu
        anchorAnnotation={anchorAnnotation}
        annotatorStateHandler={props.annotatorStateHandler}
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

  function buildStyle() {
    return {
      annotationText: {
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          props.annotation.category,
          props.annotatorStateHandler.get().settings,
        ),
        cursor: 'pointer',
        padding: '0px 5px',
      },
    };
  }
}
