import React, { CSSProperties } from 'react';
import { Text } from '../../../../components';
import { customThemeType, heights, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
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
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <Text variant="h2">{wordings.homePage.askedAnnotations}</Text>
      </div>
      <div style={styles.categoriesContainer}>
        {props.annotationPerCategoryAndEntity.map(({ category, categorySize, categoryAnnotations }) => (
          <div key={category} style={styles.category}>
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
          </div>
        ))}
      </div>
    </div>
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
        display: 'flex',
        alignItems: 'center',
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.annotatorPanel,
        paddingRight: theme.spacing * 2,
      },
      category: {
        marginBottom: theme.spacing,
      },
    };
  }
}
