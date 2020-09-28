import { annotationGenerator } from "../generator";
import { applyAnnotations } from "./applyAnnotations";

describe("applyAnnotations", () => {
  it("should apply an annotation to obfuscate a text", () => {
    const text = "Monsieur Dupont et Madame Durand";
    const annotations = [
      annotationGenerator.generate({
        annotationEntity: "ENTITY_1",
        start: 9,
        text: "Dupont",
      }),
      annotationGenerator.generate({
        annotationEntity: "ENTITY_2",
        start: 26,
        text: "Durand",
      }),
    ];
    const resolver = (entity: string) => {
      switch (entity) {
        case "ENTITY_1":
          return "ANONYMISED_1";
        case "ENTITY_2":
          return "ANONYMISED_2";
        default:
          return "";
      }
    };

    const anonymisedText = applyAnnotations(text, annotations, resolver);

    expect(anonymisedText).toEqual(
      "Monsieur ANONYMISED_1 et Madame ANONYMISED_2"
    );
  });
});
