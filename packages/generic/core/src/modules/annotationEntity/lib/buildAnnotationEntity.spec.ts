import { buildAnnotationEntity } from "./buildAnnotationEntity";

describe("buildAnnotationEntity", () => {
  it("should return a string which begins with the given label", () => {
    const label = "LABEL";

    const annotationEntity = buildAnnotationEntity(label);

    expect(annotationEntity.startsWith("LABEL_")).toEqual(true);
  });
});
