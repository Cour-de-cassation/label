import React, { ReactElement, useEffect, useState } from 'react';
import { customThemeType, useCustomTheme } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { useAnonymizerBuilder } from '../../../../services/anonymizer';
import { useDocumentViewerModeHandler, viewerModeType } from '../../../../services/documentViewerMode';
import { useViewerScrollerHandler } from '../../../../services/viewerScroller';
import { heights } from '../../../../styles';
import { splittedTextByLineType } from '../lib';
import { DocumentLine } from './DocumentLine';
import { SimpleReviewScreen } from './SimpleReviewScreen';
import { useAlert } from '../../../../services/alert';
import { wordings } from '../../../../wordings';
import { annotationHandler, settingsModule } from '@label/core';

export { DocumentViewer };

function DocumentViewer(props: { splittedTextByLine: splittedTextByLineType }): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const viewerScrollerHandler = useViewerScrollerHandler();
  const theme = useCustomTheme();
  const { displayAlert } = useAlert();
  const { documentViewerMode } = documentViewerModeHandler;
  const annotatorStateHandler = useAnnotatorStateHandler();
  const anonymizerBuilder = useAnonymizerBuilder();
  const anonymizer = anonymizerBuilder.get();
  const { document } = annotatorStateHandler.get();
  useEffect(() => {
    if (documentViewerMode.kind === 'annotation') {
      viewerScrollerHandler.scrollToStoredVerticalPosition();
    } else {
      viewerScrollerHandler.scrollToTop();
    }
  }, [documentViewerMode.kind, documentViewerMode.kind === 'occurrence' ? documentViewerMode.entityId : undefined]);

  const viewerRef = viewerScrollerHandler.getViewerRef();

  const [selectedLines, setSelectedLines] = useState<number[]>([]);

  const handleLineClick = (line: number | undefined) => {
    if (line === undefined) return;
    if (!document.decisionMetadata.motivationOccultation) return;

    setSelectedLines((prevSelectedLines) => {
      if (prevSelectedLines.includes(line)) {
        return prevSelectedLines.filter((selectedLine) => selectedLine !== line);
      } else if (prevSelectedLines.length < 2) {
        return [...prevSelectedLines, line].sort((a, b) => a - b);
      } else {
        return [line];
      }
    });
  };

  useEffect(() => {
    if (selectedLines.length === 2) {
      const textBetweenLines = getTextBetweenLines(selectedLines[0], selectedLines[1]);
      if (textBetweenLines.index > -1 && textBetweenLines.text) {
        const category = settingsModule.lib.motivationCategoryHandler.getCategoryName();

        const newAnnotations = annotationHandler.create(
          annotatorStateHandler.get().annotations,
          {
            category,
            start: textBetweenLines.index,
            text: textBetweenLines.text,
          },
          annotatorStateHandler.get().settings,
        );

        annotatorStateHandler.set({
          ...annotatorStateHandler.get(),
          annotations: newAnnotations,
        });
        setSelectedLines([]);
      }
    }
  }, [selectedLines]);

  const getTextBetweenLines = (startLine: number, endLine: number) => {
    const lines = props.splittedTextByLine.filter((line) => line.line >= startLine && line.line <= endLine);

    // Delete empty lines at the beggining
    let startIndex = 0;
    while (startIndex < lines.length && lines[startIndex].content.length === 0) {
      startIndex++;
    }

    // Delete empty lines at the end
    let endIndex = lines.length - 1;
    while (endIndex >= 0 && lines[endIndex].content.length === 0) {
      endIndex--;
    }

    if (startIndex > endIndex) {
      displayAlert({
        variant: 'info',
        text: wordings.business.errors.emptyParagraphSelection,
        autoHide: true,
      });
      setSelectedLines([]);
      return { text: '', index: -1 };
    }

    const validLines = lines.slice(startIndex, endIndex + 1);

    // To avoid overlapping
    for (const line of validLines) {
      for (const chunk of line.content) {
        if (chunk.type === 'annotation') {
          displayAlert({
            variant: 'info',
            text: wordings.business.errors.paragraphOverlapsAnnotations,
            autoHide: true,
          });
          setSelectedLines([]);
          return { text: '', index: -1 };
        }
      }
    }

    const text = validLines
      .map((line) => line.content.map((chunk) => (chunk.type === 'text' ? chunk.content.text : '')).join(''))
      .join('\n');

    const index = validLines[0].content[0].type === 'text' ? validLines[0].content[0].content.index : -1;

    return { text, index };
  };

  const styles = buildStyle(
    theme,
    documentViewerModeHandler.documentViewerMode,
    documentViewerModeHandler.isAnonymizedView(),
  );
  const displayedText = computeDisplayedText();
  let expectedLine = 1;

  return (
    <>
      {displayedText ? (
        <div
          style={styles.container}
          ref={viewerRef}
          key={documentViewerMode.kind === 'occurrence' ? documentViewerMode.entityId : documentViewerMode.kind}
        >
          <table style={styles.table}>
            <tbody>
              {displayedText.map((splittedLine) => {
                const isHighlighted =
                  selectedLines.includes(splittedLine.line) ||
                  (selectedLines.length === 2 &&
                    splittedLine.line > selectedLines[0] &&
                    splittedLine.line < selectedLines[1]);
                if (splittedLine.line != expectedLine) {
                  expectedLine = splittedLine.line + 1;
                  return (
                    <>
                      <DocumentLine
                        key={splittedLine.line + 'p'}
                        line={undefined}
                        content={undefined}
                        anonymizer={anonymizer}
                        onLineClick={handleLineClick}
                        isHighlighted={isHighlighted}
                      />
                      <DocumentLine
                        key={splittedLine.line}
                        line={splittedLine.line}
                        content={splittedLine.content}
                        anonymizer={anonymizer}
                        onLineClick={handleLineClick}
                        isHighlighted={isHighlighted}
                      />
                    </>
                  );
                }
                expectedLine = splittedLine.line + 1;
                return (
                  <DocumentLine
                    key={splittedLine.line}
                    line={splittedLine.line}
                    content={splittedLine.content}
                    anonymizer={anonymizer}
                    onLineClick={handleLineClick}
                    isHighlighted={isHighlighted}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.simpleScreenContainer}>
          <SimpleReviewScreen />
        </div>
      )}
    </>
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
      case 'checklist':
        const { checkLineNumbers } = documentViewerModeHandler.documentViewerMode;
        const checkLines: splittedTextByLineType = [];
        return props.splittedTextByLine.filter(({ line }) => checkLineNumbers.includes(line));
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
