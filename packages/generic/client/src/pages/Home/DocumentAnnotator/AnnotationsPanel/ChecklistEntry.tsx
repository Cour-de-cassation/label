import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, customThemeType, Text, useCustomTheme } from 'pelta-design-system';
import { useChecklistEntryHandler } from './useChecklistEntryHandler';
import { useViewerScrollerHandler } from '../../../../services/viewerScroller';
import { annotationReportType, settingsType } from '@label/core';
import { splittedTextByLineType } from '../lib';
import { CategoryIcon } from '../../../../components';

export { ChecklistEntry };

const CHECKLIST_ICON_SIZE = 25;

function ChecklistEntry(props: {
  check: annotationReportType['checklist'][number];
  splittedTextByLine: splittedTextByLineType;
  settings: settingsType;
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

  function renderShortMessageWithIcons(shortMessage: string) {
    const parts = shortMessage.split(/(\[.*?\])/g);
    return parts.map((part) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const category = part.slice(1, -1);
        return (
          <CategoryIcon
            category={category}
            iconSize={CHECKLIST_ICON_SIZE}
            settings={props.settings}
            isDisabled={isChecked}
          />
        );
      } else {
        return part.replace(/ /g, '\u00A0');
      }
    });
  }

  return (
    <Div_ChecklistEntry
      theme={theme}
      isSelected={checklistEntryHandler.isSelected(check.message)}
      onClick={selectChecklist}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox defaultChecked={false} onChange={(checked: boolean) => hitCheckbox(checked)} />
      </div>
      <Text
        variant="body2"
        color={isChecked ? 'textSecondary' : 'textPrimary'}
        style={{
          textDecoration: isChecked ? 'line-through' : 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {renderShortMessageWithIcons(check.short_message)}
      </Text>
    </Div_ChecklistEntry>
  );
}

const Div_ChecklistEntry = styled.div<{ isSelected: boolean }>`
  ${({ theme, isSelected }: { theme: customThemeType; isSelected: boolean }) => `
    display: flex;
    padding: ${theme.spacing / 2}px ${theme.spacing * 2}px;
    background-color: ${isSelected ? theme.colors.default.background : theme.colors.checklist};
    cursor: pointer;
    border-radius: ${theme.shape.borderRadius.m}px;
    &:hover {
      background: linear-gradient(to left, ${theme.colors.default.hoveredBackground}, 50%, transparent);
    }
  `}
`;
