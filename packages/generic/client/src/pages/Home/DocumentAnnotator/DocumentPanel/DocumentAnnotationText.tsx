import React, { MouseEvent, ReactElement, useState } from 'react';
import { fetchedAnnotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';
import { AnnotationTooltipSummary } from './AnnotationTooltipMenu/AnnotationTooltipSummary';
import { useViewerMode } from './viewerMode';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  anonymizer: clientAnonymizerType;
  isAnonymizedView: boolean;
}): ReactElement {
  const style = buildStyle();
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);
  const [summaryAnchorElement, setSummaryAnchorElement] = useState<Element | undefined>(undefined);
  const { setViewerMode } = useViewerMode();

  return (
    <span>
      <span
        onClick={(event: MouseEvent<Element>) => openTooltipMenu(event.currentTarget)}
        onMouseOver={(event: MouseEvent<Element>) => openTooltipSummary(event.currentTarget)}
        style={style.annotationText}
      >
        {props.isAnonymizedView ? props.anonymizer.anonymize(props.annotation) : props.annotation.text}
      </span>
      <AnnotationTooltipSummary
        anchorAnnotation={summaryAnchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={props.isAnonymizedView}
        onClickOnAnchorAnnotation={() => openTooltipMenu(summaryAnchorElement)}
        onClose={closeTooltipSummary}
      />
      <AnnotationTooltipMenu
        anchorAnnotation={anchorElement}
        annotatorStateHandler={props.annotatorStateHandler}
        annotation={props.annotation}
        anonymizer={props.anonymizer}
        isAnonymizedView={props.isAnonymizedView}
        onClose={closeTooltipMenu}
        onResizeAnnotationClick={onResizeAnnotationClick}
      />
    </span>
  );

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

  function onResizeAnnotationClick() {
    setViewerMode({ kind: 'resize', annotation: props.annotation });
    closeTooltipMenu();
  }
}
