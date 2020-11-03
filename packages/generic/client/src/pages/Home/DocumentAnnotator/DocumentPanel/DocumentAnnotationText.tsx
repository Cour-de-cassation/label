import React, { ReactElement, MouseEvent } from 'react';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useAnchorElementUnderMouse } from '../../../../utils';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
}): ReactElement {
  const style = buildStyle();
  const { anchorElementUnderMouse, setAnchorElementUnderMouse } = useAnchorElementUnderMouse();

  return (
    <span>
      <span onClick={openTooltipMenu} style={style.annotationText}>
        {props.isAnonymizedView ? props.anonymizer.anonymize(props.annotation) : props.annotation.text}
      </span>
      <AnnotationTooltipMenu
        anchorAnnotation={anchorElementUnderMouse}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={props.isAnonymizedView}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function openTooltipMenu(event: MouseEvent<Element>) {
    setAnchorElementUnderMouse(event);
  }

  function closeTooltipMenu() {
    setAnchorElementUnderMouse(undefined);
  }

  function buildStyle() {
    return {
      annotationText: {
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          props.annotation.category,
          props.annotatorStateHandler.get().settings,
        ),
        cursor: 'pointer',
        padding: '0px 2px',
        borderRadius: '3px',
      },
    };
  }
}
