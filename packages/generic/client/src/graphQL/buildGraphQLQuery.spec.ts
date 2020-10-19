import { buildGraphQLStringQuery } from './buildGraphQLQuery';

describe('buildGraphQLStringQuery', () => {
  it('should build a valid graphQL query from the data model', async () => {
    const queryNameAndParameters = 'data($parameter: parameterType!)';
    const nameAndParameters = 'data(parameter: $parameter)';
    const dataModel = {
      field1: { type: 'string', graphQL: true },
      field2: { type: 'string', graphQL: true },
      fieldNotWanted: { type: 'string', graphQL: false },
      field3: { type: 'string', graphQL: true },
    } as const;

    const query = buildGraphQLStringQuery(queryNameAndParameters, nameAndParameters, dataModel);

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
});
