import React, { ReactElement, useState, MouseEvent } from 'react';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useAnchorElementUnderMouse } from '../../../../utils';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';

export { DocumentText };

function DocumentText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  index: number;
  text: string;
}): ReactElement {
  const { anchorElementUnderMouse, setAnchorElementUnderMouse } = useAnchorElementUnderMouse();
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');

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

    setSelectedText(selection.toString());
    setSelectedTextIndex(Math.min(selection.anchorOffset, selection.focusOffset) + props.index);
    openTooltipMenu(event);
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
}
