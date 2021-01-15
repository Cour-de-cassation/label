import React, { ReactElement, CSSProperties } from 'react';
import { annotationChunkType, textChunkType } from '@label/core';
import { Text } from '../../../../components';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { heights, customThemeType, useCustomTheme } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { splittedTextByLineType } from '../lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';
import { DocumentText } from './DocumentText';

export { DocumentViewer };

function DocumentViewer(props: {
  anonymizer: clientAnonymizerType;
  splittedTextByLine: splittedTextByLineType;
}): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const styles = buildStyle(
    theme,
    documentViewerModeHandler.documentViewerMode,
    documentViewerModeHandler.isAnonymizedView(),
  );
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
                  <Text variant="body2" color={isLineHighlighted(line) ? 'textPrimary' : 'textSecondary'}>
                    {content.map(renderChunk)}
                  </Text>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function isLineHighlighted(lineNumber: number) {
    if (documentViewerModeHandler.documentViewerMode.kind !== 'occurrence') {
      return true;
    }

    const selectedLine = props.splittedTextByLine.find(({ line }) => line === lineNumber);
    if (!selectedLine) {
      return false;
    }
    const { entityId } = documentViewerModeHandler.documentViewerMode;
    const areAnnotationsLeft = selectedLine.content.some(
      (chunk) => chunk.type === 'annotation' && chunk.annotation.entityId === entityId,
    );
    return areAnnotationsLeft;
  }

  function renderChunk(chunk: textChunkType | annotationChunkType) {
    switch (chunk.type) {
      case 'text':
        return <DocumentText key={chunk.index} index={chunk.index} text={chunk.text} />;
      case 'annotation':
        return <DocumentAnnotationText key={chunk.index} annotation={chunk.annotation} anonymizer={props.anonymizer} />;
    }
  }

  function computeDocumentText() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'occurrence':
        const { entityLineNumbers } = documentViewerModeHandler.documentViewerMode;
        return props.splittedTextByLine.filter(({ line }) => entityLineNumbers.includes(line));
      default:
        return props.splittedTextByLine;
    }
  }

  function buildStyle(
    theme: customThemeType,
    viewerMode: viewerModeType,
    isAnonymizedView: boolean,
  ): { [cssClass: string]: CSSProperties } {
    const lineVerticalPadding = viewerMode.kind === 'occurrence' ? theme.spacing * 4 : 0;
    const backgroundImage = isAnonymizedView
      ? `repeating-linear-gradient(45deg, transparent, transparent 20px, ${theme.colors.line.level2}30 1px, ${theme.colors.line.level2}30 21px)`
      : undefined;

    return {
      container: {
        overflowY: 'auto',
        borderRadius: theme.shape.borderRadius.medium,
        backgroundColor: theme.colors.document,
        backgroundImage,
        height: heights.annotatorPanel,
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
