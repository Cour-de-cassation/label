import React, { useState } from 'react';
import { uniq } from 'lodash';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { DeleteAnnotationButton, LayoutGrid, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../styles';

export { CategoryTableEntry };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntry(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  entityId: string;
}) {
  const [hovered, setHovered] = useState<boolean>(false);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const entityAnnotations = props.annotatorStateHandler
    .get()
    .annotations.filter((annotation) => annotation.entityId === props.entityId);
  const entityAnnotationTexts = uniq(entityAnnotations.map((annotation) => annotation.text));

  return (
    <LayoutGrid
      container
      key={entityAnnotations[0].entityId}
      item
      justifyContent="space-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={styles.categoryTableEntry}
    >
      <LayoutGrid item style={styles.textCell} xs={8}>
        {entityAnnotationTexts.map((text) => (
          <Text variant="body2">{text}</Text>
        ))}
      </LayoutGrid>
      <LayoutGrid item style={styles.textCell} xs={3}>
        <Text style={styles.anonymizedText} variant="body2">
          {props.anonymizer.anonymize(entityAnnotations[0])}
        </Text>
      </LayoutGrid>
      <LayoutGrid item style={hovered ? styles.actionCell : styles.textCell} xs={1}>
        {hovered ? (
          <DeleteAnnotationButton
            annotatorStateHandler={props.annotatorStateHandler}
            annotation={entityAnnotations[0]}
            buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={() => {}}
            shouldApplyEverywhere={true}
          />
        ) : (
          <Text style={styles.occurencesNumber}>{entityAnnotations.length}</Text>
        )}
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: customThemeType) {
    return {
      actionCell: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing / 2}px 0`,
      },
      anonymizedText: {
        fontStyle: 'italic',
      },
      categoryTableEntry: {
        backgroundColor: hovered ? '#FF0000' : undefined,
        borderRadius: theme.shape.borderRadius,
        paddingLeft: `${theme.spacing * 2}px`,
      },
      occurencesNumber: {
        textAlign: 'right',
        paddingRight: theme.spacing * 3,
      },
      textCell: {
        padding: `${theme.spacing}px 0`,
      },
    } as const;
  }
}
