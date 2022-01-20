import React from 'react';
import { settingsModule } from '@label/core';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { CategoryIcon } from '../../../../components';

export { StrickenCategory };

function StrickenCategory(props: { category: string }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.l;
  const styles = buildStyles(theme);
  const annotatorState = annotatorStateHandler.get();

  const categoryName = settingsModule.lib.getAnnotationCategoryText(props.category, annotatorState.settings);

  return (
    <div style={styles.container}>
      <div style={styles.categoryIconContainer}>
        <CategoryIcon isDisabled category={props.category} iconSize={iconSize} settings={annotatorState.settings} />
      </div>
      <div style={styles.categoryTextContainer}>
        <Text style={styles.text}>{categoryName}</Text>
      </div>
    </div>
  );
  function buildStyles(theme: customThemeType) {
    return {
      container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
      },
      categoryIconContainer: {
        paddingLeft: theme.spacing,
      },
      categoryTextContainer: {
        paddingLeft: theme.spacing,
      },
      text: {
        textDecoration: 'line-through',
        color: theme.colors.disabled.color,
      },
    } as const;
  }
}
