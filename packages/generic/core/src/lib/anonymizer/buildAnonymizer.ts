import { annotationType } from "../../modules";

export { buildAnonymizer };

export type { anonymizationSettingsType };

const ANONYMIZATION_DEFAULT_TEXT = "XXX";

type anonymizationSettingsType = { [key: string]: string[] | undefined };

function buildAnonymizer(anonymizationSettings: anonymizationSettingsType) {
  const mapper: { [key: string]: string | undefined } = {};

  return {
    anonymize,
  };

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
