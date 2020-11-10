import React, { useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { wordings } from '../../../../wordings';
import { SettingsDrawer } from './SettingsDrawer';

export { SettingsButton };

function SettingsButton() {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  return (
    <>
      <ButtonWithIcon iconName="settings" onClick={toggleDrawer} text={wordings.settings} />
      <SettingsDrawer isOpen={isSettingsDrawerOpen} close={closeDrawer} />
    </>
  );

  function toggleDrawer() {
    setIsSettingsDrawerOpen(!isSettingsDrawerOpen);
  }

  function closeDrawer() {
    setIsSettingsDrawerOpen(false);
  }
}
