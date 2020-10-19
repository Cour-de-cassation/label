import { annotationType, documentType, settingsType } from "../../modules";
import { textSplitter } from "../textSplitter";

export { buildAnonymizer };

export type { anonymizerType };

const ANONYMIZATION_DEFAULT_TEXT = "XXX";

type annotationNeededFieldsType = Pick<
  annotationType,
  "text" | "category" | "start" | "entityId"
>;

type anonymizerType<annotationT extends annotationNeededFieldsType> = {
  anonymizeDocument: (
    document: documentType,
    annotations: annotationT[]
  ) => documentType;
  anonymize: (annotation: annotationT) => string;
};

function buildAnonymizer<annotationT extends annotationNeededFieldsType>(
  settings: settingsType
): anonymizerType<annotationT> {
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymizeDocument,
    anonymize,
  };

  function anonymizeDocument(
    document: documentType,
    annotations: annotationT[]
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
    const anonymizationTexts =
      settings[annotation.category]?.anonymizationTexts || [];
    const anonymizedText =
      anonymizationTexts.shift() || ANONYMIZATION_DEFAULT_TEXT;
    anonymizationTexts.push(anonymizedText);

    addAnnotationToAnonymizedTextMapping(annotation, anonymizedText);
  }

  function mapAnnotationToAnonymizedText(annotation: annotationT) {
    return mapper[annotation.entityId];
  }

  function addAnnotationToAnonymizedTextMapping(
    annotation: annotationT,
    anonymizedText: string
  ) {
    mapper[annotation.entityId] = anonymizedText;
  }
}
