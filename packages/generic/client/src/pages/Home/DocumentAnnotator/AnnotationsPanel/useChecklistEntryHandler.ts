import { annotationReportType } from '@label/core';
import { useDocumentViewerModeHandler } from '../../../../services/documentViewerMode';
import { useState } from 'react';
import { splittedTextByLineType } from '../lib';

export { useChecklistEntryHandler };

function useChecklistEntryHandler({
  splittedTextByLine,
  onLeaveAnnotationMode,
  onResetViewerMode,
}: {
  splittedTextByLine: splittedTextByLineType;
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
      const checklistLines = filterLinesByCheck(check, splittedTextByLine).map(({ line }) => line);
      documentViewerModeHandler.setChecklistMode(check, checklistLines);
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

  function filterLinesByCheck(
    check: annotationReportType['checklist'][number],
    splittedTextByLine: splittedTextByLineType,
  ): splittedTextByLineType {
    const result: splittedTextByLineType = [];

    check.entities.forEach((entity) => {
      const linesWithEntityId = splittedTextByLine.filter(({ content }) =>
        content.some((chunk) => {
          if (chunk.type === 'annotation') {
            return chunk.annotation.entityId === entity.entityId;
          }
        }),
      );

      if (linesWithEntityId.length > 0) {
        result.push(...linesWithEntityId);
      } else {
        const linesWithIndex = splittedTextByLine.filter(({ content }) =>
          content.some((chunk) => {
            if (chunk.type === 'text') {
              return chunk.content.index >= entity.start && chunk.content.index <= entity.end;
            }
          }),
        );
        result.push(...linesWithIndex);
      }
    });

    if (result.length === 0 && check.sentences) {
      check.sentences.forEach((sentence) => {
        const linesWithSentence = splittedTextByLine.filter(({ content }) =>
          content.some((chunk) => {
            if (chunk.type === 'text') {
              return chunk.content.index >= sentence.start && chunk.content.index <= sentence.end;
            }
          }),
        );
        result.push(...linesWithSentence);
      });
    }

    return result;
  }
}
