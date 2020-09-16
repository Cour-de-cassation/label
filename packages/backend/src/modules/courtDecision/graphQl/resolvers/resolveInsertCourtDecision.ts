import { courtDecisionGenerator } from '@label/core';
import { GraphQLFieldResolver } from 'graphql';
import { converter } from '../../../../lib/converter';
import { buildCourtDecisionRepository } from '../../repository';

export { resolveInsertCourtDecision };

const resolveInsertCourtDecision: GraphQLFieldResolver<any, any, any> = (
  _root,
  { xmlCourtDecision },
) => {
  const courtDecision = courtDecisionGenerator.generate(
    converter.convertFromXml(xmlCourtDecision.text),
  );
  const courtDecisionRepository = buildCourtDecisionRepository();
  return courtDecisionRepository.insert(courtDecision);
};
