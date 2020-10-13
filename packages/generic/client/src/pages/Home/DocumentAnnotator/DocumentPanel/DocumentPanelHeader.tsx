import React, { ReactElement } from 'react';
import { Button, Header, SwitchButton, Text } from '../../../../components';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { isAnonymizedView: boolean; switchAnonymizedView: () => void }): ReactElement {
  return (
    <Header
      leftHeaderComponents={[
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}}>
          Ctrl-Z
        </Button>,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}}>
          Ctrl-Maj-Z
        </Button>,
      ]}
      rightHeaderComponents={[
        <Text>Vue anonymisée</Text>,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <SwitchButton checked={props.isAnonymizedView} color="primary" onChange={props.switchAnonymizedView} />,
      ]}
    />
  );
}
