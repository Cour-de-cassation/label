import React, { ReactElement, useState, MouseEvent } from 'react';
import { positionType } from 'pelta-design-system';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';
import { computeMultilineSelection, textNeighboursType } from '../lib';

export { PureDocumentText as DocumentText };

export type { textSelectionType };

type textSelectionType = Array<{
  index: number;
  text: string;
}>;

type propsType = { neighbours: textNeighboursType };

class PureDocumentText extends React.Component<propsType> {
  shouldComponentUpdate(nextProps: propsType) {
    return (
      nextProps.neighbours.current.index !== this.props.neighbours.current.index ||
      nextProps.neighbours.current.text !== this.props.neighbours.current.text
    );
  }

  render() {
    return <DocumentText neighbours={this.props.neighbours} />;
  }
}

function DocumentText(props: propsType): ReactElement {
  const [textSelection, setTextSelection] = useState<textSelectionType>([]);
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>();

  const styles = buildStyles();
  return (
    <span>
      <span onMouseUp={handleSelection} style={styles.text}>
        {props.neighbours.current.text}
      </span>
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
    if (
      !anchorNodeValue ||
      !focusNodeValue ||
      !selectionText ||
      !selectionText.trim() ||
      selection.anchorOffset === selection.focusOffset
    ) {
      return [];
    }
    if (anchorNodeValue === focusNodeValue) {
      return [{ text: selectionText.trim(), index: computeSelectedTextIndex(selection) }];
    }

    const multilineSelection = computeMultilineSelection(
      selectionText.trim(),
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

function buildStyles() {
  return {
    text: {
      whiteSpace: 'break-spaces',
    },
  } as const;
}
