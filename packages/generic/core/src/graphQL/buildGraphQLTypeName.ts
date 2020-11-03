export { buildGraphQLTypeName };

function buildGraphQLTypeName(kind: 'input' | 'output', name: string) {
  switch (kind) {
    case 'input':
      return `${name}InputType`;
    case 'output':
      return `${name}OutputType`;
  }
}
