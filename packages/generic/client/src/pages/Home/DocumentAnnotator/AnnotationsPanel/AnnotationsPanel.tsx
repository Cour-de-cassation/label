import React from 'react';
import { anonymizerType } from '@label/core';
import { LayoutGrid, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { heights } from '../../../../styles';
import { fetchedAnnotationType } from '../../../../types';
import { groupAnnotations } from './lib';
import { CategoryPanel } from './CategoryPanel';

export { AnnotationsPanel };

function AnnotationsPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
}) {
  const groupedAnnotations = groupAnnotations(props.annotatorStateHandler.get().annotations);
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
              annotatorStateHandler={props.annotatorStateHandler}
              anonymizer={props.anonymizer}
              category={annotationCategory}
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
