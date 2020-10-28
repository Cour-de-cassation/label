import React, { ReactElement, useState, MouseEvent } from 'react';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useAnchorElementUnderMouse } from '../../../../utils';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';

export { DocumentText };

function DocumentText(props: { annotatorStateHandler: annotatorStateHandlerType; text: string }): ReactElement {
  const { anchorElementUnderMouse, setAnchorElementUnderMouse } = useAnchorElementUnderMouse();
  const [selectedText, setSelectedText] = useState<string>('');

  return (
    <span>
      <span onMouseUp={handleSelection}>{props.text}</span>
      <AnnotationCreationTooltipMenu
        anchorText={anchorElementUnderMouse}
        annotatorStateHandler={props.annotatorStateHandler}
        onClose={closeTooltipMenu}
        text={selectedText}
      />
    </span>
  );

  function handleSelection(event: MouseEvent<Element>) {
    const selection = window.getSelection();

    if (!selection || selection.anchorOffset === selection.focusOffset) {
      closeTooltipMenu();
      return;
    }

    setSelectedText(selection.toString());
    openTooltipMenu(event);
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setAnchorElementUnderMouse(event);
  }

  function closeTooltipMenu() {
    setAnchorElementUnderMouse(undefined);
  }
}
