import React from 'react';
import { assignationType } from '@label/core';
import { heights, useCustomTheme } from '../../../../styles';
import { ButtonWithIcon, ComponentsList, LayoutGrid } from '../../../../components';
import { useGraphQLMutation } from '../../../../graphQL';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { wordings } from '../../../../wordings';

export { DocumentPanelFooter };

function DocumentPanelFooter(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  const annotatorState = props.annotatorStateHandler.get();

  const [saveAnnotations] = useGraphQLMutation<'annotations'>('annotations');
  const [updateAssignationStatus] = useGraphQLMutation<'updateAssignationStatus'>('updateAssignationStatus');

  return (
    <LayoutGrid container style={styles.footer} justifyContent="space-between" alignItems="center">
      <LayoutGrid item>
        <ButtonWithIcon
          color="default"
          iconName="reset"
          onClick={() => props.annotatorStateHandler.reinitialize()}
          text={wordings.reset}
        />
      </LayoutGrid>
      <LayoutGrid item>
        <ComponentsList
          components={[
            <ButtonWithIcon
              color="default"
              iconName="copy"
              onClick={copyToClipboard}
              text={wordings.copyToClipboard}
            />,
            <ButtonWithIcon color="default" iconName="save" onClick={saveDraft} text={wordings.saveDraft} />,
            <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.validate} />,
          ]}
          spaceBetweenComponents={theme.spacing * 2}
        />
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      footer: {
        height: heights.panelFooter,
      },
    };
  }

  async function copyToClipboard() {
    const anonymizedDocument = props.anonymizer.anonymizeDocument(annotatorState.document, annotatorState.annotations);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }

  async function saveDraft() {
    await saveAnnotationsAndUpdateAssignationStatus('saved');
  }

  async function validate() {
    await saveAnnotationsAndUpdateAssignationStatus('done');
    await props.fetchNewDocument();
  }

  async function saveAnnotationsAndUpdateAssignationStatus(status: assignationType['status']) {
    await saveAnnotations({
      variables: {
        documentId: annotatorState.document._id,
        fetchedGraphQLAnnotations: annotatorState.annotations,
      },
    });
    await updateAssignationStatus({
      variables: { documentId: annotatorState.document._id, status },
    });
  }
}
