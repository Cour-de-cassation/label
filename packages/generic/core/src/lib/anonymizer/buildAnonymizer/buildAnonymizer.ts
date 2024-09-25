import { annotationType } from '../../../modules/annotation';
import { fetchedDocumentType } from '../../../modules/document';
import { settingsType } from '../../../modules/settings';
import { textSplitter } from '../../textSplitter';
import { buildEntityIdMapper } from './buildEntityIdMapper';
import { ANONYMIZATION_DEFAULT_TEXT } from './constants';

export { buildAnonymizer };

export type { anonymizerType };

export type ReplacementTermDict = {
  [key: string]: {
    replacementTerm: string;
    instances: string[];
    category: string;
  };
};

type anonymizerType<documentT extends fetchedDocumentType> = {
  anonymizeDocument: (document: documentT) => documentT;
  anonymize: (annotation: annotationType) => string;
  extractReplacementTerms: () => any;
};

function buildAnonymizer<documentT extends fetchedDocumentType>(
  settings: settingsType,
  annotations: annotationType[],
  seed: number,
): anonymizerType<documentT> {
  const mapper: { [key: string]: string | undefined } = buildEntityIdMapper(settings, annotations, seed);
  return {
    anonymizeDocument,
    anonymize,
    extractReplacementTerms,
  };

  function anonymizeDocument(document: documentT): documentT {
    extractReplacementTerms();
    const splittedText = textSplitter.splitTextAccordingToAnnotations(document.text, annotations);
    const splittedAnonymizedText = splittedText.map((chunk) => {
      switch (chunk.type) {
        case 'text':
          return chunk.content.text;
        case 'annotation':
          return anonymize(chunk.annotation);
      }
    });

    return {
      ...document,
      text: splittedAnonymizedText.reduce((text, anonymizedText) => `${text}${anonymizedText}`, ''),
    };
  }
  function anonymize(annotation: annotationType): string {
    if (
      settings[annotation.category]?.isAnonymized === false ||
      settings[annotation.category]?.status === 'visible' ||
      settings[annotation.category]?.status === 'alwaysVisible'
    ) {
      return annotation.text;
    }
    const anonymizedText = mapper[annotation.entityId] || ANONYMIZATION_DEFAULT_TEXT;

    return anonymizedText;
  }

  function extractReplacementTerms(): ReplacementTermDict {
    const replacementTerms: ReplacementTermDict = {};

    annotations.forEach((annotation) => {
      if (replacementTerms[annotation.entityId]) {
        if (!replacementTerms[annotation.entityId].instances.includes(annotation.text)) {
          replacementTerms[annotation.entityId].instances.push(annotation.text);
        }
      } else {
        replacementTerms[annotation.entityId] = {
          replacementTerm: anonymize(annotation),
          instances: [annotation.text],
          category: annotation.category,
        };
      }
    });
    return replacementTerms;
  }
}
