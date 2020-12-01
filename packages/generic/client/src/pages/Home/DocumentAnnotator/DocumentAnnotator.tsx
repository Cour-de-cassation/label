import React, { ReactElement } from 'react';
import { settingsModule } from '@label/core';
import { heights } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { annotatorStateType, annotatorStateCommitterType, useAnnotatorState } from '../../../services/annotatorState';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode';
import { clientAnonymizerType } from '../../../types';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { DocumentAnnotatorHeader } from './DocumentAnnotatorHeader';
import { useKeyboardShortcutsHandler } from './hooks';
import { getSplittedTextByLine, groupByCategoryAndEntity } from './lib';

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
        <LayoutGrid container item style={styles.annotatorHeader} xs={12}>
          <DocumentAnnotatorHeader
            annotatorStateHandler={annotatorStateHandler}
            onStopAnnotatingDocument={props.onStopAnnotatingDocument}
          />
        </LayoutGrid>
        <LayoutGrid container item xs={12}>
          <LayoutGrid container item xs={4}>
            <AnnotationsPanel
              annotatorStateHandler={annotatorStateHandler}
              anonymizer={props.anonymizer}
              annotationPerCategoryAndEntity={annotationPerCategoryAndEntity}
            />
          </LayoutGrid>
          <LayoutGrid container item xs={8}>
            <DocumentPanel
              annotatorStateHandler={annotatorStateHandler}
              anonymizer={props.anonymizer}
              onStopAnnotatingDocument={props.onStopAnnotatingDocument}
              splittedTextByLine={splittedTextByLine}
            />
          </LayoutGrid>
        </LayoutGrid>
      </LayoutGrid>
    </DocumentViewerModeHandlerContextProvider>
  );

  function buildStyles() {
    return {
      annotatorHeader: {
        height: heights.header,
      },
    };
  }
}
