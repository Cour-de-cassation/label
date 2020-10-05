import { GraphQLList, GraphQLInputObjectType, GraphQLString } from 'graphql';
import {
  documentsGraphQLEntity,
  successGraphQLType,
} from './documentsGraphQLEntity';

export { documentsGraphQLQuery };

const documentsGraphQLQuery = {
  type: new GraphQLList(documentsGraphQLEntity.type),
  resolve: documentsGraphQLEntity.resolve,
};
