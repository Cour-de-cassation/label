import React, { ReactElement } from 'react';
import { buildAnonymizer, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { heights } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { useAnnotatorState } from '../../../services/annotatorState';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { DocumentAnnotatorHeader } from './DocumentAnnotatorHeader';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: fetchedAnnotationType[];
  settings: settingsType;
  document: fetchedDocumentType;
}): ReactElement {
  const { annotatorStateHandler } = useAnnotatorState({
    annotations: props.annotations,
    document: props.document,
    settings: props.settings,
  });

  const anonymizer = buildAnonymizer(props.settings);
  const styles = buildStyles();

  return (
    <LayoutGrid container>
      <LayoutGrid container item style={styles.annotatorHeader} xs={12}>
        <DocumentAnnotatorHeader />
      </LayoutGrid>
      <LayoutGrid container item xs={12}>
        <LayoutGrid container item xs={4}>
          <AnnotationsPanel annotatorStateHandler={annotatorStateHandler} anonymizer={anonymizer} />
        </LayoutGrid>
        <LayoutGrid container item xs={8}>
          <DocumentPanel annotatorStateHandler={annotatorStateHandler} anonymizer={anonymizer} />
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
