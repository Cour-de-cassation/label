import React from 'react';
import { assignationType } from '@label/core';
import { heights } from '../../../../styles';
import { ButtonWithIcon, LayoutGrid } from '../../../../components';
import { useGraphQLMutation } from '../../../../graphQL';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { useTheme, Theme } from '@material-ui/core';

export { DocumentPanelFooter };

function DocumentPanelFooter(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const theme = useTheme();
  const styles = buildStyles(theme);
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
        <ButtonWithIcon
          color="default"
          iconName="save"
          onClick={saveDraft}
          style={styles.saveDraftButton}
          text={wordings.saveDraft}
        />
        <ButtonWithIcon color="primary" iconName="send" onClick={validate} text={wordings.validate} />
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: Theme) {
    return {
      footer: {
        height: heights.panelFooter,
        paddingRight: theme.spacing(2),
      },
      saveDraftButton: {
        marginRight: theme.spacing(2),
      },
    };
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
