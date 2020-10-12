import { annotationModule } from "../../modules";
import { textSplitter } from "./textSplitter";

describe("textSplitter", () => {
  describe("splitTextAccordingToAnnotations", () => {
    const annotations = [
      { category: "firstName", text: "Benoit", start: 0 },
      { category: "firstName", text: "Nicolas", start: 29 },
      { category: "firstName", text: "Romain", start: 61 },
    ].map(annotationModule.generator.generate);

    it("should split a text according to the given annotations", () => {
      const text =
        "Benoit is software engineer. Nicolas is a software engineer. Romain is a designer.";

      const splittedText = textSplitter.splitTextAccordingToAnnotations(
        text,
        annotations
      );

      expect(splittedText).toEqual([
        { type: "annotation", annotation: annotations[0] },
        { type: "text", text: " is software engineer. " },
        { type: "annotation", annotation: annotations[1] },
        { type: "text", text: " is a software engineer. " },
        { type: "annotation", annotation: annotations[2] },
        { type: "text", text: " is a designer." },
      ]);
    });
  });
});
