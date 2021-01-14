import React, { ReactElement, useState, MouseEvent } from 'react';
import { positionType } from '../../../../types';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';

export { DocumentText };

function DocumentText(props: { index: number; text: string }): ReactElement {
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>();
  return (
    <span>
      <span onMouseUp={handleSelection}>{props.text}</span>
      {tooltipMenuOriginPosition && (
        <AnnotationCreationTooltipMenu
          annotationText={selectedText}
          annotationIndex={selectedTextIndex}
          onClose={closeTooltipMenu}
          originPosition={tooltipMenuOriginPosition}
        />
      )}
    </span>
  );

  function handleSelection(event: MouseEvent<Element>) {
    const selection = window.getSelection();

    if (!selection || !isValidSelection(selection)) {
      closeTooltipMenu();
      return;
    }

    setSelectedText(selection.toString());
    setSelectedTextIndex(computeSelectedTextIndex(selection));
    openTooltipMenu(event);
  }

  function isValidSelection(selection: Selection) {
    return (
      selection.anchorOffset !== selection.focusOffset &&
      selection.anchorNode?.nodeValue === selection.focusNode?.nodeValue
    );
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setTooltipMenuOriginPosition({ x: event.clientX, y: event.clientY });
  }

  function closeTooltipMenu() {
    setTooltipMenuOriginPosition(undefined);
  }

  function computeSelectedTextIndex(selection: Selection) {
    return Math.min(selection.anchorOffset, selection.focusOffset) + props.index;
  }
}
