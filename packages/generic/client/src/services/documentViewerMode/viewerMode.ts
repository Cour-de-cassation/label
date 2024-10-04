import { annotationReportType, annotationType } from '@label/core';

export { DEFAULT_VIEWER_MODE };

export type { viewerModeType };

type viewerModeType =
  | { kind: 'annotation'; isAnonymizedView: boolean }
  | {
      kind: 'occurrence';
      category: annotationType['category'];
      entityId: annotationType['entityId'];
      entityLineNumbers: number[];
      isAnonymizedView: boolean;
    }
  | {
      kind: 'checklist';
      check: annotationReportType['checklist'][number];
      entitiesLineNumbers: number[];
      isAnonymizedView: boolean;
    };

const DEFAULT_VIEWER_MODE: viewerModeType = {
  kind: 'annotation',
  isAnonymizedView: false,
};
