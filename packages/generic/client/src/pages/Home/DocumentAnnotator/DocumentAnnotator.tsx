import React, { ReactElement } from 'react';
import { settingsModule } from '@label/core';
import { heights, widths } from '../../../styles';
import { LayoutGrid } from '../../../components';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode';
import { clientAnonymizerType } from '../../../types';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { useKeyboardShortcutsHandler } from './hooks';
import { getSplittedTextByLine, groupByCategoryAndEntity } from './lib';
import { DocumentAnnotatorFooter } from './DocumentAnnotatorFooter';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  anonymizer: clientAnonymizerType;
  onStopAnnotatingDocument: () => void;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  useKeyboardShortcutsHandler([
    { key: 'z', ctrlKey: true, action: annotatorStateHandler.revert },
    { key: 'Z', ctrlKey: true, shiftKey: true, action: annotatorStateHandler.restore },
  ]);
  const annotatorState = annotatorStateHandler.get();

  const styles = buildStyles();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);
  const annotationPerCategoryAndEntity = groupByCategoryAndEntity(annotatorState.annotations, categories);
  const splittedTextByLine = getSplittedTextByLine(annotatorState.document.text, annotatorState.annotations);

  return (
    <DocumentViewerModeHandlerContextProvider>
      <LayoutGrid container>
        <div style={styles.annotatorBody}>
          <div style={styles.leftContainer}>
            <AnnotationsPanel
              anonymizer={props.anonymizer}
              annotationPerCategoryAndEntity={annotationPerCategoryAndEntity}
              splittedTextByLine={splittedTextByLine}
            />
          </div>
          <div style={styles.rightContainer}>
            <DocumentPanel anonymizer={props.anonymizer} splittedTextByLine={splittedTextByLine} />
          </div>
        </div>
        <LayoutGrid container>
          <DocumentAnnotatorFooter
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
