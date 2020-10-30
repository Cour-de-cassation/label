import { buildMutationString, buildQueryString } from './graphQLClientBuilder';

describe('graphQLClientBuilder', () => {
  describe('buildMutationString', () => {
    it('should build a valid mutation', async () => {
      const mutation = buildMutationString('annotations');

      expect(mutation)
        .toEqual(`mutation annotations($documentId: String, $fetchedGraphQLAnnotations: [annotationInputType]) {
annotations(documentId: $documentId, fetchedGraphQLAnnotations: $fetchedGraphQLAnnotations) {
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
