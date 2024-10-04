import { annotationReportType } from '@label/core';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { useState } from 'react';

export { useChecklistEntryHandler };

function useChecklistEntryHandler({
  // splittedTextByLine,
  onLeaveAnnotationMode,
  onResetViewerMode,
}: {
  // splittedTextByLine: splittedTextByLineType;
  onLeaveAnnotationMode: () => void;
  onResetViewerMode: () => void;
}) {
  const [checklistFocused, setChecklistFocused] = useState<string | undefined>(undefined);
  const documentViewerModeHandler = useDocumentViewerModeHandler();

  return {
    isFocused: (message: string) => checklistFocused === message,
    isSelected,
    setFocus: (message?: string) => setChecklistFocused(message),
    setSelected,
  };

  function setSelected(check?: annotationReportType['checklist'][number]) {
    if (check) {
      if (documentViewerModeHandler.documentViewerMode.kind != 'checklist') {
        onLeaveAnnotationMode();
      }
      // const checklistLines =
      documentViewerModeHandler.setChecklistMode(check, [1, 2, 3, 4]);
    } else {
      onResetViewerMode();
      documentViewerModeHandler.resetViewerMode();
    }
  }

  function isSelected(message: string) {
    const selectedChecklistMessage =
      documentViewerModeHandler.documentViewerMode.kind === 'checklist'
        ? documentViewerModeHandler.documentViewerMode.check.message
        : undefined;

    return selectedChecklistMessage === message;
  }
}
