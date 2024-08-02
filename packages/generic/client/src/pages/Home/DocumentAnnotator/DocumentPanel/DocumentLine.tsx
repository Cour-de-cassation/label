import React from 'react';
import { annotationChunkType, textChunkType } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { splittedTextByLineType } from '../lib';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { clientAnonymizerType } from '../../../../types';
import { DocumentText } from './DocumentText';
import { DocumentAnnotationText } from './DocumentAnnotationText';

export { DocumentLine };

function DocumentLine(props: {
  line: splittedTextByLineType[number]['line'] | undefined;
  content: splittedTextByLineType[number]['content'] | undefined;
  anonymizer: clientAnonymizerType;
  onLineClick: (line: number | undefined) => void;
  isHighlighted: boolean;
}) {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const textColor = isLineHighlighted() ? 'textPrimary' : 'textSecondary';

  return (
    <tr id={`line${props.line}`} style={props.isHighlighted ? styles.selectedLine : {}}>
      <td style={styles.lineNumberCell} onClick={() => props.onLineClick(props.line)}>
        <Text variant="body2" color={props.isHighlighted ? 'textPrimary' : 'textSecondary'}>
          {props.line ?? '[…]'}
        </Text>
      </td>
      <td style={styles.lineTextCell}>
        <span>
          <Text variant="body2" color={textColor}>
            {props.content?.map(renderChunk) ?? ''}
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
    const areAnnotationsLeft = props.content?.some(
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
        return <DocumentAnnotationText key={chunk.index} annotation={chunk.annotation} anonymizer={props.anonymizer} />;
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    lineNumberCell: {
      display: 'flex',
      flexDirection: 'row-reverse',
      paddingRight: theme.spacing * 2,
      cursor: 'pointer',
    },
    lineTextCell: {
      overflowWrap: 'anywhere',
    },
    selectedLine: {
      backgroundColor: theme.colors.default.background,
    },
  } as const;
}
