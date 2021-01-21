import React from 'react';
import { settingsModule } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { LayoutGrid, Text, CategoryIcon } from '../../../../components';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';

export { EmptyCategory };

function EmptyCategory(props: { category: string }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.large;
  const styles = buildStyles(theme);
  const annotatorState = annotatorStateHandler.get();

  const categoryName = settingsModule.lib.getAnnotationCategoryText(props.category, annotatorState.settings);

  return (
    <LayoutGrid container item alignItems="center" xs={11}>
      <LayoutGrid item style={styles.categoryIconContainer}>
        <CategoryIcon category={props.category} iconSize={iconSize} settings={annotatorState.settings} />
      </LayoutGrid>
      <LayoutGrid item style={styles.categoryTextContainer}>
        <Text style={styles.text}>{`${categoryName} (0)`}</Text>
      </LayoutGrid>
    </LayoutGrid>
  );
  function buildStyles(theme: customThemeType) {
    return {
      categoryIconContainer: {
        paddingLeft: theme.spacing,
      },
      categoryTextContainer: {
        paddingLeft: theme.spacing * 1.5,
      },
      text: {
        color: theme.colors.disabled.color,
      },
    } as const;
  }
}
