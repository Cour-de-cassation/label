import { mongo } from '../../../lib/mongo';
import { buildCourtDecisionRepository } from '../courtDecisionRepository';
import { converter } from '../../../lib/converter';
import { GraphQLFieldResolver } from 'graphql';

export { resolveInsertCourtDecision };


const resolveInsertCourtDecision: GraphQLFieldResolver<any, any, any> = (_root, { xmlCourtDecision }) => {
  const courtDecision = converter.convertFromXml(xmlCourtDecision.text);
  const db = mongo.getDb();
  const courtDecisionRepository = buildCourtDecisionRepository(db)
  return courtDecisionRepository.create(courtDecision);
}


