import { annotationType, documentType } from "../../modules";

export { buildAnonymizer };

export type { anonymizationSettingsType, anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = "XXX";

type anonymizationSettingsType = { [key: string]: string[] | undefined };

type anonymizerType = {
  anonymize: (annotation: annotationType) => string;
  anonymizeDocument: (
    document: documentType,
    annotations: annotationType[]
  ) => documentType;
};

function buildAnonymizer(
  anonymizationSettings: anonymizationSettingsType
): anonymizerType {
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymizeDocument,
    anonymize,
  };

  function anonymizeDocument(
    document: documentType,
    annotations: annotationType[]
  ): documentType {
    const sortedAnnotations = [...annotations].sort(
      (annotation1, annotation2) => annotation1.start - annotation2.start
    );
    const anonymisedText = anonymizeText(document.text, sortedAnnotations);

    return { ...document, text: anonymisedText };
  }

  function anonymizeText(
    text: string,
    sortedAnnotations: Array<annotationType>
  ) {
    const anonymisedTextChunks = [];

    let currentIndex = 0;
    sortedAnnotations.forEach((annotation) => {
      anonymisedTextChunks.push(text.slice(currentIndex, annotation.start));
      anonymisedTextChunks.push(anonymize(annotation));
      currentIndex = annotation.start + annotation.text.length;
    });
    anonymisedTextChunks.push(text.slice(currentIndex));

    return anonymisedTextChunks.reduce(
      (anonymisedText, anomisedTextChunk) =>
        `${anonymisedText}${anomisedTextChunk}`,
      ""
    );
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
    const anonymizationTexts = anonymizationSettings[annotation.category] || [];
    const anonymizedText =
      anonymizationTexts.shift() || ANONYMIZATION_DEFAULT_TEXT;
    anonymizationTexts.push(anonymizedText);

    addAnnotationToAnonymizedTextMapping(annotation, anonymizedText);
  }

  function mapAnnotationToAnonymizedText(annotation: annotationType) {
    return mapper[`${annotation.category}_${annotation.text}`];
  }

  function addAnnotationToAnonymizedTextMapping(
    annotation: annotationType,
    anonymizedText: string
  ) {
    mapper[`${annotation.category}_${annotation.text}`] = anonymizedText;
  }
}
