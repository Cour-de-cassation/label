import React, { ReactElement, useState, MouseEvent } from 'react';
import { positionType } from '../../../../types';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';
import { computeMultilineSelection, textNeighboursType } from '../lib';

export { DocumentText };

export type { textSelectionType };

type textSelectionType = Array<{
  index: number;
  text: string;
}>;

function DocumentText(props: { neighbours: textNeighboursType }): ReactElement {
  const [textSelection, setTextSelection] = useState<textSelectionType>([]);
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>();
  return (
    <span>
      <span onMouseUp={handleSelection}>{props.neighbours.current.text}</span>
      {tooltipMenuOriginPosition && textSelection.length > 0 && (
        <AnnotationCreationTooltipMenu
          onClose={closeTooltipMenu}
          originPosition={tooltipMenuOriginPosition}
          textSelection={textSelection}
        />
      )}
    </span>
  );

  function handleSelection(event: MouseEvent<Element>) {
    const validSelection = getValidSelection(window.getSelection());
    if (!validSelection.length) {
      return;
    }

    setTextSelection(validSelection);
    openTooltipMenu(event);
  }

  function getValidSelection(selection: Selection | null) {
    if (!selection) {
      return [];
    }
    const anchorNodeValue = selection.anchorNode?.nodeValue;
    const focusNodeValue = selection.focusNode?.nodeValue;
    const selectionText = selection.toString();
    if (!anchorNodeValue || !focusNodeValue || !selectionText || selection.anchorOffset === selection.focusOffset) {
      return [];
    }
    if (anchorNodeValue === focusNodeValue) {
      return [{ text: selectionText, index: computeSelectedTextIndex(selection) }];
    }

    const multilineSelection = computeMultilineSelection(
      selectionText,
      props.neighbours,
      anchorNodeValue,
      focusNodeValue,
    );
    return multilineSelection;
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setTooltipMenuOriginPosition({ x: event.clientX, y: event.clientY });
  }

  function closeTooltipMenu() {
    setTooltipMenuOriginPosition(undefined);
  }

  function computeSelectedTextIndex(selection: Selection) {
    return Math.min(selection.anchorOffset, selection.focusOffset) + props.neighbours.current.index;
  }
}
