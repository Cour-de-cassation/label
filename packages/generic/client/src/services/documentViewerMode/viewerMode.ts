import { annotationType } from '@label/core';

export { DEFAULT_VIEWER_MODE };

export type { viewerModeType };

type viewerModeType =
  | { kind: 'annotation'; isAnonymized: boolean; hasScrolled: boolean }
  | {
      kind: 'occurrence';
      entityId: annotationType['entityId'];
      entityLineNumbers: number[];
      isAnonymized: boolean;
      hasScrolled: boolean;
    };

const DEFAULT_VIEWER_MODE: viewerModeType = {
  kind: 'annotation',
  isAnonymized: false,
  hasScrolled: false,
};
