import React, { useState } from 'react';
import { ButtonWithIcon, Drawer } from '../../../../components';
import { wordings } from '../../../../wordings';

export { SettingsButton };

function SettingsButton() {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  return (
    <>
      <ButtonWithIcon iconName="settings" onClick={openDrawer} text={wordings.settings} />
      <Drawer onClose={closeDrawer} isOpen={isSettingsDrawerOpen}>
        truc
      </Drawer>
    </>
  );

  function openDrawer() {
    setIsSettingsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsSettingsDrawerOpen(false);
  }
}
