import { idModule } from "../../id";
import {
  fetchedAnnotationHandler,
  LABEL_ANNOTATION_SOURCE,
} from "./fetchedAnnotationHandler";
import { entityIdHandler } from "./entityIdHandler";

describe("fetchedAnnotationHandler", () => {
  describe("createAll", () => {
    it("should create all the valid annotations for the given text and document", () => {
      const category = "CATEGORY";
      const documentId = idModule.lib.buildId();
      const documentText =
        "Benoit is a software engineer. Nicolas is a software engineer.";
      const annotationText = "engineer";

      const annotations = fetchedAnnotationHandler.createAll(
        category,
        documentId,
        documentText,
        annotationText
      );

      expect(annotations).toEqual([
        {
          category,
          start: 21,
          documentId,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[0]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
        {
          category,
          start: 53,
          documentId,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[1]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
      ]);
    });
  });
});
