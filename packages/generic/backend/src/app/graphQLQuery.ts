import { GraphQLObjectType } from 'graphql';
import { documentsQuery, insertDocumentQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    documents: documentsQuery,
    insertDocument: insertDocumentQuery,
  },
});
