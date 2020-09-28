import { courtDecisionModule } from '@label/core';
import { GraphQLFieldResolver } from 'graphql';
import { xmlConverter } from '../../../../lib/xmlConverter';
import { buildDocumentRepository } from '../../repository';

export { resolveInsertCourtDecision };

const resolveInsertCourtDecision: GraphQLFieldResolver<any, any, any> = (
  _root,
  { xmlCourtDecision },
) => {
  const courtDecision = courtDecisionModule.generator.generate(
    xmlConverter.convertFromXml((xmlCourtDecision as { text: string }).text),
  );
  const courtDecisionRepository = buildDocumentRepository();
  /*return courtDecisionRepository.insert(courtDecision);*/
};
