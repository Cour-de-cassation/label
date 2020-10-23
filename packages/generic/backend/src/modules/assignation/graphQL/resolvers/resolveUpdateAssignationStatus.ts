import { assignationStatusType, idModule } from '@label/core';
import { buildAuthenticatedResolver } from '../../../user';
import { assignationService } from '../../service';

export { resolveUpdateAssignationStatus };

const resolveUpdateAssignationStatus = buildAuthenticatedResolver(
  async (
    userId,
    {
      documentIdString,
      statusString,
    }: { documentIdString: string; statusString: string },
  ) => {
    try {
      const documentId = idModule.lib.buildId(documentIdString);
      const status = parseStatus(statusString);

      await assignationService.updateStatus(userId, documentId, status);

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },
);

function parseStatus(statusString: string): assignationStatusType {
  switch (statusString) {
    case 'pending':
      return 'pending';
    case 'saved':
      return 'saved';
    case 'done':
      return 'done';
    case 'rejected':
      return 'rejected';
    default:
      throw new Error(`Assignation status ${statusString} is not handled`);
  }
}
