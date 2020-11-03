import { buildGraphQLCustomTypeFields } from './buildGraphQLCustomTypeFields';

describe('buildGraphQLCustomType', () => {
  it('should compute an annotation entity id', () => {
    const dataModel = {
      field1: { graphQL: true, type: 'string' },
      field2: { graphQL: false, type: 'string' },
      field3: { graphQL: true, type: 'number' },
    } as const;

    const graphQLCustomTypeFields = buildGraphQLCustomTypeFields<
      typeof dataModel
    >(dataModel);

    expect(graphQLCustomTypeFields).toEqual({
      field1: 'string',
      field3: 'number',
    });
  });
});
