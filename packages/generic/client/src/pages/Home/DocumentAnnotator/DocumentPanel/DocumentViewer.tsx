import React, { ReactElement } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { annotationType, anonymizerType, documentType, settingsType, textSplitter } from '@label/core';
import { Text } from '../../../../components';
import { heights } from '../../../../styles';
import { getSplittedTextByLine } from './lib';
import { DocumentAnnotationText } from './DocumentAnnotationText';

export { DocumentViewer };

function DocumentViewer(props: {
  annotations: annotationType[];
  anonymizer: anonymizerType;
  document: documentType;
  isAnonymizedView: boolean;
  settings: settingsType;
}): ReactElement {
  const theme = useTheme();
  const styles = buildStyle(theme);
  const splittedTextByLine = getSplittedTextByLine(props.document.text, props.annotations);

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
                            annotation={annotation}
                            annotationDisplayedText={
                              props.isAnonymizedView ? props.anonymizer.anonymize(annotation) : annotation.text
                            }
                            settings={props.settings}
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
