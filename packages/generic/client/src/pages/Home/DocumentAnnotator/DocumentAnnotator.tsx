import React, { ReactElement } from 'react';
import { fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { heights } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { useAnnotatorState } from '../../../services/annotatorState';
import { clientAnonymizerType } from '../../../types';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { DocumentAnnotatorHeader } from './DocumentAnnotatorHeader';
import { useKeyboardShortcutsHandler } from './hooks';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode/DocumentViewerModeHandlerContextProvider';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: fetchedAnnotationType[];
  anonymizer: clientAnonymizerType;
  settings: settingsType;
  document: fetchedDocumentType;
  fetchNewDocument: () => Promise<void>;
}): ReactElement {
  const { annotatorStateHandler } = useAnnotatorState({
    annotations: props.annotations,
    document: props.document,
    settings: props.settings,
  });
  const styles = buildStyles();
  useKeyboardShortcutsHandler([
    { key: 'z', ctrlKey: true, action: annotatorStateHandler.revert },
    { key: 'Z', ctrlKey: true, shiftKey: true, action: annotatorStateHandler.restore },
  ]);

  return (
    <DocumentViewerModeHandlerContextProvider>
      <LayoutGrid container>
        <LayoutGrid container item style={styles.annotatorHeader} xs={12}>
          <DocumentAnnotatorHeader
            annotatorStateHandler={annotatorStateHandler}
            fetchNewDocument={props.fetchNewDocument}
          />
        </LayoutGrid>
        <LayoutGrid container item xs={12}>
          <LayoutGrid container item xs={4}>
            <AnnotationsPanel annotatorStateHandler={annotatorStateHandler} anonymizer={props.anonymizer} />
          </LayoutGrid>
          <LayoutGrid container item xs={8}>
            <DocumentPanel
              annotatorStateHandler={annotatorStateHandler}
              anonymizer={props.anonymizer}
              fetchNewDocument={props.fetchNewDocument}
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
