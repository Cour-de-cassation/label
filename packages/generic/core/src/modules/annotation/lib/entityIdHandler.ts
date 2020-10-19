export { entityIdHandler };

const entityIdHandler = {
  compute,
  getCategory,
  getText,
};

function compute(category: string, text: string) {
  return `${category}_${text}`;
}

function getCategory(entityId: string): string {
  const { category } = parseEntityId(entityId);

  return category;
}

function getText(entityId: string): string {
  const { text } = parseEntityId(entityId);

  return text;
}

function parseEntityId(entityId: string) {
  const parsedEntityId = entityId.split("_");

  return { category: parsedEntityId[0], text: parsedEntityId[1] };
}
