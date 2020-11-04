import { Theme, useTheme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Header, IconButton, SwitchButton, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  switchAnonymizedView: () => void;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);
  return (
    <Header
      leftHeaderComponents={[
        <IconButton
          color="default"
          disabled={!canRevertLastAction()}
          hint={wordings.undo}
          iconName="undo"
          onClick={revertLastAction}
        />,
        <div style={style.spaceBetweenButtons} />,
        <IconButton
          color="default"
          disabled={!canRestoreLastAction()}
          hint={wordings.redo}
          iconName="redo"
          onClick={restoreLastAction}
        />,
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

  function buildStyle(theme: Theme) {
    return {
      spaceBetweenButtons: {
        paddingRight: theme.spacing(3),
      },
    };
  }
}
