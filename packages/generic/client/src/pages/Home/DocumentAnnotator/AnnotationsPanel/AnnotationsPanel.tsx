import React from 'react';
import { annotationType, anonymizerType, settingsType } from '@label/core';
import { LayoutGrid, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { heights } from '../../../../styles';
import { groupAnnotations } from './lib';
import { CategoryPanel } from './CategoryPanel';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  annotations: annotationType[];
  anonymizer: anonymizerType;
  settings: settingsType;
}) {
  const groupedAnnotations = groupAnnotations(props.annotations);
  const styles = buildStyles();
  return (
    <LayoutGrid>
      <LayoutGrid container justifyContent="space-between" alignItems="center" style={styles.panelHeader}>
        <LayoutGrid item>
          <Text variant="h1">{wordings.askedAnnotations}</Text>
        </LayoutGrid>
        <LayoutGrid item>
          <Text variant="subtitle1">{wordings.annotationGuide}</Text>
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid style={styles.panel}>
        {Object.entries(groupedAnnotations).map(([annotationCategory, annotationsAndOccurences]) => (
          <LayoutGrid key={annotationCategory}>
            <CategoryPanel
              annotationsAndOccurences={annotationsAndOccurences}
              anonymizer={props.anonymizer}
              category={annotationCategory}
              settings={props.settings}
            />
          </LayoutGrid>
        ))}
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      panelHeader: {
        height: heights.panelHeader,
      },
      panel: {
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        overflowY: 'auto' as 'auto',
        height: heights.panel,
      },
    };
  }
}
