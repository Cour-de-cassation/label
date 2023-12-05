import React, { MouseEvent, ReactElement, useState } from 'react';
import { customThemeType, getColor, useCustomTheme, useDisplayMode, positionType } from 'pelta-design-system';
import { annotationType, settingsModule } from '@label/core';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { clientAnonymizerType } from '../../../../types';
import { MouseMoveListener, useMousePosition } from '../../../../utils';
import { getAnnotationTextDisplayStyle } from './lib';
import { AnnotationTooltipMenu } from './AnnotationTooltipMenu';
import { DocumentAnonymizedAnnotationText } from './DocumentAnonymizedAnnotationText';

export { PureDocumentAnnotationText as DocumentAnnotationText };

type propsType = { annotation: annotationType; anonymizer: clientAnonymizerType };

class PureDocumentAnnotationText extends React.Component<propsType> {
  shouldComponentUpdate(nextProps: propsType) {
    return (
      nextProps.annotation.category !== this.props.annotation.category ||
      nextProps.annotation.entityId !== this.props.annotation.entityId ||
      nextProps.annotation.start !== this.props.annotation.start ||
      nextProps.annotation.text !== this.props.annotation.text
    );
  }

  render() {
    return <DocumentAnnotationText annotation={this.props.annotation} anonymizer={this.props.anonymizer} />;
  }
}

function DocumentAnnotationText(props: propsType): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();

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
          {!documentViewerModeHandler.isAnonymizedView() ? (
            props.annotation.text
          ) : (
            <DocumentAnonymizedAnnotationText annotation={props.annotation} anonymizer={props.anonymizer} />
          )}
        </span>
      </MouseMoveListener>

      {isTooltipMenuVisible && (
        <AnnotationTooltipMenu
          annotation={props.annotation}
          anonymizer={props.anonymizer}
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
        whiteSpace: 'break-spaces',
        ...viewerModeSpecificStyle,
      } as const,
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
