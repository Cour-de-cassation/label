import React from 'react';
import { settingsModule } from '@label/core';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { Icon } from '../generic';
import { getColor, useCustomTheme, customThemeType, useDisplayMode } from '../../styles';

export { CategoryIcon };

function CategoryIcon(props: { annotatorStateHandler: annotatorStateHandlerType; category: string; iconSize: number }) {
  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const styles = buildStyles(theme);

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

  function buildStyles(theme: customThemeType) {
    return {
      categoryIcon: {
        width: props.iconSize,
        height: props.iconSize,
        borderRadius: props.iconSize / 2,
        backgroundColor: getColor(
          settingsModule.lib.getAnnotationCategoryColor(
            props.category,
            props.annotatorStateHandler.get().settings,
            displayMode,
          ),
        ),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        color: theme.colors.icon,
        fontSize: (props.iconSize * 2) / 3,
      },
    } as const;
  }
}
