import React from 'react';
import { useParams } from 'react-router';
import { IconButton, MainHeader, Text } from '../../components';
import { lineSplitter } from '../../services/lineSplitter';
import { customThemeType, heights, useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';
import { AnonymizedDocumentTextDataFetcher } from './AnonymizedDocumentTextDataFetcher';

export { AnonymizedDocument };

const LINE_MIN_HEIGHT = 10;

type AnonymizedDocumentParamsType = {
  documentId: string;
};

function AnonymizedDocument() {
  const params = useParams<AnonymizedDocumentParamsType>();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <>
      <MainHeader />
      <AnonymizedDocumentTextDataFetcher documentId={params.documentId}>
        {({ anonymizedDocumentText }) => {
          const splittedTextByLine = lineSplitter.splitTextAccordingToNewLine(anonymizedDocumentText);

          return (
            <div style={styles.container}>
              <div style={styles.documentHeaderContainer}></div>
              <div style={styles.documentContainer}>
                <div style={styles.documentTextContainer}>
                  <table style={styles.documentTextTable}>
                    {splittedTextByLine.map((line) => (
                      <tr>
                        <td style={styles.lineCell}>
                          <Text variant="body2">{line}</Text>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
              <div style={styles.documentFooterContainer}>
                <IconButton
                  iconName="copy"
                  onClick={() => copyToClipboard(anonymizedDocumentText)}
                  hint={wordings.shared.copyToClipboard}
                />
              </div>
            </div>
          );
        }}
      </AnonymizedDocumentTextDataFetcher>
    </>
  );
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    documentHeaderContainer: {
      height: heights.anonymizedDocumentHeader,
    },
    documentContainer: {
      paddingLeft: theme.spacing * 2,
      paddingRight: theme.spacing * 2,
    },
    documentTextContainer: {
      height: heights.anonymizedDocument,
      overflowY: 'auto',
      backgroundColor: theme.colors.document,
      borderRadius: theme.shape.borderRadius.m,
    },
    documentTextTable: {
      padding: theme.spacing * 2,
    },
    documentFooterContainer: {
      display: 'flex',
      height: heights.anonymizedDocumentFooter,
      paddingRight: theme.spacing * 2,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    lineCell: {
      height: LINE_MIN_HEIGHT,
    },
  } as const;
}
