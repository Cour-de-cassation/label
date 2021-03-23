import React from 'react';
import { documentType } from '@label/core';
import { apiCaller } from '../../../api';
import { ButtonWithIcon, ComponentsList, IconButton } from '../../../components';
import { useMonitoring } from '../../../services/monitoring';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorFooter };

function DocumentAnnotatorFooter(props: { onStopAnnotatingDocument?: () => void }) {
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
              disabled={!canRevertLastAction()}
              hint={wordings.homePage.undo}
              iconName="undo"
              onClick={revertLastAction}
            />,
            <IconButton
              disabled={!canRestoreLastAction()}
              hint={wordings.homePage.redo}
              iconName="redo"
              onClick={restoreLastAction}
            />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />

        <ComponentsList components={buildRightComponents()} spaceBetweenComponents={theme.spacing * 2} />
      </div>
    </div>
  );

  function revertLastAction() {
    addMonitoringEntry({
      action: 'revert',
      origin: 'footer',
    });
    annotatorStateHandler.revert();
  }

  function restoreLastAction() {
    addMonitoringEntry({
      action: 'restore',
      origin: 'footer',
    });
    annotatorStateHandler.restore();
  }

  function canRevertLastAction() {
    return annotatorStateHandler.canRevert();
  }

  function canRestoreLastAction() {
    return annotatorStateHandler.canRestore();
  }

  function buildRightComponents() {
    if (props.onStopAnnotatingDocument) {
      return [
        <ReportProblemButton onStopAnnotatingDocument={props.onStopAnnotatingDocument} />,
        <IconButton iconName="copy" onClick={copyToClipboard} hint={wordings.shared.copyToClipboard} />,
        <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.homePage.validate} />,
      ];
    }
    return [<IconButton iconName="copy" onClick={copyToClipboard} hint={wordings.shared.copyToClipboard} />];
  }

  async function copyToClipboard() {
    const anonymizedDocument = anonymizer.anonymizeDocument(annotatorState.document, annotatorState.annotations);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }

  async function validate() {
    addMonitoringEntry({
      origin: 'footer',
      action: 'validate_document',
    });
    await saveAnnotationsAndUpdateAssignationStatus('done');
    await sendMonitoringEntries();
    props.onStopAnnotatingDocument && props.onStopAnnotatingDocument();
  }

  async function saveAnnotationsAndUpdateAssignationStatus(status: documentType['status']) {
    try {
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
