import React, { ReactElement, useState, MouseEvent } from 'react';
import { annotationModule, fetchedAnnotationType } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useAnchorElementUnderMouse } from '../../../../utils';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';
import { useDocumentViewerMode } from './documentViewerMode';

export { DocumentText };

function DocumentText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  index: number;
  text: string;
}): ReactElement {
  const { anchorElementUnderMouse, setAnchorElementUnderMouse } = useAnchorElementUnderMouse();
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');
  const { documentViewerModeHandler } = useDocumentViewerMode();
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <span>
      <span onMouseUp={handleSelection}>{props.text}</span>
      <AnnotationCreationTooltipMenu
        anchorText={anchorElementUnderMouse}
        annotatorStateHandler={props.annotatorStateHandler}
        annotationText={selectedText}
        annotationIndex={selectedTextIndex}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function handleSelection(event: MouseEvent<Element>) {
    const selection = window.getSelection();

    if (!selection || !isValidSelection(selection)) {
      closeTooltipMenu();
      return;
    }

    if (documentViewerModeHandler.documentViewerMode.kind === 'resize') {
      setSelectedText('');
      setSelectedTextIndex(0);
      resizeAnnotation(selection, documentViewerModeHandler.documentViewerMode.annotationId);
      documentViewerModeHandler.resetViewerMode();
    } else {
      setSelectedText(selection.toString());
      setSelectedTextIndex(computeSelectedTextIndex(selection));
      openTooltipMenu(event);
    }
  }

  function isValidSelection(selection: Selection) {
    return (
      selection.anchorOffset !== selection.focusOffset &&
      selection.anchorNode?.nodeValue === selection.focusNode?.nodeValue
    );
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setAnchorElementUnderMouse(event);
  }

  function closeTooltipMenu() {
    setAnchorElementUnderMouse(undefined);
  }

  function computeSelectedTextIndex(selection: Selection) {
    return Math.min(selection.anchorOffset, selection.focusOffset) + props.index;
  }

  function resizeAnnotation(selection: Selection, annotationId: fetchedAnnotationType['_id']) {
    const selectedText = selection.toString();
    const selectedTextIndex = computeSelectedTextIndex(selection);

    const newAnnotations = annotationModule.lib.fetchedAnnotationHandler.updateOneText(
      annotatorState.annotations,
      annotationId,
      selectedText,
      selectedTextIndex,
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
