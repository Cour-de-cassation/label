import React from 'react';
import { documentType, idModule } from '@label/core';
import { apiCaller } from '../../../api';
import { ButtonWithIcon, ComponentsList, IconButton } from '../../../components';
import { useMonitoring } from '../../../services/monitoring';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorFooter };

function DocumentAnnotatorFooter(props: { onStopAnnotatingDocument: () => void }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const { addMonitoringEntry, sendMonitoringEntries } = useMonitoring();

  const styles = buildStyles(theme);
  const annotatorState = annotatorStateHandler.get();
  const anonymizer = annotatorStateHandler.getAnonymizer();

  return (
    <div style={styles.footer}>
      <div style={styles.leftContainer}>
        <div style={styles.resetButtonContainer}>
          <ButtonWithIcon
            color="default"
            iconName="reset"
            onClick={annotatorStateHandler.reinitialize}
            text={wordings.homePage.reset}
          />
        </div>
      </div>
      <div style={styles.rightContainer}>
        <ComponentsList
          components={[
            <IconButton
              color="default"
              disabled={!canRevertLastAction()}
              hint={wordings.homePage.undo}
              iconName="undo"
              onClick={revertLastAction}
            />,
            <IconButton
              color="default"
              disabled={!canRestoreLastAction()}
              hint={wordings.homePage.redo}
              iconName="redo"
              onClick={restoreLastAction}
            />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
        <ComponentsList
          components={[
            <ReportProblemButton onStopAnnotatingDocument={props.onStopAnnotatingDocument} />,
            <IconButton
              color="default"
              iconName="copy"
              onClick={copyToClipboard}
              hint={wordings.homePage.copyToClipboard}
            />,
            <IconButton color="default" iconName="save" onClick={saveDraft} hint={wordings.homePage.saveDraft} />,
            <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.homePage.validate} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </div>
    </div>
  );

  function revertLastAction() {
    addMonitoringEntry({
      type: 'button',
      description: `footer_revert`,
    });
    annotatorStateHandler.revert();
  }

  function restoreLastAction() {
    addMonitoringEntry({
      type: 'button',
      description: `footer_restore`,
    });
    annotatorStateHandler.restore();
  }

  function canRevertLastAction() {
    return annotatorStateHandler.canRevert();
  }

  function canRestoreLastAction() {
    return annotatorStateHandler.canRestore();
  }

  async function copyToClipboard() {
    const anonymizedDocument = anonymizer.anonymizeDocument(annotatorState.document, annotatorState.annotations);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }

  async function saveDraft() {
    await saveAnnotationsAndUpdateAssignationStatus('saved');
  }

  async function validate() {
    addMonitoringEntry({
      type: 'button',
      description: `footer_validate_document_${idModule.lib.convertToString(annotatorState.document._id)}`,
    });
    await saveAnnotationsAndUpdateAssignationStatus('done');
    await sendMonitoringEntries();
    props.onStopAnnotatingDocument();
  }

  async function saveAnnotationsAndUpdateAssignationStatus(status: documentType['status']) {
    try {
      await apiCaller.post<'updateTreatment'>('updateTreatment', {
        annotationsDiff: annotatorStateHandler.getGlobalAnnotationsDiff(),
        documentId: annotatorState.document._id,
      });
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId: annotatorState.document._id,
        status,
      });
      return;
    } catch (error) {
      console.warn(error);
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    footer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      height: heights.annotatorPanelFooter,
    },
    leftContainer: {
      display: 'flex',
      width: widths.annotationsPanel,
    },
    rightContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: widths.documentPanel,
    },
    resetButtonContainer: {
      paddingLeft: theme.spacing * 2,
    },
  };
}
