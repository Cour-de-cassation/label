import { annotationType } from '../../../modules/annotation';
import { fetchedDocumentType } from '../../../modules/document';
import { settingsType } from '../../../modules/settings';
import { textSplitter } from '../../textSplitter';
import { buildEntityIdMapper } from './buildEntityIdMapper';
import { ANONYMIZATION_DEFAULT_TEXT } from './constants';

export { buildAnonymizer };

export type { anonymizerType };

type anonymizerType<documentT extends fetchedDocumentType> = {
  anonymizeDocument: (document: documentT) => documentT;
  anonymize: (annotation: annotationType) => string;
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
  };

  function anonymizeDocument(document: documentT): documentT {
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
}
