import { computeAnnotationEntityId } from "./computeAnnotationEntityId";

describe("computeAnnotationEntityId", () => {
  it("should compute an annotation entity id", () => {
    const annotationFields = {
      category: "CATEGORY",
      text: "TEXT",
    };

    const annotationEntityId = computeAnnotationEntityId(annotationFields);

    expect(annotationEntityId).toEqual("CATEGORY_TEXT");
  });
});
