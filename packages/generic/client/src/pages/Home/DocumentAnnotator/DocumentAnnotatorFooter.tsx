import React from 'react';
import { documentType } from '@label/core';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { ButtonWithIcon, ComponentsList, IconButton } from '../../../components';
import { useGraphQLMutation } from '../../../graphQL';
import { annotatorStateHandlerType } from '../../../services/annotatorState';
import { clientAnonymizerType } from '../../../types';
import { wordings } from '../../../wordings';

export { DocumentAnnotatorFooter };

function DocumentAnnotatorFooter(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  onStopAnnotatingDocument: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const annotatorState = props.annotatorStateHandler.get();

  const [saveAnnotations] = useGraphQLMutation<'annotations'>('annotations');
  const [updateDocumentStatus] = useGraphQLMutation<'updateDocumentStatus'>('updateDocumentStatus');

  return (
    <div style={styles.footer}>
      <div style={styles.leftContainer}>
        <div style={styles.resetButtonContainer}>
          <ButtonWithIcon
            color="default"
            iconName="reset"
            onClick={props.annotatorStateHandler.reinitialize}
            text={wordings.reset}
          />
        </div>
      </div>
      <div style={styles.rightContainer}>
        <ComponentsList
          components={[
            <IconButton color="default" iconName="copy" onClick={copyToClipboard} hint={wordings.copyToClipboard} />,
            <IconButton color="default" iconName="save" onClick={saveDraft} hint={wordings.saveDraft} />,
            <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.validate} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </div>
    </div>
  );

  async function copyToClipboard() {
    const anonymizedDocument = props.anonymizer.anonymizeDocument(annotatorState.document, annotatorState.annotations);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }

  async function saveDraft() {
    await saveAnnotationsAndUpdateAssignationStatus('saved');
  }

  async function validate() {
    await saveAnnotationsAndUpdateAssignationStatus('done');
    props.onStopAnnotatingDocument();
  }

  async function saveAnnotationsAndUpdateAssignationStatus(status: documentType['status']) {
    await saveAnnotations({
      variables: {
        documentId: annotatorState.document._id,
        fetchedGraphQLAnnotations: annotatorState.annotations,
      },
    });
    await updateDocumentStatus({
      variables: { documentId: annotatorState.document._id, status },
    });
  }
}

function buildStyles(theme: customThemeType) {
  return {
    footer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      height: heights.panelFooter,
    },
    leftContainer: {
      display: 'flex',
      width: widths.annotationsPanel,
    },
    rightContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: widths.documentPanel,
    },
    resetButtonContainer: {
      paddingLeft: theme.spacing * 2,
    },
  };
}
