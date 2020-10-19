import { buildAuthenticatedResolver } from '../../../user';
import { documentService } from '../../service';

export { resolveDocument };

const resolveDocument = buildAuthenticatedResolver(async (userId) => {
  const document = await documentService.fetchDocumentForUser(userId);
  return document;
});
