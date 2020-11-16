import React, { CSSProperties, useState } from 'react';
import { uniq } from 'lodash';
import { LayoutGrid, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { wordings } from '../../../../wordings';
import { customThemeType, heights, useCustomTheme } from '../../../../styles';
import { CategoryTable } from './CategoryTable';
import { EntityDrawer } from './EntityDrawer';
import { useEntityEntryHandler } from './useEntityEntryHandler';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const categories = uniq(props.annotatorStateHandler.get().annotations.map((annotation) => annotation.category));
  const [isEntityDrawerOpen, setIsEntityDrawerOpen] = useState<boolean>(false);
  const entityEntryHandler = useEntityEntryHandler(() => setIsEntityDrawerOpen(true));

  return (
    <LayoutGrid onMouseLeave={entityEntryHandler.unfocusEntity} style={styles.panel}>
      <LayoutGrid container alignItems="center" style={styles.panelHeader}>
        <LayoutGrid item>
          <Text variant="h2">{wordings.askedAnnotations}</Text>
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid style={styles.categoriesContainer}>
        {categories.map((category) => (
          <LayoutGrid key={category} style={styles.category}>
            <CategoryTable
              annotatorStateHandler={props.annotatorStateHandler}
              anonymizer={props.anonymizer}
              category={category}
              entityEntryHandler={entityEntryHandler}
            />
          </LayoutGrid>
        ))}
      </LayoutGrid>
      <EntityDrawer
        annotatorStateHandler={props.annotatorStateHandler}
        anonymizer={props.anonymizer}
        entityId={entityEntryHandler.getEntitySelected() || ''}
        isOpen={isEntityDrawerOpen}
        onClose={() => setIsEntityDrawerOpen(false)}
      />
    </LayoutGrid>
  );

  function buildStyles(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      panel: {
        paddingLeft: theme.spacing * 2,
        paddingRight: theme.spacing * 4,
      },
      panelHeader: {
        height: heights.panelHeader,
      },
      categoriesContainer: {
        overflowY: 'auto',
        height: heights.panel,
      },
      category: {
        marginBottom: theme.spacing * 3,
      },
    };
  }
}
