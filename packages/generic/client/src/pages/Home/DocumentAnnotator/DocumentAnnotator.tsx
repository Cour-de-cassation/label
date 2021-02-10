import React, { ReactElement } from 'react';
import { settingsModule } from '@label/core';
import { heights, widths } from '../../../styles';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { DocumentViewerModeHandlerContextProvider } from '../../../services/documentViewerMode';
import { useMonitoring } from '../../../services/monitoring';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { useKeyboardShortcutsHandler } from './hooks';
import { getSplittedTextByLine, groupByCategoryAndEntity } from './lib';
import { DocumentAnnotatorFooter } from './DocumentAnnotatorFooter';

export { DocumentAnnotator };

function DocumentAnnotator(props: { onStopAnnotatingDocument?: () => void }): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  useKeyboardShortcutsHandler([
    { key: 'z', ctrlKey: true, action: onRevertState },
    { key: 'Z', ctrlKey: true, shiftKey: true, action: onRestoreState },
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
              annotationPerCategoryAndEntity={annotationPerCategoryAndEntity}
              splittedTextByLine={splittedTextByLine}
            />
          </div>
          <div style={styles.rightContainer}>
            <DocumentPanel splittedTextByLine={splittedTextByLine} />
          </div>
        </div>
        {!!props.onStopAnnotatingDocument && (
          <div>
            <DocumentAnnotatorFooter onStopAnnotatingDocument={props.onStopAnnotatingDocument} />
          </div>
        )}
      </div>
    </DocumentViewerModeHandlerContextProvider>
  );

  function onRevertState() {
    addMonitoringEntry({ type: 'shortcut', description: 'revert' });
    annotatorStateHandler.revert();
  }

  function onRestoreState() {
    addMonitoringEntry({ type: 'shortcut', description: 'restore' });
    annotatorStateHandler.restore();
  }

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
