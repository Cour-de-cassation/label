import { buildCourtDecisionRepository } from '../../repository';
import { converter } from '../../../../lib/converter';
import { GraphQLFieldResolver } from 'graphql';

export { resolveInsertCourtDecision };

const resolveInsertCourtDecision: GraphQLFieldResolver<any, any, any> = (
  _root,
  { xmlCourtDecision },
) => {
  const courtDecision = converter.convertFromXml(xmlCourtDecision.text);
  const courtDecisionRepository = buildCourtDecisionRepository();
  return courtDecisionRepository.insert(courtDecision);
};
