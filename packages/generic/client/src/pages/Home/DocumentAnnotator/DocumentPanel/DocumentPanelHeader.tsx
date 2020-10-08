import React, { ReactElement } from 'react';
import { Button, Header, SwitchButton, Text } from '../../../../components';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { isAnonymizedView: boolean; switchAnonymizedView: () => void }): ReactElement {
  return (
    <Header
      leftHeaderComponents={[
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}} text="Ctrl-Z" />,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}} text="Ctrl-Maj-Z" />,
      ]}
      rightHeaderComponents={[
        <Text>Vue anonymisée</Text>,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <SwitchButton checked={props.isAnonymizedView} color="primary" onChange={props.switchAnonymizedView} />,
      ]}
    />
  );
}
