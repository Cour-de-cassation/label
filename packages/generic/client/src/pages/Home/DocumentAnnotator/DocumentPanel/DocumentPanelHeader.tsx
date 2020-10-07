import React, { ReactElement } from 'react';
import { Header } from '../../../../components/Header';
import { Button, SwitchButton } from '../../../../components/buttons';

export { DocumentPanelHeader };

function DocumentPanelHeader(): ReactElement {
  return (
    <Header
      leftHeaderComponents={[
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}} text="Ctrl-Z" />,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Button color="primary" onClick={() => {}} text="Ctrl-Maj-Z" />,
      ]}
      rightHeaderComponents={[
        <div>Vue Anonymisée</div>,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <SwitchButton checked={false} color="primary" onChange={() => {}} />,
      ]}
    />
  );
}
