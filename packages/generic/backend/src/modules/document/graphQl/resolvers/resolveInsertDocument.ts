import { documentModule } from '@label/core';
import { GraphQLFieldResolver } from 'graphql';
import { xmlConverter } from '../../../../lib/xmlConverter';
import { buildDocumentRepository } from '../../repository';

export { resolveInsertDocument };

const resolveInsertDocument: GraphQLFieldResolver<any, any, any> = (
  _root,
  { xmlDocument },
) => {
  const document = documentModule.generator.generate(
    xmlConverter.convertFromXml((xmlDocument as { text: string }).text),
  );
  const documentRepository = buildDocumentRepository();
  return documentRepository.insert(document);
};
