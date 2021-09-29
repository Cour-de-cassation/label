import { annotationType, settingsModule, settingsType } from '@label/core';
import { viewerModeType } from '../../../../../services/documentViewerMode';

export { getAnnotationTextDisplayStyle };

function getAnnotationTextDisplayStyle({
  settings,
  annotation,
  documentViewerMode,
}: {
  settings: settingsType;
  annotation: annotationType;
  documentViewerMode: viewerModeType;
}) {
  const categoryStatus = settingsModule.lib.getAnnotationCategoryStatus(annotation.category, settings);

  switch (categoryStatus) {
    case 'hidden':
      return 'none';
    case 'alwaysVisible':
      return 'underlined';
    case 'visible':
      return 'underlined';
    case 'annotable':
      switch (documentViewerMode.kind) {
        case 'annotation':
          return 'filled';
        case 'occurrence':
          const isSelectedEntity = documentViewerMode.entityId === annotation.entityId;
          if (isSelectedEntity) {
            return 'filled';
          } else {
            return 'outlined';
          }
      }
  }
}
