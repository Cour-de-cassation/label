import { annotationGenerator } from "../generator";
import { annotationLinker } from "./annotationLinker";

describe("annotationLinker", () => {
  describe("link", () => {
    it("should link the annotations of the category/text source to the annotations of the category/text target", () => {
      const category = "CATEGORY";
      const textSource = "SOURCE";
      const textTarget = "TARGET";
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationGenerator.generate);
      const entityIdOfTextTarget = annotations[2].entityId;

      const newAnnotations = annotationLinker.link(
        category,
        textSource,
        textTarget,
        annotations
      );

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfTextTarget },
        { ...annotations[1], entityId: entityIdOfTextTarget },
        { ...annotations[2], entityId: entityIdOfTextTarget },
        annotations[3],
      ]);
    });
    it("should work with forward links", () => {
      const category = "CATEGORY";
      const text1 = "1";
      const text2 = "2";
      const text3 = "3";
      const annotations = [
        { category: category, text: text1 },
        { category: category, text: text2 },
        { category: category, text: text3 },
      ].map(annotationGenerator.generate);
      const entityIdOfText3 = annotations[2].entityId;

      const newAnnotations = annotationLinker.link(
        category,
        text2,
        text3,
        annotationLinker.link(category, text1, text2, annotations)
      );

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfText3 },
        { ...annotations[1], entityId: entityIdOfText3 },
        { ...annotations[2], entityId: entityIdOfText3 },
      ]);
    });
    it("should work with backward links ", () => {
      const category = "CATEGORY";
      const text1 = "1";
      const text2 = "2";
      const text3 = "3";
      const annotations = [
        { category: category, text: text1 },
        { category: category, text: text2 },
        { category: category, text: text3 },
      ].map(annotationGenerator.generate);
      const entityIdOfText3 = annotations[2].entityId;

      const newAnnotations = annotationLinker.link(
        category,
        text1,
        text2,
        annotationLinker.link(category, text2, text3, annotations)
      );

      expect(newAnnotations).toEqual([
        { ...annotations[0], entityId: entityIdOfText3 },
        { ...annotations[1], entityId: entityIdOfText3 },
        { ...annotations[2], entityId: entityIdOfText3 },
      ]);
    });
  });
  describe("unlink", () => {
    it("should unlink the annotations of the given category/text", () => {
      const category = "CATEGORY";
      const textSource = "SOURCE";
      const textTarget = "TARGET";
      const annotations = [
        { category: category, text: textSource },
        { category: category, text: textSource },
        { category: category, text: textTarget },
        {},
      ].map(annotationGenerator.generate);

      const newAnnotations = annotationLinker.unlink(
        category,
        textSource,
        annotationLinker.link(category, textSource, textTarget, annotations)
      );

      expect(newAnnotations).toEqual(annotations);
    });
  });
});
