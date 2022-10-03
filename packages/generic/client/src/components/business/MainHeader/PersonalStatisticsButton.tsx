import React, { useState } from 'react';
import { IconButton } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { PersonalStatisticsDrawer } from './PersonalStatisticsDrawer';

export { PersonalStatisticsButton };

function PersonalStatisticsButton() {
  const [isPersonalStatisticsDrawerOpen, setIsPersonalStatisticsDrawerOpen] = useState(false);

  return (
    <>
      <IconButton iconName="statistics" onClick={toggleDrawer} hint={wordings.shared.personalStatisticsDrawer.title} />
      <PersonalStatisticsDrawer isOpen={isPersonalStatisticsDrawerOpen} close={closeDrawer} />
    </>
  );

  function toggleDrawer() {
    setIsPersonalStatisticsDrawerOpen(!isPersonalStatisticsDrawerOpen);
  }

  function closeDrawer() {
    setIsPersonalStatisticsDrawerOpen(false);
  }
}
