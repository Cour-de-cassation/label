import { GraphQLFieldResolver } from 'graphql';
import { userService } from '../../../user';
import { documentService } from '../../service';

export { resolveDocument };

type contextType = {
  headers: {
    authorization: string;
  };
};

const resolveDocument: GraphQLFieldResolver<any, contextType> = async (
  _root: any,
  _args: any,
  context,
) => {
  const userId = userService.extractUserIdFromAuthorizationHeader(
    context.headers.authorization,
  );
  const document = await documentService.fetchDocumentForUser(userId);
  return document;
};
