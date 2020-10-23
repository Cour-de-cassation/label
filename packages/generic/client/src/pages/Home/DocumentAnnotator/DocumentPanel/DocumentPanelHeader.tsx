import { Theme, useTheme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Button, Header, SwitchButton, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  switchAnonymizedView: () => void;
}): ReactElement {
  const theme = useTheme();
  const styles = buildStyles(theme);
  return (
    <Header
      leftHeaderComponents={[
        <Button
          disabled={!canRevertLastAction()}
          color="default"
          onClick={revertLastAction}
          iconName="undo"
          style={styles.undoButton}
        />,
        <Button disabled={!canRestoreLastAction()} color="default" onClick={restoreLastAction} iconName="redo" />,
      ]}
      rightHeaderComponents={[
        <Text>Vue anonymisée</Text>,
        <SwitchButton checked={props.isAnonymizedView} color="primary" onChange={props.switchAnonymizedView} />,
      ]}
    />
  );

  function revertLastAction() {
    props.annotatorStateHandler.revert();
  }

  function restoreLastAction() {
    props.annotatorStateHandler.restore();
  }

  function canRevertLastAction() {
    return props.annotatorStateHandler.canRevert();
  }

  function canRestoreLastAction() {
    return props.annotatorStateHandler.canRestore();
  }

  function buildStyles(theme: Theme) {
    return {
      undoButton: {
        marginRight: theme.spacing(),
      },
    };
  }
}
