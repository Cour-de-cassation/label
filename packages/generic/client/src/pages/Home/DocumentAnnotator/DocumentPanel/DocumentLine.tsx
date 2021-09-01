import React from 'react';
import { annotationChunkType, textChunkType } from '@label/core';
import { splittedTextByLineType } from '../lib';
import { Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { DocumentText } from './DocumentText';
import { DocumentAnnotationText } from './DocumentAnnotationText';

export { DocumentLine };

function DocumentLine(props: { splittedLine: splittedTextByLineType[number] }) {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const { line, content } = props.splittedLine;

  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const textColor = isLineHighlighted() ? 'textPrimary' : 'textSecondary';

  return (
    <tr key={line} id={`line${line}`}>
      <td style={styles.lineNumberCell}>
        <Text variant="body2" color="textSecondary">
          {line}
        </Text>
      </td>
      <td>
        <span key={line}>
          <Text variant="body2" color={textColor}>
            {content.map(renderChunk)}
          </Text>
        </span>
      </td>
    </tr>
  );

  function isLineHighlighted() {
    if (documentViewerModeHandler.documentViewerMode.kind !== 'occurrence') {
      return true;
    }

    const { entityId } = documentViewerModeHandler.documentViewerMode;
    const areAnnotationsLeft = content.some(
      (chunk) => chunk.type === 'annotation' && chunk.annotation.entityId === entityId,
    );
    return areAnnotationsLeft;
  }

  function renderChunk(chunk: textChunkType | annotationChunkType) {
    switch (chunk.type) {
      case 'text':
        const { before, after } = chunk;
        return <DocumentText key={chunk.content.index} neighbours={{ before, after, current: chunk.content }} />;
      case 'annotation':
        return <DocumentAnnotationText key={chunk.index} annotation={chunk.annotation} />;
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    lineNumberCell: {
      display: 'flex',
      flexDirection: 'row-reverse',
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
