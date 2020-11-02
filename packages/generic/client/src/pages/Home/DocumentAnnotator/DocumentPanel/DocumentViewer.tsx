import React, { ReactElement, CSSProperties } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { heights } from '../../../../styles';
import { getSplittedTextByLine } from './lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';
import { DocumentText } from './DocumentText';

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
                    {splittedText.map((chunk) => {
                      switch (chunk.type) {
                        case 'text':
                          return (
                            <DocumentText
                              annotatorStateHandler={props.annotatorStateHandler}
                              index={chunk.index}
                              text={chunk.text}
                            />
                          );
                        case 'annotation':
                          return (
                            <DocumentAnnotationText
                              annotatorStateHandler={props.annotatorStateHandler}
                              annotation={chunk.annotation}
                              anonymizer={props.anonymizer}
                              isAnonymizedView={props.isAnonymizedView}
                            />
                          );
                      }
                    })}
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

function buildStyle(theme: Theme): { [cssClass: string]: CSSProperties } {
  return {
    container: {
      overflowY: 'auto',
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
      display: 'flex',
      flexDirection: 'row-reverse',
      paddingRight: theme.spacing(2),
    },
  };
}
