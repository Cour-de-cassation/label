import { GraphQLList, GraphQLInputObjectType, GraphQLString } from 'graphql';
import {
  documentsGraphQLEntity,
  successGraphQLType,
} from './documentsGraphQLEntity';

export { documentsQuery };

const documentsQuery = {
  type: new GraphQLList(documentsGraphQLEntity.type),
  resolve: documentsGraphQLEntity.resolve,
};
