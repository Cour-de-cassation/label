import React from 'react';
import { apiRouteOutType } from '@label/core';

export { AnnotationsDiffDetails };

function AnnotationsDiffDetails(props: { annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'> }) {
  const sortedAnnotationsDiffDetails = mapAnnotationsDiffDetails(props.annotationsDiffDetails);
  return (
    <div>
      {sortedAnnotationsDiffDetails.map(({ text }) => {
        return (
          <div>
            <div>{text}</div>
            <div>{text}</div>
          </div>
        );
      })}
    </div>
  );
}

function mapAnnotationsDiffDetails(annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'>) {
  const mappedAnnotationsDiffDetails = [
    ...annotationsDiffDetails.addedAnnotations.map(({ text, textStart, addedAnnotation }) => ({
      text,
      textStart,
      annotationBefore: undefined,
      annotationAfter: addedAnnotation,
    })),
    ...annotationsDiffDetails.deletedAnnotations.map(({ text, textStart, deletedAnnotation }) => ({
      text,
      textStart,
      annotationBefore: deletedAnnotation,
      annotationAfter: undefined,
    })),
    ...annotationsDiffDetails.categoryChangedAnnotations,
    ...annotationsDiffDetails.resizedBiggerAnnotations,
    ...annotationsDiffDetails.resizedSmallerAnnotations,
  ];

  return mappedAnnotationsDiffDetails.sort(
    ({ textStart: textStartA }, { textStart: textStartB }) => textStartA - textStartB,
  );
}
