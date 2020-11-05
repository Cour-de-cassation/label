import React from 'react';
import { Drawer } from '../../../../components';

export { SettingsDrawer };

function SettingsDrawer(props: { close: () => void; isOpen: boolean }) {
  return (
    <Drawer onClose={props.close} isOpen={props.isOpen}>
      truc
    </Drawer>
  );
}
