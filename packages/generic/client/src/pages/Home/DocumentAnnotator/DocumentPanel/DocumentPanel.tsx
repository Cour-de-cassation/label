import React, { ReactElement, useEffect } from 'react';
import { assignationType } from '@label/core';
import { apiCaller } from '../../../../api';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { useViewerScrollerHandler } from '../../../../services/viewerScroller';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { splittedTextByLineType } from '../lib';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

const TIME_THRESHOLD_FOR_UPDATE = 1 * 60 * 1000;

function DocumentPanel(props: { splittedTextByLine: splittedTextByLineType }): ReactElement {
  const theme = useCustomTheme();
  const viewerScrollerHandler = useViewerScrollerHandler();
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { assignationId } = annotatorStateHandler.get();
  const annotatorStateChecksum = annotatorStateHandler.getChecksum();
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const styles = buildStyles(theme);

  let updateTreatementDurationsInterval: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (!assignationId) {
      return;
    }
    if (!!updateTreatementDurationsInterval) {
      clearInterval(updateTreatementDurationsInterval);
      apiCaller.post<'updateTreatmentDuration'>('updateTreatmentDuration', {
        assignationId,
      });
    }
    updateTreatementDurationsInterval = setInterval(
      buildUpdateTreatmentUpdateDate(assignationId),
      TIME_THRESHOLD_FOR_UPDATE,
    );

    return () => {
      updateTreatementDurationsInterval && clearInterval(updateTreatementDurationsInterval);
    };
  }, [
    documentViewerModeHandler.documentViewerMode.kind === 'occurrence' &&
      documentViewerModeHandler.documentViewerMode.entityId,
    annotatorStateChecksum,
  ]);

  return (
    <div style={styles.panel}>
      <DocumentPanelHeader />
      <DocumentViewer splittedTextByLine={props.splittedTextByLine} />
    </div>
  );

  function buildUpdateTreatmentUpdateDate(assignationId: assignationType['_id']) {
    let lastVerticalPosition = 0;
    return async () => {
      const currentVerticalPosition = viewerScrollerHandler.getCurrentVerticalPosition();
      if (lastVerticalPosition !== currentVerticalPosition) {
        await apiCaller.post<'updateTreatmentDuration'>('updateTreatmentDuration', {
          assignationId,
        });
      } else {
        await apiCaller.post<'resetTreatmentLastUpdateDate'>('resetTreatmentLastUpdateDate', {
          assignationId,
        });
      }
      lastVerticalPosition = currentVerticalPosition;
    };
  }
}

function buildStyles(theme: customThemeType) {
  return {
    panel: {
      width: '100%',
      paddingRight: theme.spacing * 2,
    },
  };
}
