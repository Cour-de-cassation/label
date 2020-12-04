import React, { ReactElement, useState } from 'react';
import { fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { getColor, useDisplayMode } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { MouseMoveListener, useMousePosition } from '../../../../utils';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';
import { AnnotationTooltipSummary } from './AnnotationTooltipMenu/AnnotationTooltipSummary';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
}): ReactElement {
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [isSummaryTooltipOpen, setIsSummaryTooltipOpen] = useState(false);
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const { displayMode } = useDisplayMode();
  const mouseMoveHandler = useMousePosition();
  const style = buildStyle();

  return (
    <span>
      <MouseMoveListener
        onClick={(event) => openTooltipMenu(event.currentTarget)}
        onMouseEnter={openTooltipSummary}
        onMouseLeave={closeTooltipSummary}
        mouseMoveHandler={mouseMoveHandler}
      >
        <span style={style.annotationText}>
          {documentViewerModeHandler.isAnonymizedView()
            ? props.anonymizer.anonymize(props.annotation)
            : props.annotation.text}
        </span>
      </MouseMoveListener>

      <AnnotationTooltipSummary
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={documentViewerModeHandler.isAnonymizedView()}
        isOpen={isSummaryTooltipOpen}
        mousePosition={mouseMoveHandler.mousePosition}
      />
      <AnnotationTooltipMenu
        anchorAnnotation={anchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={documentViewerModeHandler.isAnonymizedView()}
        onClose={closeTooltipMenu}
      />
    </span>
  );

  function buildStyle() {
    const viewerModeSpecificStyle = buildViewerModeSpecificStyle();
    return {
      annotationText: {
        cursor: 'pointer',
        padding: '0px 2px',
        borderRadius: '3px',
        ...viewerModeSpecificStyle,
      },
    };

    function buildViewerModeSpecificStyle() {
      const categoryColor = getColor(
        settingsModule.lib.getAnnotationCategoryColor(
          props.annotation.category,
          props.annotatorStateHandler.get().settings,
          displayMode,
        ),
      );
      const { documentViewerMode } = documentViewerModeHandler;
      switch (documentViewerMode.kind) {
        case 'annotation':
          return {
            backgroundColor: categoryColor,
          };
        case 'occurrence':
          const isSelectedEntity = documentViewerMode.entityId === props.annotation.entityId;
          const OUTLINE_WIDTH = 2;
          if (isSelectedEntity) {
            return {
              backgroundColor: categoryColor,
            };
          } else {
            return {
              outline: `${OUTLINE_WIDTH}px solid ${categoryColor}`,
              outlineOffset: `-${OUTLINE_WIDTH}px`,
            };
          }
      }
    }
  }

  function openTooltipSummary() {
    setIsSummaryTooltipOpen(true);
  }

  function closeTooltipSummary() {
    setIsSummaryTooltipOpen(false);
  }

  function openTooltipMenu(element: Element | undefined) {
    setAnchorElement(element);
    closeTooltipSummary();
  }

  function closeTooltipMenu() {
    setAnchorElement(undefined);
  }
}
