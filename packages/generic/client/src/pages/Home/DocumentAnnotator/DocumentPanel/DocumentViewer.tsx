import React, { ReactElement, CSSProperties } from 'react';
import { annotationChunkType, fetchedAnnotationType, textChunkType } from '@label/core';
import { Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { heights, customThemeType, useCustomTheme } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { splittedTextByLineType } from '../lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';
import { DocumentText } from './DocumentText';

export { DocumentViewer };

function DocumentViewer(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  splittedTextByLine: splittedTextByLineType;
}): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const styles = buildStyle(theme, documentViewerModeHandler.documentViewerMode);
  const documentText = computeDocumentText();

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tbody>
          {documentText.map(({ line, content }) => (
            <tr key={line}>
              <td style={styles.lineNumberCell}>
                <Text variant="body2" color="textSecondary">
                  {line}
                </Text>
              </td>
              <td>
                <span key={line}>
                  <Text variant="body2">{content.map(renderChunk)}</Text>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function renderChunk(chunk: textChunkType | annotationChunkType<fetchedAnnotationType>) {
    switch (chunk.type) {
      case 'text':
        return (
          <DocumentText
            key={chunk.index}
            annotatorStateHandler={props.annotatorStateHandler}
            index={chunk.index}
            text={chunk.text}
          />
        );
      case 'annotation':
        return (
          <DocumentAnnotationText
            key={chunk.index}
            annotatorStateHandler={props.annotatorStateHandler}
            annotation={chunk.annotation}
            anonymizer={props.anonymizer}
          />
        );
    }
  }

  function computeDocumentText() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'occurrence':
        return filterLineByEntityId(documentViewerModeHandler.documentViewerMode.entityId, props.splittedTextByLine);
      default:
        return props.splittedTextByLine;
    }

    function filterLineByEntityId(
      entityId: string,
      splittedTextByLine: splittedTextByLineType,
    ): splittedTextByLineType {
      return splittedTextByLine.filter(({ content }) =>
        content.some((chunk) => {
          switch (chunk.type) {
            case 'annotation':
              return chunk.annotation.entityId === entityId;
            case 'text':
              return false;
          }
        }),
      );
    }
  }

  function buildStyle(theme: customThemeType, viewerMode: viewerModeType): { [cssClass: string]: CSSProperties } {
    const lineVerticalPadding = viewerMode.kind === 'occurrence' ? theme.spacing * 4 : 0;

    return {
      container: {
        overflowY: 'auto',
        borderRadius: theme.shape.borderRadius.medium,
        backgroundColor: theme.colors.document.background,
        height: heights.panel,
        width: '100%',
      },
      table: {
        borderSpacing: `0 ${lineVerticalPadding}px`,
        maxWidth: 900,
        padding: theme.spacing * 2,
      },
      lineNumberCell: {
        display: 'flex',
        flexDirection: 'row-reverse',
        paddingRight: theme.spacing * 2,
      },
    };
  }
}
