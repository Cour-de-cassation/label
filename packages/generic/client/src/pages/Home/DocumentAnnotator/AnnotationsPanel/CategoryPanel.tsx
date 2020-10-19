import React from 'react';
import { anonymizerType, fetchedAnnotationType } from '@label/core';
import { LayoutGrid, Accordion, AccordionHeader, AccordionBody, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { getAnnotationCategoryColor } from '../../../../styles';

export { CategoryPanel };

function CategoryPanel(props: {
  annotationsAndOccurences: Array<{ annotation: fetchedAnnotationType; occurences: number }>;
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  category: string;
}) {
  const style = buildStyle();

  return (
    <Accordion style={style.accordion}>
      <AccordionHeader>
        <LayoutGrid container justifyContent="space-between">
          <LayoutGrid item>
            <Text>{props.category}</Text>
          </LayoutGrid>
          <LayoutGrid item>
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

  function buildStyle() {
    return {
      accordion: {
        backgroundColor: getAnnotationCategoryColor(props.category, props.annotatorStateHandler.get().settings),
      },
    };
  }
}
