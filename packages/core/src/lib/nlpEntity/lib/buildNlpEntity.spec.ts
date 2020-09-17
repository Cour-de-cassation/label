import { buildNlpEntity } from "./buildNlpEntity";

describe("buildEntity", () => {
  it("should return a string which begins with the given label", () => {
    const label = "LABEL";

    const nlpEntity = buildNlpEntity(label);

    expect(nlpEntity.startsWith("LABEL_")).toEqual(true);
  });
});
