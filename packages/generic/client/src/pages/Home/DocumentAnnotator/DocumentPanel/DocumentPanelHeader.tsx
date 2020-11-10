import React, { ReactElement } from 'react';
import { Header, IconButton, SwitchButton, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { heights, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  switchAnonymizedView: () => void;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle();

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
      spaceBetweenComponents={theme.spacing * 2}
      style={style.header}
      variant="classic"
    />
  );

  function buildStyle() {
    return {
      header: {
        height: heights.panelHeader,
      },
    };
  }

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
}
