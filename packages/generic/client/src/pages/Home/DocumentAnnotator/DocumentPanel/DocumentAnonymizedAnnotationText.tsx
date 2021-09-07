import { useAnonymizerBuilder } from '../../../../services/anonymizer';
import React from 'react';
import { annotationType } from '@label/core';

export { DocumentAnonymizedAnnotationText };

function DocumentAnonymizedAnnotationText(props: { annotation: annotationType }) {
  const anonymizerBuilder = useAnonymizerBuilder();
  const anonymizer = anonymizerBuilder.get();

  return <span>{anonymizer.anonymize(props.annotation)}</span>;
}
