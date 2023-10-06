import React, { createContext, ReactElement, ReactNode } from 'react';
import { buildAnonymizer, annotationType, fetchedDocumentType, replacementTermType, settingsType } from '@label/core';
import { anonymizerBuilderType, buildAnonymizerBuilder } from './buildAnonymizerBuilder';

export { AnonymizerBuilderContext, AnonymizerBuilderContextProvider };

const AnonymizerBuilderContext = createContext<anonymizerBuilderType>({
  get: () => buildAnonymizer({}, [], -1),
});

function AnonymizerBuilderContextProvider({
  annotations,
  children,
  document,
  settings,
  mandatoryReplacementTerms,
}: {
  annotations: annotationType[];
  children: ReactNode;
  document: fetchedDocumentType;
  settings: settingsType;
  mandatoryReplacementTerms: replacementTermType[];
}): ReactElement {
  const { anonymizerBuilder } = buildAnonymizerBuilder({
    settings,
    annotations,
    document,
    mandatoryReplacementTerms,
  });

  return <AnonymizerBuilderContext.Provider value={anonymizerBuilder}>{children}</AnonymizerBuilderContext.Provider>;
}
