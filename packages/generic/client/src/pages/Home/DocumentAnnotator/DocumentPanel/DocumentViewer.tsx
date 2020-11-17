import React, { ReactElement, CSSProperties } from 'react';
import { annotationChunkType, fetchedAnnotationType, textChunkType } from '@label/core';
import { Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { heights, customThemeType, useCustomTheme } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { filterLineByEntityId, getSplittedTextByLine } from './lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';
import { DocumentText } from './DocumentText';

export { DocumentViewer };

function DocumentViewer(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
}): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const styles = buildStyle(theme, documentViewerModeHandler.documentViewerMode);
  const annotatorState = props.annotatorStateHandler.get();
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
    const splittedTextByLine = getSplittedTextByLine(annotatorState.document.text, annotatorState.annotations);

    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'occurrence':
        return filterLineByEntityId(documentViewerModeHandler.documentViewerMode.entityId, splittedTextByLine);
      default:
        return splittedTextByLine;
    }
  }

  function buildStyle(theme: customThemeType, viewerMode: viewerModeType): { [cssClass: string]: CSSProperties } {
    const lineVerticalPadding = viewerMode.kind === 'occurrence' ? theme.spacing * 4 : 0;

    return {
      container: {
        overflowY: 'auto',
        borderRadius: theme.shape.borderRadius,
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
