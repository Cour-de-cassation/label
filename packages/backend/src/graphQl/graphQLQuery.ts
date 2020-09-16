import { GraphQLObjectType } from 'graphql';
import {
  courtDecisionsQuery,
  insertCourtDecisionQuery,
} from '../modules/courtDecision';
import { loginQuery } from '../modules/user';

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    courtDecisions: courtDecisionsQuery,
    insertCourtDecision: insertCourtDecisionQuery,
    login: loginQuery,
  },
});

export { graphQLQuery };
