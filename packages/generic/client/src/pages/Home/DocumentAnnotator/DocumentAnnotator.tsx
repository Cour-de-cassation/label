import React, { ReactElement } from 'react';
import { anonymizerType, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { heights } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { useAnnotatorState } from '../../../services/annotatorState';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { DocumentAnnotatorHeader } from './DocumentAnnotatorHeader';
import { useKeyboardShortcutsHandler } from './hooks';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: fetchedAnnotationType[];
  anonymizer: anonymizerType<fetchedAnnotationType>;
  settings: settingsType;
  document: fetchedDocumentType;
}): ReactElement {
  const { annotatorStateHandler } = useAnnotatorState({
    annotations: props.annotations,
    document: props.document,
    settings: props.settings,
  });
  const styles = buildStyles();
  useKeyboardShortcutsHandler(annotatorStateHandler.revert, annotatorStateHandler.restore);

  return (
    <LayoutGrid container>
      <LayoutGrid container item style={styles.annotatorHeader} xs={12}>
        <DocumentAnnotatorHeader title={props.document.title} />
      </LayoutGrid>
      <LayoutGrid container item xs={12}>
        <LayoutGrid container item xs={4}>
          <AnnotationsPanel annotatorStateHandler={annotatorStateHandler} anonymizer={props.anonymizer} />
        </LayoutGrid>
        <LayoutGrid container item xs={8}>
          <DocumentPanel annotatorStateHandler={annotatorStateHandler} anonymizer={props.anonymizer} />
        </LayoutGrid>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      annotatorHeader: {
        height: heights.header,
      },
    };
  }
}
