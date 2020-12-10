import React, { ReactElement } from 'react';
import { settingsModule } from '@label/core';
import { heights, widths } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { annotatorStateType, annotatorStateCommitterType, useAnnotatorState } from '../../../services/annotatorState';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode';
import { clientAnonymizerType } from '../../../types';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { useKeyboardShortcutsHandler } from './hooks';
import { getSplittedTextByLine, groupByCategoryAndEntity } from './lib';
import { DocumentAnnotatorFooter } from './DocumentAnnotatorFooter';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotatorState: annotatorStateType;
  annotatorStateCommitter: annotatorStateCommitterType;
  anonymizer: clientAnonymizerType;
  onStopAnnotatingDocument: () => void;
}): ReactElement {
  const { annotatorStateHandler } = useAnnotatorState(props.annotatorState, props.annotatorStateCommitter);
  useKeyboardShortcutsHandler([
    { key: 'z', ctrlKey: true, action: annotatorStateHandler.revert },
    { key: 'Z', ctrlKey: true, shiftKey: true, action: annotatorStateHandler.restore },
  ]);

  const styles = buildStyles();
  const categories = settingsModule.lib.getCategories(props.annotatorState.settings);
  const annotatorState = annotatorStateHandler.get();
  const annotationPerCategoryAndEntity = groupByCategoryAndEntity(annotatorState.annotations, categories);
  const splittedTextByLine = getSplittedTextByLine(annotatorState.document.text, annotatorState.annotations);

  return (
    <DocumentViewerModeHandlerContextProvider annotations={annotatorState.annotations}>
      <LayoutGrid container>
        <div style={styles.annotatorBody}>
          <div style={styles.leftContainer}>
            <AnnotationsPanel
              annotatorStateHandler={annotatorStateHandler}
              anonymizer={props.anonymizer}
              annotationPerCategoryAndEntity={annotationPerCategoryAndEntity}
              splittedTextByLine={splittedTextByLine}
            />
          </div>
          <div style={styles.rightContainer}>
            <DocumentPanel
              annotatorStateHandler={annotatorStateHandler}
              anonymizer={props.anonymizer}
              splittedTextByLine={splittedTextByLine}
            />
          </div>
        </div>
        <LayoutGrid container>
          <DocumentAnnotatorFooter
            annotatorStateHandler={annotatorStateHandler}
            anonymizer={props.anonymizer}
            onStopAnnotatingDocument={props.onStopAnnotatingDocument}
          />
        </LayoutGrid>
      </LayoutGrid>
    </DocumentViewerModeHandlerContextProvider>
  );

  function buildStyles() {
    return {
      annotatorHeader: {
        height: heights.header,
      },
      annotatorBody: {
        display: 'flex',
      },
      leftContainer: {
        display: 'flex',
        width: widths.annotationsPanel,
      },
      rightContainer: {
        display: 'flex',
        width: widths.documentPanel,
      },
    };
  }
}
