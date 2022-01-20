import React, { useState } from 'react';
import { documentModule, documentType } from '@label/core';
import {
  customThemeType,
  useCustomTheme,
  ButtonWithIcon,
  ComponentsList,
  IconButton,
  SwitchButton,
  Text,
} from 'pelta-design-system';
import { apiCaller } from '../../../api';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { useAlert } from '../../../services/alert';
import { useDocumentViewerModeHandler } from '../../../services/documentViewerMode';
import { useMonitoring } from '../../../services/monitoring';
import { widths, heights } from '../../../styles';
import { wordings } from '../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';
import { CopyAnonymizedTextButton } from './CopyAnonymizedTextButton';

export { DocumentAnnotatorFooter };

function DocumentAnnotatorFooter(props: { onStopAnnotatingDocument?: () => Promise<void> }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const [isValidating, setIsValidating] = useState(false);
  const { addMonitoringEntry } = useMonitoring();
  const { displayAlert } = useAlert();

  const documentViewerModeHandler = useDocumentViewerModeHandler();
  const { document } = annotatorStateHandler.get();

  const styles = buildStyles(theme);

  return (
    <div style={styles.footer}>
      <div style={styles.leftContainer}>
        <ComponentsList
          components={[
            <div style={styles.resetButtonContainer}>
              <ButtonWithIcon
                color="default"
                iconName="reset"
                onClick={annotatorStateHandler.reinitialize}
                text={wordings.homePage.reset}
              />
            </div>,
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
        <ComponentsList
          components={[
            <Text>{wordings.homePage.anonymisedView}</Text>,
            <SwitchButton
              checked={documentViewerModeHandler.isAnonymizedView()}
              color="primary"
              onChange={documentViewerModeHandler.switchAnonymizedView}
            />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </div>
      <div style={styles.rightContainer}>
        <ComponentsList components={[]} spaceBetweenComponents={theme.spacing * 2} />
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
    const { onStopAnnotatingDocument } = props;
    const { document } = annotatorStateHandler.get();

    return [
      <ReportProblemButton
        onStopAnnotatingDocument={onStopAnnotatingDocument ? () => onStopAnnotatingDocument() : undefined}
      />,
      <CopyAnonymizedTextButton />,
      document.status !== 'done' ? (
        <ButtonWithIcon
          isLoading={isValidating}
          color="primary"
          iconName="send"
          onClick={validate}
          text={wordings.homePage.validate}
        />
      ) : undefined,
    ];
  }

  async function validate() {
    setIsValidating(true);
    try {
      addMonitoringEntry({
        origin: 'footer',
        action: 'validate_document',
      });
      const nextDocumentStatus = documentModule.lib.getNextStatus({
        status: document.status,
        publicationCategory: document.publicationCategory,
        route: document.route,
      });
      await setDocumentStatus(document._id, nextDocumentStatus);
      props.onStopAnnotatingDocument && (await props.onStopAnnotatingDocument());
    } finally {
      setIsValidating(false);
    }
  }

  async function setDocumentStatus(documentId: documentType['_id'], status: documentType['status']) {
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId,
        status,
      });
    } catch (error) {
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateDocumentStatusFailed, autoHide: true });
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
      justifyContent: 'space-between',
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
