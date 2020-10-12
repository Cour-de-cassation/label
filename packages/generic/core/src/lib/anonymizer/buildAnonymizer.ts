import { annotationType, documentType, settingsType } from "../../modules";
import { textSplitter } from "../textSplitter";

export { buildAnonymizer };

export type { anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = "XXX";

type anonymizerType = {
  anonymizeDocument: (
    document: documentType,
    annotations: annotationType[]
  ) => documentType;
  anonymize: (annotation: annotationType) => string;
};

function buildAnonymizer(settings: settingsType): anonymizerType {
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymizeDocument,
    anonymize,
  };

  function anonymizeDocument(
    document: documentType,
    annotations: annotationType[]
  ): documentType {
    const splittedText = textSplitter.splitTextAccordingToAnnotations(
      document.text,
      annotations
    );
    const splittedAnonymizedText = splittedText.map((chunk) =>
      textSplitter.applyToChunk(chunk, (text) => text, anonymize)
    );

    return {
      ...document,
      text: splittedAnonymizedText.reduce(
        (text, anonymizedText) => `${text}${anonymizedText}`,
        ""
      ),
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
    const anonymizationTexts =
      settings[annotation.category]?.anonymizationTexts || [];
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
