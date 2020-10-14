import React, { ReactElement } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { anonymizerType, textSplitter } from '@label/core';
import { Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { heights } from '../../../../styles';
import { fetchedAnnotationType } from '../../../../types';
import { getSplittedTextByLine } from './lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';

export { DocumentViewer };

function DocumentViewer(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  isAnonymizedView: boolean;
}): ReactElement {
  const theme = useTheme();
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
                  <Text variant="body2">
                    {splittedText.map((chunk) =>
                      textSplitter.applyToChunk(
                        chunk,
                        (text) => <span>{text}</span>,
                        (annotation) => (
                          <DocumentAnnotationText
                            annotatorStateHandler={props.annotatorStateHandler}
                            annotation={annotation}
                            anonymizer={props.anonymizer}
                            isAnonymizedView={props.isAnonymizedView}
                          />
                        ),
                      ),
                    )}
                  </Text>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildStyle(theme: Theme) {
  return {
    container: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      overflowY: 'auto' as 'auto',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.black,
      height: heights.panel,
      width: '100%',
    },
    table: {
      maxWidth: 900,
      padding: theme.spacing(2),
    },
    lineNumberCell: {
      paddingRight: theme.spacing(2),
    },
  };
}
