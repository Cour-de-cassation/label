import React, { ReactElement, useEffect } from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { useViewerScrollerHandler } from '../../../../services/viewerScroller';
import { heights } from '../../../../styles';
import { splittedTextByLineType } from '../lib';
import { DocumentLine } from './DocumentLine';
import { SimpleReviewScreen } from './SimpleReviewScreen';

export { DocumentViewer };

function DocumentViewer(props: { splittedTextByLine: splittedTextByLineType }): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const viewerScrollerHandler = useViewerScrollerHandler();
  const theme = useCustomTheme();
  const { documentViewerMode } = documentViewerModeHandler;
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { document } = annotatorStateHandler.get();
  useEffect(() => {
    if (documentViewerMode.kind === 'annotation') {
      viewerScrollerHandler.scrollToStoredVerticalPosition();
    } else {
      viewerScrollerHandler.scrollToTop();
    }
  }, [documentViewerMode.kind, documentViewerMode.kind === 'occurrence' ? documentViewerMode.entityId : undefined]);

  const viewerRef = viewerScrollerHandler.getViewerRef();
  const styles = buildStyle(
    theme,
    documentViewerModeHandler.documentViewerMode,
    documentViewerModeHandler.isAnonymizedView(),
  );
  const displayedText = computeDisplayedText();

  return displayedText ? (
    <div style={styles.container} ref={viewerRef}>
      <table style={styles.table}>
        <tbody>
          {displayedText.map((splittedLine) => (
            <DocumentLine key={splittedLine.line} splittedLine={splittedLine} />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div style={styles.simpleScreenContainer}>
      <SimpleReviewScreen />
    </div>
  );

  function computeDisplayedText() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'occurrence':
        const { entityLineNumbers } = documentViewerModeHandler.documentViewerMode;
        return props.splittedTextByLine.filter(({ line }) => entityLineNumbers.includes(line));
      case 'annotation':
        switch (document.route) {
          case 'simple':
            return undefined;
          case 'default':
            return undefined;
          default:
            return props.splittedTextByLine;
        }
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
      simpleScreenContainer: {
        height: heights.annotatorPanel,
      },
      table: {
        borderSpacing: `0 ${lineVerticalPadding}px`,
        maxWidth: 900,
        padding: theme.spacing * 2,
      },
    } as const;
  }
}
