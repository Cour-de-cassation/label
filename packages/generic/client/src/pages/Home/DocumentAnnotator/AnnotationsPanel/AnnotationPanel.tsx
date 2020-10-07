import React from 'react';
import { annotationType } from '@label/core/src';

export { AnnotationsPanel };

function AnnotationsPanel(props: { annotations: annotationType[] }) {
  return (
    <div>
      {props.annotations.map((annotation, index) => (
        <div key={index}>{annotation.category}</div>
      ))}
    </div>
  );
}
