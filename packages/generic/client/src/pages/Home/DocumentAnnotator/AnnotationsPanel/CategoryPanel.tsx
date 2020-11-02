import React, { useState } from 'react';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { LayoutGrid, Accordion, Text, Icon } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { Theme, useTheme } from '@material-ui/core';

export { CategoryPanel };

function CategoryPanel(props: {
  annotationsAndOccurences: Array<{ annotation: fetchedAnnotationType; occurences: number }>;
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  category: string;
}) {
  const theme = useTheme();
  const styles = buildStyles(theme);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const categoryName = settingsModule.lib.getAnnotationCategoryText(
    props.category,
    props.annotatorStateHandler.get().settings,
  );

  return (
    <Accordion
      headerStyle={styles.accordionHeader}
      header={
        <LayoutGrid container>
          <LayoutGrid container alignItems="center" xs={11}>
            <LayoutGrid item>
              <div style={styles.iconContainer}>
                <Icon
                  iconName={settingsModule.lib.getAnnotationCategoryIconName(
                    props.category,
                    props.annotatorStateHandler.get().settings,
                  )}
                />
              </div>
            </LayoutGrid>
            <LayoutGrid item style={styles.categoryContainer}>
              <Text>{`${categoryName} (${props.annotationsAndOccurences.length})`}</Text>
            </LayoutGrid>
          </LayoutGrid>
          <LayoutGrid container item alignItems="center" xs={1}>
            <Icon iconName={isExpanded ? 'arrowReduce' : 'arrowExpand'} />
          </LayoutGrid>
        </LayoutGrid>
      }
      body={
        <LayoutGrid container>
          {props.annotationsAndOccurences.map(({ annotation, occurences }) => (
            <LayoutGrid container justifyContent="space-between" item key={annotation.text}>
              <LayoutGrid xs={8} item>
                <Text variant="body2">{annotation.text}</Text>
              </LayoutGrid>
              <LayoutGrid xs={3} item>
                <Text style={styles.anonymizedText} variant="body2">
                  {props.anonymizer.anonymize(annotation)}
                </Text>
              </LayoutGrid>
              <LayoutGrid xs={1} item>
                <Text style={styles.occurencesNumber}>{occurences}</Text>
              </LayoutGrid>
            </LayoutGrid>
          ))}
        </LayoutGrid>
      }
      onChange={setIsExpanded}
    />
  );

  function buildStyles(theme: Theme) {
    const ACCORDION_HEADER_PADDING = 5;
    const ICON_CONTAINER_HEIGHT = theme.shape.borderRadius * 2 - ACCORDION_HEADER_PADDING;

    return {
      accordionHeader: {
        padding: ACCORDION_HEADER_PADDING,
        // Should be set in order to have a fixed header (Material UI dependent)
        minHeight: ICON_CONTAINER_HEIGHT,
        '&$expanded': {
          minHeight: ICON_CONTAINER_HEIGHT,
        },
      },
      iconContainer: {
        width: ICON_CONTAINER_HEIGHT,
        height: ICON_CONTAINER_HEIGHT,
        borderRadius: ICON_CONTAINER_HEIGHT / 2,
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          props.category,
          props.annotatorStateHandler.get().settings,
        ),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      categoryContainer: {
        paddingLeft: theme.spacing(),
      },
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
