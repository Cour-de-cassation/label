import { buildMutationString, buildQueryString } from './graphQLClientBuilder';

describe('graphQLClientBuilder', () => {
  describe('buildMutationString', () => {
    it('should build a valid mutation', async () => {
      const mutation = buildMutationString('annotations');

      expect(mutation)
        .toEqual(`mutation annotations($documentIdString: String, $fetchedGraphQLAnnotations: [annotationInputType]) {
annotations(documentIdString: $documentIdString, fetchedGraphQLAnnotations: $fetchedGraphQLAnnotations) {
success
}
}`);
    });
  });

  describe('buildQueryString', () => {
    it('should build a valid mutation', async () => {
      const query = buildQueryString('annotations');

      expect(query).toEqual(`query annotations($documentId: String) {
annotations(documentId: $documentId) {
category
entityId
source
_id
start
text
}
}`);
    });
  });
});
