import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, customThemeType, Text, useCustomTheme } from 'pelta-design-system';
import { useChecklistEntryHandler } from './useChecklistEntryHandler';
import { useViewerScrollerHandler } from '../../../../services/viewerScroller';
import { annotationReportType } from '@label/core';
import { splittedTextByLineType } from '../lib';

export { ChecklistEntry };

function ChecklistEntry(props: {
  check: annotationReportType['checklist'][number];
  splittedTextByLine: splittedTextByLineType;
}) {
  const { check, splittedTextByLine } = props;
  const theme = useCustomTheme();
  const viewerScrollerHandler = useViewerScrollerHandler();
  const checklistEntryHandler = useChecklistEntryHandler({
    onLeaveAnnotationMode,
    onResetViewerMode,
    splittedTextByLine,
  });
  const [isChecked, setIsChecked] = useState(false);

  const selectChecklist = () => {
    const isChecklistSelected = checklistEntryHandler.isSelected(check.message);
    if (isChecklistSelected) {
      checklistEntryHandler.setSelected(undefined);
    } else {
      checklistEntryHandler.setSelected(check);
    }
  };

  const hitCheckbox = (checked: boolean) => {
    setIsChecked(checked);
    const isChecklistSelected = checklistEntryHandler.isSelected(check.message);
    if (isChecklistSelected && checked) {
      checklistEntryHandler.setSelected(undefined);
    }
  };

  function onLeaveAnnotationMode() {
    viewerScrollerHandler.storeCurrentVerticalPosition();
  }

  function onResetViewerMode() {
    viewerScrollerHandler.scrollToStoredVerticalPosition();
  }

  return (
    <Div_ChecklistEntry
      theme={theme}
      isSelected={checklistEntryHandler.isSelected(check.message)}
      onClick={selectChecklist}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox defaultChecked={false} onChange={(checked: boolean) => hitCheckbox(checked)}></Checkbox>
      </div>
      <Text
        variant="body2"
        color={isChecked ? 'textSecondary' : 'textPrimary'}
        style={{ textDecoration: isChecked ? 'line-through' : 'none' }}
      >
        {check.message}
      </Text>
    </Div_ChecklistEntry>
  );
}

const Div_ChecklistEntry = styled.div<{ isSelected: boolean }>`
  ${({ theme, isSelected }: { theme: customThemeType; isSelected: boolean }) => `
    display: flex;
    padding: ${theme.spacing}px ${theme.spacing * 2}px;
    background-color: ${isSelected ? theme.colors.default.background : theme.colors.checklist};
    cursor: pointer;
    border-radius: ${theme.shape.borderRadius.m}px;

    &:hover {
      background: linear-gradient(to left, ${theme.colors.default.hoveredBackground}, 50%, transparent);
    }
  `}
`;
