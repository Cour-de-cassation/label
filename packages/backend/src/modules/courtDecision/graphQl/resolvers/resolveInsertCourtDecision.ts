import { courtDecisionModule } from '@label/core';
import { GraphQLFieldResolver } from 'graphql';
import { xmlConverter } from '../../../../lib/xmlConverter';
import { buildCourtDecisionRepository } from '../../repository';

export { resolveInsertCourtDecision };

const resolveInsertCourtDecision: GraphQLFieldResolver<any, any, any> = (
  _root,
  { xmlCourtDecision },
) => {
  const courtDecision = courtDecisionModule.generator.generate(
    xmlConverter.convertFromXml((xmlCourtDecision as { text: string }).text),
  );
  const courtDecisionRepository = buildCourtDecisionRepository();
  return courtDecisionRepository.insert(courtDecision);
};
