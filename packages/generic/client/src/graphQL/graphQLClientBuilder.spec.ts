import { buildMutationString, buildQueryString } from './graphQLClientBuilder';

describe('graphQLClientBuilder', () => {
  describe('buildCreateTreatmentString', () => {
    it('should build a valid mutation', async () => {
      const mutation = buildMutationString('createTreatment');

      expect(mutation)
        .toEqual(`mutation createTreatment($documentId: String, $fetchedGraphQLAnnotations: [annotationInputType], $duration: Int) {
createTreatment(documentId: $documentId, fetchedGraphQLAnnotations: $fetchedGraphQLAnnotations, duration: $duration) {
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
