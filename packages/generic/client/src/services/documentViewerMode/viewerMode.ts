import { fetchedAnnotationType } from '@label/core';

export { DEFAULT_VIEWER_MODE };

export type { viewerModeType };

type viewerModeType =
  | { kind: 'annotation'; isAnonymized: boolean }
  | { kind: 'occurrence'; entityId: fetchedAnnotationType['entityId']; isAnonymized: boolean }
  | { kind: 'resize'; annotation: fetchedAnnotationType };

const DEFAULT_VIEWER_MODE: viewerModeType = { kind: 'annotation', isAnonymized: false };
