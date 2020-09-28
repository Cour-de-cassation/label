import { resolveInsertDocument } from './resolvers';
import { GraphQLList, GraphQLInputObjectType, GraphQLString } from 'graphql';
import {
  documentsGraphQLEntity,
  successGraphQLType,
} from './documentsGraphQLEntity';

export { documentsQuery, insertDocumentQuery };

const documentsQuery = {
  type: new GraphQLList(documentsGraphQLEntity.type),
  resolve: documentsGraphQLEntity.resolve,
};

const insertDocumentQuery = {
  resolve: resolveInsertDocument,
  type: successGraphQLType,
  args: {
    xmlDocument: {
      type: new GraphQLInputObjectType({
        name: 'xmlDocument',
        fields: {
          text: { type: GraphQLString },
        },
      }),
    },
  },
};
