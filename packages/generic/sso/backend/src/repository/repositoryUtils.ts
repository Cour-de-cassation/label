export { buildProjection };

function buildProjection(projections: string[]) {
  const projectionObj: Record<string, 1> = {};

  projections.forEach((projection) => (projectionObj[projection] = 1));

  return projectionObj;
}
