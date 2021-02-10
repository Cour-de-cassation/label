import React, { CSSProperties } from 'react';
import { LayoutGrid, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { customThemeType, heights, useCustomTheme } from '../../../../styles';
import { annotationPerCategoryAndEntityType, splittedTextByLineType } from '../lib';
import { CategoryTable } from './CategoryTable';
import { EmptyCategory } from './EmptyCategory';
import { useEntityEntryHandler } from './useEntityEntryHandler';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  annotationPerCategoryAndEntity: annotationPerCategoryAndEntityType;
  splittedTextByLine: splittedTextByLineType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const entityEntryHandler = useEntityEntryHandler(props.splittedTextByLine);

  return (
    <LayoutGrid style={styles.panel}>
      <LayoutGrid container alignItems="center" style={styles.panelHeader}>
        <LayoutGrid item>
          <Text variant="h2">{wordings.homePage.askedAnnotations}</Text>
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid style={styles.categoriesContainer}>
        {props.annotationPerCategoryAndEntity.map(({ category, categorySize, categoryAnnotations }) => (
          <LayoutGrid key={category} style={styles.category}>
            {categorySize > 0 ? (
              <CategoryTable
                categoryAnnotations={categoryAnnotations}
                category={category}
                categorySize={categorySize}
                entityEntryHandler={entityEntryHandler}
                splittedTextByLine={props.splittedTextByLine}
              />
            ) : (
              <EmptyCategory category={category} />
            )}
          </LayoutGrid>
        ))}
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      panel: {
        width: '100%',
        paddingLeft: theme.spacing * 2,
        paddingRight: theme.spacing * 4,
      },
      panelHeader: {
        height: heights.annotatorPanelHeader,
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.annotatorPanel,
        paddingRight: theme.spacing * 2,
      },
      category: {
        marginBottom: theme.spacing * 2,
      },
    };
  }
}
