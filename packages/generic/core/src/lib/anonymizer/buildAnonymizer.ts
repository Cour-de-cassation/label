import { fetchedAnnotationType, fetchedDocumentType, settingsType } from '../../modules';
import { textSplitter } from '../textSplitter';

export { buildAnonymizer };

export type { anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = 'XXX';

type anonymizerType<annotationT extends fetchedAnnotationType, documentT extends fetchedDocumentType> = {
  anonymizeDocument: (document: documentT, annotations: annotationT[]) => documentT;
  anonymize: (annotation: annotationT) => string;
};

function buildAnonymizer<annotationT extends fetchedAnnotationType, documentT extends fetchedDocumentType>(
  settings: settingsType,
): anonymizerType<annotationT, documentT> {
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymizeDocument,
    anonymize,
  };

  function anonymizeDocument(document: documentT, annotations: annotationT[]): documentT {
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

  function anonymize(annotation: annotationT): string {
    const anonymizedText = mapAnnotationToAnonymizedText(annotation);

    if (anonymizedText !== undefined) {
      return anonymizedText;
    } else {
      addNewMapping(annotation);
      return anonymize(annotation);
    }
  }

  function addNewMapping(annotation: annotationT) {
    const anonymizationTexts = settings[annotation.category]?.anonymizationTexts || [];
    const anonymizedText = anonymizationTexts.shift() || ANONYMIZATION_DEFAULT_TEXT;
    anonymizationTexts.push(anonymizedText);

    addAnnotationToAnonymizedTextMapping(annotation, anonymizedText);
  }

  function mapAnnotationToAnonymizedText(annotation: annotationT) {
    return mapper[annotation.entityId];
  }

  function addAnnotationToAnonymizedTextMapping(annotation: annotationT, anonymizedText: string) {
    mapper[annotation.entityId] = anonymizedText;
  }
}
