import React, { ReactElement } from 'react';
import { Button, Header, SwitchButton, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  switchAnonymizedView: () => void;
}): ReactElement {
  return (
    <Header
      leftHeaderComponents={[
        <Button color="primary" onClick={revertLastAction} iconName="undo" />,
        <Button color="primary" onClick={restoreLastAction} iconName="redo" />,
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
}
