import { buildSchema } from './graphQLClientBuilder';

describe('graphQLClientBuilder', () => {
  describe('buildSchema', () => {
    const schemaNameAndParameters = 'data($parameter: parameterType!)';
    const nameAndParameters = 'data(parameter: $parameter)';
    const dataModel = {
      field1: { type: 'string', graphQL: true },
      field2: { type: 'string', graphQL: true },
      fieldNotWanted: { type: 'string', graphQL: false },
      field3: { type: 'string', graphQL: true },
    } as const;

    it('should build a valid graphQL query from the data model', async () => {
      const query = buildSchema('query', schemaNameAndParameters, nameAndParameters, dataModel);

      expect(query).toEqual(
        `query data($parameter: parameterType!) {
data(parameter: $parameter) {
field1
field2
field3
}
}
`,
      );
    });

    it('should build a valid graphQL mutation from the data model', async () => {
      const mutation = buildSchema('mutation', schemaNameAndParameters, nameAndParameters, dataModel);

      expect(mutation).toEqual(
        `mutation data($parameter: parameterType!) {
data(parameter: $parameter) {
field1
field2
field3
}
}
`,
      );
    });
  });
});
