import React from 'react';
import { settingsModule, settingsType } from '@label/core';
import { getColor, useDisplayMode } from '../../styles';
import { CircleIcon } from '../generic';

export { CategoryIcon };

function CategoryIcon(props: { settings: settingsType; category: string; iconSize: number }) {
  const { displayMode } = useDisplayMode();
  const backgroundColor = getColor(
    settingsModule.lib.getAnnotationCategoryColor(props.category, props.settings, displayMode),
  );

  return (
    <CircleIcon
      backgroundColor={backgroundColor}
      iconSize={props.iconSize}
      iconName={settingsModule.lib.getAnnotationCategoryIconName(props.category, props.settings)}
    />
  );
}
