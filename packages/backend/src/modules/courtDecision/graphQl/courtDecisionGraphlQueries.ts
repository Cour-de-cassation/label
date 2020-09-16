import { resolveInsertCourtDecision } from "./resolvers"
import { GraphQLList, GraphQLInputObjectType, GraphQLString } from "graphql"
import { courtDecisionsGraphQLEntity, successGraphQLType } from "./courtDecisionsGraphQLEntity"

export { courtDecisionsQuery, insertCourtDecisionQuery }

const courtDecisionsQuery = {
  type: new GraphQLList(courtDecisionsGraphQLEntity.type),
  resolve: courtDecisionsGraphQLEntity.resolve,
}

const insertCourtDecisionQuery = {
  resolve: resolveInsertCourtDecision,
  type: successGraphQLType,
  args: {
    xmlCourtDecision: {
      type: new GraphQLInputObjectType({
        name: 'xmlCourtDecision',
        fields: {
          text: { type: GraphQLString }
        }
      }),
    }
  }
}
