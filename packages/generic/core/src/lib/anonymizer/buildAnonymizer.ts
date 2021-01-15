import { annotationType, fetchedDocumentType, settingsType } from '../../modules';
import { textSplitter } from '../textSplitter';

export { buildAnonymizer };

export type { anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = 'XXX';

type anonymizerType<documentT extends fetchedDocumentType> = {
  anonymizeDocument: (document: documentT, annotations: annotationType[]) => documentT;
  anonymize: (annotation: annotationType) => string;
};

function buildAnonymizer<documentT extends fetchedDocumentType>(settings: settingsType): anonymizerType<documentT> {
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
          return chunk.text;
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
    const anonymizedText = mapAnnotationToAnonymizedText(annotation);

    if (anonymizedText !== undefined) {
      return anonymizedText;
    } else {
      addNewMapping(annotation);
      return anonymize(annotation);
    }
  }

  function addNewMapping(annotation: annotationType) {
    const anonymizationTexts = settings[annotation.category]?.anonymizationTexts || [];
    const anonymizedText = anonymizationTexts.shift() || ANONYMIZATION_DEFAULT_TEXT;
    anonymizationTexts.push(anonymizedText);

    addAnnotationToAnonymizedTextMapping(annotation, anonymizedText);
  }

  function mapAnnotationToAnonymizedText(annotation: annotationType) {
    return mapper[annotation.entityId];
  }

  function addAnnotationToAnonymizedTextMapping(annotation: annotationType, anonymizedText: string) {
    mapper[annotation.entityId] = anonymizedText;
  }
}
