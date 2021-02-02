import React, { ReactElement } from 'react';
import { settingsModule } from '@label/core';
import { heights, widths } from '../../../styles';
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
  onStopAnnotatingDocument?: () => void;
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
      <div>
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
        {!!props.onStopAnnotatingDocument && (
          <div>
            <DocumentAnnotatorFooter
              anonymizer={props.anonymizer}
              onStopAnnotatingDocument={props.onStopAnnotatingDocument}
            />
          </div>
        )}
      </div>
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
