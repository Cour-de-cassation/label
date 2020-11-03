import React from 'react';
import { settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { Icon } from '../generic';

export { CategoryIcon };

function CategoryIcon(props: { annotatorStateHandler: annotatorStateHandlerType; category: string; iconSize: number }) {
  const styles = buildStyles();

  return (
    <div style={styles.categoryIcon}>
      <Icon
        iconName={settingsModule.lib.getAnnotationCategoryIconName(
          props.category,
          props.annotatorStateHandler.get().settings,
        )}
        style={styles.icon}
      />
    </div>
  );

  function buildStyles() {
    return {
      categoryIcon: {
        width: props.iconSize,
        height: props.iconSize,
        borderRadius: props.iconSize / 2,
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          props.category,
          props.annotatorStateHandler.get().settings,
        ),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        fontSize: (props.iconSize * 2) / 3,
      },
    } as const;
  }
}
