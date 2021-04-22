import React, { useState } from 'react';
import { wordings } from '../../../wordings';
import { IconButton } from '../../generic';
import { SettingsDrawer } from './SettingsDrawer';

export { SettingsButton };

function SettingsButton() {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  return (
    <>
      <IconButton iconName="settings" onClick={toggleDrawer} hint={wordings.shared.settingsDrawer.title} />
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
