import React, { useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { wordings } from '../../../../wordings';
import { SettingsDrawer } from './SettingsDrawer';

export { SettingsButton };

function SettingsButton() {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(true);

  return (
    <>
      <ButtonWithIcon iconName="settings" onClick={openDrawer} text={wordings.settings} />
      <SettingsDrawer isOpen={isSettingsDrawerOpen} close={closeDrawer} />
    </>
  );

  function openDrawer() {
    setIsSettingsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsSettingsDrawerOpen(false);
  }
}
