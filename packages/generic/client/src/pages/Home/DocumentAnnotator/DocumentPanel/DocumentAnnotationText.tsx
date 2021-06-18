import React, { MouseEvent, ReactElement, useState } from 'react';
import { annotationType, settingsModule } from '@label/core';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { customThemeType, getColor, useCustomTheme, useDisplayMode } from '../../../../styles';
import { positionType } from '../../../../types';
import { MouseMoveListener, useMousePosition } from '../../../../utils';
import { getAnnotationTextDisplayStyle } from './lib';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';

export { DocumentAnnotationText };

function DocumentAnnotationText(props: { annotation: annotationType }): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const anonymizer = annotatorStateHandler.getAnonymizer();
  const [isTooltipMenuVisible, setIsTooltipMenuVisible] = useState(false);
  const [isTooltipMenuExpanded, setIsTooltipMenuExpanded] = useState(false);
  const theme = useCustomTheme();
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const { displayMode } = useDisplayMode();
  const mouseMoveHandler = useMousePosition();
  const [tooltipMenuFixedPosition, setTooltipMenuFixedPosition] = useState<positionType | undefined>(undefined);
  const style = buildStyles(theme);

  return (
    <span>
      <MouseMoveListener
        onClick={onAnnotationClick}
        onMouseEnter={openTooltipMenu}
        onMouseLeave={onAnnotationMouseLeave}
        mouseMoveHandler={mouseMoveHandler}
      >
        <span style={style.annotationText}>
          {documentViewerModeHandler.isAnonymizedView()
            ? anonymizer.anonymize(props.annotation)
            : props.annotation.text}
        </span>
      </MouseMoveListener>

      {isTooltipMenuVisible && (
        <AnnotationTooltipMenu
          annotation={props.annotation}
          closesOnBackdropClick={!!tooltipMenuFixedPosition}
          originPosition={tooltipMenuFixedPosition || mouseMoveHandler.mousePosition}
          isAnonymizedView={documentViewerModeHandler.isAnonymizedView()}
          onClose={closeTooltipMenu}
          isExpanded={isTooltipMenuExpanded}
        />
      )}
    </span>
  );

  function onAnnotationClick(event: MouseEvent) {
    setIsTooltipMenuExpanded(true);
    setTooltipMenuFixedPosition({ x: event.clientX, y: event.clientY });
  }

  function onAnnotationMouseLeave() {
    if (!tooltipMenuFixedPosition) {
      closeTooltipMenu();
    }
  }

  function buildStyles(theme: customThemeType) {
    const viewerModeSpecificStyle = buildViewerModeSpecificStyle();
    return {
      annotationText: {
        cursor: 'pointer',
        padding: '0px 2px',
        borderRadius: theme.shape.borderRadius.xxxs,
        ...viewerModeSpecificStyle,
      },
    };

    function buildViewerModeSpecificStyle() {
      const settings = annotatorStateHandler.get().settings;
      const categoryColor = getColor(
        settingsModule.lib.getAnnotationCategoryColor(props.annotation.category, settings, displayMode),
      );
      const OUTLINE_WIDTH = 2;
      const { documentViewerMode } = documentViewerModeHandler;

      switch (getAnnotationTextDisplayStyle({ settings, annotation: props.annotation, documentViewerMode })) {
        case 'none':
          return {};
        case 'underlined':
          return {
            borderBottom: `${OUTLINE_WIDTH}px solid ${categoryColor}`,
          };
        case 'outlined':
          return {
            outline: `${OUTLINE_WIDTH}px solid ${categoryColor}`,
            outlineOffset: `-${OUTLINE_WIDTH}px`,
          };
        case 'filled':
          return {
            backgroundColor: categoryColor,
          };
      }
    }
  }

  function openTooltipMenu() {
    setIsTooltipMenuVisible(true);
  }

  function closeTooltipMenu() {
    setIsTooltipMenuVisible(false);
    setIsTooltipMenuExpanded(false);
    setTooltipMenuFixedPosition(undefined);
  }
}
