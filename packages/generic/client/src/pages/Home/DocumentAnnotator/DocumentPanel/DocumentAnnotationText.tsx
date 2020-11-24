import React, { MouseEvent, ReactElement, useState } from 'react';
import { fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { getColor, useDisplayMode } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';
import { AnnotationTooltipSummary } from './AnnotationTooltipMenu/AnnotationTooltipSummary';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
}): ReactElement {
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [summaryAnchorElement, setSummaryAnchorElement] = useState<Element | undefined>(undefined);
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const { displayMode } = useDisplayMode();
  const style = buildStyle();

  return (
    <span>
      <span
        onClick={(event: MouseEvent<Element>) => openTooltipMenu(event.currentTarget)}
        onMouseOver={(event: MouseEvent<Element>) => openTooltipSummary(event.currentTarget)}
        style={style.annotationText}
      >
        {documentViewerModeHandler.isAnonymizedView()
          ? props.anonymizer.anonymize(props.annotation)
          : props.annotation.text}
      </span>
      <AnnotationTooltipSummary
        anchorAnnotation={summaryAnchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={documentViewerModeHandler.isAnonymizedView()}
        onClickOnAnchorAnnotation={() => openTooltipMenu(summaryAnchorElement)}
        onClose={closeTooltipSummary}
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
    const backgroundAlpha = getBackgroundAlpha();
    const backgroundColor = getColor(
      settingsModule.lib.getAnnotationCategoryColor(
        props.annotation.category,
        props.annotatorStateHandler.get().settings,
        displayMode,
      ),
    );
    return {
      annotationText: {
        backgroundColor: `${backgroundColor}${backgroundAlpha}`,
        cursor: 'pointer',
        padding: '0px 2px',
        borderRadius: '3px',
      },
    };

    function getBackgroundAlpha() {
      const { documentViewerMode } = documentViewerModeHandler;
      switch (documentViewerMode.kind) {
        case 'annotation':
          return 'ff';
        case 'occurrence':
          return documentViewerMode.entityId === props.annotation.entityId ? 'ff' : '50';
      }
    }
  }

  function openTooltipSummary(element: Element | undefined) {
    setSummaryAnchorElement(element);
  }

  function closeTooltipSummary() {
    setSummaryAnchorElement(undefined);
  }

  function openTooltipMenu(element: Element | undefined) {
    setAnchorElement(element);
    closeTooltipSummary();
  }

  function closeTooltipMenu() {
    setAnchorElement(undefined);
  }
}
