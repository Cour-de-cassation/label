import React from 'react';
import { annotationType } from '@label/core';
import orderBy from 'lodash/orderBy';
import { groupAnnotations } from './lib';
import { LayoutGrid, Accordion, AccordionHeader, AccordionBody } from '../../../../components';

export { AnnotationsPanel };

function AnnotationsPanel(props: { annotations: annotationType[] }) {
  const groupedAnnotations = groupAnnotations(props.annotations);
  return (
    <LayoutGrid>
      {Object.keys(groupedAnnotations).map((annotationCategory) => (
        <LayoutGrid item key={annotationCategory}>
          <Accordion>
            <AccordionHeader>
              <LayoutGrid container justifyContent="space-between">
                <LayoutGrid item>{annotationCategory}</LayoutGrid>
                <LayoutGrid item>{Object.keys(groupedAnnotations[annotationCategory]).length}</LayoutGrid>
              </LayoutGrid>
            </AccordionHeader>
            <AccordionBody>
              <LayoutGrid container>
                {sortByOccurrences(groupedAnnotations, annotationCategory).map((annotationText) => (
                  <LayoutGrid container justifyContent="space-between" item key={annotationText}>
                    <LayoutGrid xs={8} item>
                      {annotationText}
                    </LayoutGrid>
                    <LayoutGrid xs={1} item>
                      {groupedAnnotations[annotationCategory][annotationText].length}
                    </LayoutGrid>
                  </LayoutGrid>
                ))}
              </LayoutGrid>
            </AccordionBody>
          </Accordion>
        </LayoutGrid>
      ))}
    </LayoutGrid>
  );

  function sortByOccurrences(
    groupedAnnotations: {
      [key: string]: {
        [key: string]: annotationType[];
      };
    },
    annotationCategory: string,
  ) {
    return orderBy(
      Object.keys(groupedAnnotations[annotationCategory]),
      (annotationText) => groupedAnnotations[annotationCategory][annotationText].length,
      'desc',
    );
  }
}
