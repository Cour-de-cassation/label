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
    <div
      style={styles.container}
      ref={viewerRef}
      key={documentViewerMode.kind === 'occurrence' ? documentViewerMode.entityId : documentViewerMode.kind}
    >
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
        const detectedLines = props.splittedTextByLine.filter(({ line }) => entityLineNumbers.includes(line));
        const displayedLines: splittedTextByLineType = [];
        for (const detectedLine of detectedLines) {
          const addedLinesNumber: number[] = [];
          while (
            getLinesLengthByLineNumbers([detectedLine.line, ...addedLinesNumber]) < 30 &&
            addedLinesNumber.length < 5
          ) {
            addedLinesNumber.push(
              detectedLine.line + (addedLinesNumber.length / 2 + 1),
              detectedLine.line - (addedLinesNumber.length / 2 + 1),
            );
          }
          displayedLines.push(detectedLine, ...getLinesByLineNumbers(addedLinesNumber));
        }
        const displayedUniqueLines: splittedTextByLineType = [];
        displayedLines.forEach(function (displayedLine) {
          const doubledLinesCount = displayedUniqueLines.findIndex((line) => line.line == displayedLine.line);
          if (doubledLinesCount <= -1) {
            displayedUniqueLines.push(displayedLine);
          }
        });
        return displayedUniqueLines.sort((line1, line2) => line1.line - line2.line);

      case 'annotation':
        switch (document.route) {
          case 'simple':
            if (
              document.status != 'done' &&
              document.status != 'locked' &&
              document.status != 'toBePublished' &&
              document.status != 'toBeConfirmed'
            ) {
              return undefined;
            }
          default:
            return props.splittedTextByLine;
        }
    }
  }

  function getLinesByLineNumbers(lineNumbers: number[]): splittedTextByLineType {
    return props.splittedTextByLine.filter(({ line }) => lineNumbers.includes(line));
  }

  function getLinesLengthByLineNumbers(lineNumbers: number[]): number {
    let linesLength = 0;
    props.splittedTextByLine
      .filter(({ line }) => lineNumbers.includes(line))
      .forEach((line) => {
        line.content.forEach((chunk) => {
          if (chunk.type == 'text') linesLength += chunk.content.text.length;
        });
      });
    return linesLength;
  }

  function buildStyle(theme: customThemeType, viewerMode: viewerModeType, isAnonymizedView: boolean) {
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
        borderSpacing: 0,
        maxWidth: 900,
        padding: theme.spacing * 2,
      },
    } as const;
  }
}
