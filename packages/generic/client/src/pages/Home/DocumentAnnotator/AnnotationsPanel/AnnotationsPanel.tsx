import React from 'react';
import { annotationType, anonymizerType } from '@label/core';
import { LayoutGrid, Text } from '../../../../components';
import { wordings } from '../../../../wordings';
import { groupAnnotations } from './lib';
import { CategoryPanel } from './CategoryPanel';

export { AnnotationsPanel };

function AnnotationsPanel(props: { annotations: annotationType[]; anonymizer: anonymizerType }) {
  const groupedAnnotations = groupAnnotations(props.annotations);
  return (
    <LayoutGrid>
      <LayoutGrid container justifyContent="space-between" alignItems="center">
        <LayoutGrid item>
          <Text variant="h1">{wordings.askedAnnotations}</Text>
        </LayoutGrid>
        <LayoutGrid item>
          <Text variant="subtitle1">{wordings.annotationGuide}</Text>
        </LayoutGrid>
      </LayoutGrid>
      {Object.entries(groupedAnnotations).map(([annotationCategory, annotationsAndOccurences]) => (
        <LayoutGrid key={annotationCategory}>
          <CategoryPanel
            annotationsAndOccurences={annotationsAndOccurences}
            anonymizer={props.anonymizer}
            category={annotationCategory}
          />
        </LayoutGrid>
      ))}
    </LayoutGrid>
  );
}
