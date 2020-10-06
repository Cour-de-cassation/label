import { annotationModule } from "../../modules/annotation";
import { buildAnonymizer } from "./buildAnonymizer";

describe("buildAnonymizer", () => {
  const anonymizer = buildAnonymizer({
    firstName: ["Spirou", "Fantasio"],
    lastName: [],
  });

  describe("anonymize", () => {
    const annotations = [
      { category: "firstName", text: "Benoit" },
      { category: "firstName", text: "Nicolas" },
      { category: "firstName", text: "Romain" },
    ].map(annotationModule.generator.generate);

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
