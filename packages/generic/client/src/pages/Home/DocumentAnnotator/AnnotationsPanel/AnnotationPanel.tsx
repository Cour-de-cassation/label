import React from 'react';
import { annotationType } from '@label/core';
import { groupAnnotations } from './lib';

export { AnnotationsPanel };

function AnnotationsPanel(props: { annotations: annotationType[] }) {
  const groupedAnnotations = groupAnnotations(props.annotations);
  return (
    <div>
      {Object.keys(groupedAnnotations).map((annotationCategory) => (
        <div>
          <div key={annotationCategory}>{annotationCategory}</div>
          <div>
            {Object.keys(groupedAnnotations[annotationCategory]).map((annotationText) => (
              <div key={annotationText}>
                <div>{annotationText}</div>
                <div>
                  {groupedAnnotations[annotationCategory][annotationText].map((annotation, index) => (
                    <div key={index}>{annotation.start}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
