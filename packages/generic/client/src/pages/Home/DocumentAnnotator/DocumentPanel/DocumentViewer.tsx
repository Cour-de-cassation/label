import React, { ReactElement, CSSProperties } from 'react';
import { annotationChunkType, anonymizerType, fetchedAnnotationType, textChunkType } from '@label/core';
import { Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { heights, customThemeType, useCustomTheme } from '../../../../styles';
import { getSplittedTextByLine } from './lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';
import { DocumentText } from './DocumentText';
import { headerModeType } from './DocumentPanelHeader';

export { DocumentViewer };

function DocumentViewer(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
  setHeaderMode: (headerMode: headerModeType) => void;
}): ReactElement {
  const theme = useCustomTheme();
  const styles = buildStyle(theme);
  const annotatorState = props.annotatorStateHandler.get();
  const splittedTextByLine = getSplittedTextByLine(annotatorState.document.text, annotatorState.annotations);

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tbody>
          {splittedTextByLine.map((splittedText, lineNumber) => (
            <tr key={lineNumber}>
              <td style={styles.lineNumberCell}>
                <Text variant="body2" color="textSecondary">
                  {lineNumber + 1}
                </Text>
              </td>
              <td>
                <span key={lineNumber}>
                  <Text variant="body2">{splittedText.map(renderChunk)}</Text>
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
            isAnonymizedView={props.isAnonymizedView}
            setHeaderMode={props.setHeaderMode}
          />
        );
    }
  }
}

function buildStyle(theme: customThemeType): { [cssClass: string]: CSSProperties } {
  return {
    container: {
      overflowY: 'auto',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.colors.document.background,
      height: heights.panel,
      width: '100%',
    },
    table: {
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
