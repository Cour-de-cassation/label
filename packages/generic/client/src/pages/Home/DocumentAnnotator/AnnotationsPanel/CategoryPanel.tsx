import React from 'react';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { LayoutGrid, Accordion, AccordionHeader, AccordionBody, Text, Icon } from '../../../../components';
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
  return (
    <Accordion>
      <AccordionHeader style={styles.accordionHeader}>
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
              <Text>{props.category}</Text>
            </LayoutGrid>
          </LayoutGrid>
          <LayoutGrid container item alignItems="center" xs={1}>
            <Text>{props.annotationsAndOccurences.length}</Text>
          </LayoutGrid>
        </LayoutGrid>
      </AccordionHeader>
      <AccordionBody>
        <LayoutGrid container>
          {props.annotationsAndOccurences.map(({ annotation, occurences }) => (
            <LayoutGrid container justifyContent="space-between" item key={annotation.text}>
              <LayoutGrid xs={8} item>
                <Text>{annotation.text}</Text>
              </LayoutGrid>
              <LayoutGrid xs={3} item>
                <Text>{props.anonymizer.anonymize(annotation)}</Text>
              </LayoutGrid>
              <LayoutGrid xs={1} item>
                <Text>{occurences}</Text>
              </LayoutGrid>
            </LayoutGrid>
          ))}
        </LayoutGrid>
      </AccordionBody>
    </Accordion>
  );

  function buildStyles(theme: Theme) {
    const ACCORDION_HEADER_PADDING = 2;
    const ICON_CONTAINER_HEIGHT = theme.shape.borderRadius * 2 - ACCORDION_HEADER_PADDING;
    return {
      accordionHeader: {
        padding: ACCORDION_HEADER_PADDING,
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
    };
  }
}
