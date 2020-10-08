import { annotationModule, documentModule } from "../../modules";
import { buildAnonymizer } from "./buildAnonymizer";

describe("buildAnonymizer", () => {
  const anonymizer = buildAnonymizer({
    firstName: ["Spirou", "Fantasio"],
    lastName: [],
  });
  const annotations = [
    { category: "firstName", text: "Benoit", start: 0 },
    { category: "firstName", text: "Nicolas", start: 29 },
    { category: "firstName", text: "Romain", start: 61 },
  ].map(annotationModule.generator.generate);

  describe("anonymizeDocument", () => {
    it("should anonymize a document", () => {
      const document = documentModule.generator.generate({
        text:
          "Benoit is software engineer. Nicolas is a software engineer. Romain is a designer.",
      });

      const anonymizedDocument = anonymizer.anonymizeDocument(
        document,
        annotations
      );

      expect(anonymizedDocument.text).toEqual(
        "Spirou is software engineer. Fantasio is a software engineer. Spirou is a designer."
      );
    });
  });

  describe("anonymize", () => {
    it("should anonymize a text with the given settings", () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[0]).toEqual("Spirou");
    });
    it("should anonymize a second text with the given settings", () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[1]).toEqual("Fantasio");
    });
    it("should loop over the anonymization text if not enough are provided in the settings", () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[2]).toEqual("Spirou");
    });
    it("should anonymize a text with a default string if the category is empty in the settings", () => {
      const annotation = annotationModule.generator.generate({
        category: "lastName",
        text: "Lagaffe",
      });

      const anonymizedText = anonymizer.anonymize(annotation);

      expect(anonymizedText).toEqual("XXX");
    });
    it("should anonymize a text with a default string if the category is not in the settings", () => {
      const annotation = annotationModule.generator.generate({
        category: "age",
        text: "25",
      });

      const anonymizedText = anonymizer.anonymize(annotation);

      expect(anonymizedText).toEqual("XXX");
    });
  });
});
