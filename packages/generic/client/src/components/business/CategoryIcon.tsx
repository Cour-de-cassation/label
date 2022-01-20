import React from 'react';
import { settingsModule, settingsType } from '@label/core';
import { getColor, useDisplayMode, CircleIcon } from 'pelta-design-system';

export { CategoryIcon };

function CategoryIcon(props: { settings: settingsType; category: string; iconSize: number; isDisabled?: boolean }) {
  const { displayMode } = useDisplayMode();
  const backgroundColor = getColor(
    settingsModule.lib.getAnnotationCategoryColor(props.category, props.settings, displayMode),
  );

  return (
    <CircleIcon
      isDisabled={props.isDisabled}
      backgroundColor={backgroundColor}
      iconSize={props.iconSize}
      iconName={settingsModule.lib.getAnnotationCategoryIconName(props.category, props.settings)}
    />
  );
}
