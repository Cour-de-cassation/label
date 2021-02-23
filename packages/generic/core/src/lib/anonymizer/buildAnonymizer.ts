import { mapValues } from 'lodash';
import { annotationType, fetchedDocumentType, settingsType } from '../../modules';
import { textSplitter } from '../textSplitter';
import { buildAnonymizedStringGenerator } from './anonymizedStringGenerator';

export { buildAnonymizer };

export type { anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = 'XXX';

type anonymizerType<documentT extends fetchedDocumentType> = {
  anonymizeDocument: (document: documentT, annotations: annotationType[]) => documentT;
  anonymize: (annotation: annotationType) => string;
};

function buildAnonymizer<documentT extends fetchedDocumentType>(settings: settingsType): anonymizerType<documentT> {
  const anonymizedStringGenerators = mapValues(settings, (categorySetting) =>
    buildAnonymizedStringGenerator(categorySetting.anonymization),
  );
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymizeDocument,
    anonymize,
  };

  function anonymizeDocument(document: documentT, annotations: annotationType[]): documentT {
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
    if (settings[annotation.category]?.isAnonymized === false) {
      return annotation.text;
    }

    const anonymizedText = mapAnnotationToAnonymizedText(annotation);

    if (anonymizedText !== undefined) {
      return anonymizedText;
    } else {
      addNewMapping(annotation);
      return anonymize(annotation);
    }
  }

  function addNewMapping(annotation: annotationType) {
    const anonymizedText = anonymizedStringGenerators[annotation.category]?.generate() || ANONYMIZATION_DEFAULT_TEXT;

    mapper[annotation.entityId] = anonymizedText;
  }

  function mapAnnotationToAnonymizedText(annotation: annotationType) {
    return mapper[annotation.entityId];
  }
}
