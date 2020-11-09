import React from 'react';
import { uniq } from 'lodash';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { LayoutGrid, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { Theme, useTheme } from '@material-ui/core';

export { CategoryTableEntry };

function CategoryTableEntry(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  entityId: string;
}) {
  const theme = useTheme();
  const styles = buildStyles(theme);

  const entityAnnotations = props.annotatorStateHandler
    .get()
    .annotations.filter((annotation) => annotation.entityId === props.entityId);
  const entityAnnotationTexts = uniq(entityAnnotations.map((annotation) => annotation.text));

  return (
    <LayoutGrid container justifyContent="space-between" item key={entityAnnotations[0].entityId}>
      <LayoutGrid xs={8} item>
        {entityAnnotationTexts.map((text) => (
          <Text variant="body2">{text}</Text>
        ))}
      </LayoutGrid>
      <LayoutGrid xs={3} item>
        <Text style={styles.anonymizedText} variant="body2">
          {props.anonymizer.anonymize(entityAnnotations[0])}
        </Text>
      </LayoutGrid>
      <LayoutGrid xs={1} item>
        <Text style={styles.occurencesNumber}>{entityAnnotations.length}</Text>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: Theme) {
    return {
      anonymizedText: {
        fontStyle: 'italic',
      },
      occurencesNumber: {
        textAlign: 'right',
        paddingRight: theme.spacing(3),
      },
    } as const;
  }
}
