import React, { ReactElement } from 'react';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { heights, customThemeType, useCustomTheme } from '../../../../styles';
import { splittedTextByLineType } from '../lib';
import { DocumentLine } from './DocumentLine';

export { DocumentViewer };

function DocumentViewer(props: { splittedTextByLine: splittedTextByLineType }): ReactElement {
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
          {documentText.map((splittedLine) => (
            <DocumentLine key={splittedLine.line} splittedLine={splittedLine} />
          ))}
        </tbody>
      </table>
    </div>
  );

  function computeDocumentText() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'occurrence':
        const { entityLineNumbers } = documentViewerModeHandler.documentViewerMode;
        return props.splittedTextByLine.filter(({ line }) => entityLineNumbers.includes(line));
      default:
        return props.splittedTextByLine;
    }
  }

  function buildStyle(theme: customThemeType, viewerMode: viewerModeType, isAnonymizedView: boolean) {
    const lineVerticalPadding = viewerMode.kind === 'occurrence' ? theme.spacing * 4 : 0;
    const backgroundImage = isAnonymizedView
      ? `repeating-linear-gradient(45deg, transparent, transparent 20px, ${theme.colors.line.level2}30 1px, ${theme.colors.line.level2}30 21px)`
      : undefined;

    return {
      container: {
        overflowY: 'auto',
        borderRadius: theme.shape.borderRadius.m,
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
    } as const;
  }
}
