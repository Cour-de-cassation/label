import React, { ReactElement, useState } from 'react';
import { problemReportType } from '@label/core';
import { apiCaller } from '../../../../api';
import {
  ButtonWithIcon,
  Checkbox,
  FloatingTooltipMenu,
  LabelledDropdown,
  Text,
  RichTextInput,
} from '../../../../components';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { positionType } from '../../../../types';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

const REPORT_PROBLEM_TOOLTIP_MENU_WIDTH = 400;
const REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH = 350;

function ReportProblemToolTipMenu(props: {
  onClose: () => void;
  onStopAnnotatingDocument: () => void;
  originPosition: positionType;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const problemCategories = buildProblemCategories();
  const [problemCategory, setProblemCategory] = useState<problemReportType['type'] | undefined>(undefined);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [isSentWithoutCategory, setIsSentWithoutCategory] = useState<boolean>(false);
  const annotatorState = annotatorStateHandler.get();

  return (
    <FloatingTooltipMenu
      originPosition={props.originPosition}
      shouldCloseWhenClickedAway
      onClose={props.onClose}
      width={REPORT_PROBLEM_TOOLTIP_MENU_WIDTH}
    >
      <div>
        <div style={styles.tooltipItem}>
          <LabelledDropdown<problemReportType['type']>
            error={isSentWithoutCategory}
            items={problemCategories.map((problemCategory) => ({
              text: wordings.business.problemReportType[problemCategory],
              value: problemCategory,
            }))}
            label={wordings.homePage.problemType}
            onChange={changeProblemCategory}
            width={REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}
          />
        </div>
        <div style={styles.tooltipItem}>
          <Text>{wordings.homePage.describeTheProblem}</Text>
          <RichTextInput
            name="problemDescription"
            placeholder={wordings.homePage.enterYourText}
            size={10}
            multiline
            onChange={setProblemDescription}
            style={styles.tooltipElement}
            value={problemDescription}
          />
        </div>
        <div style={styles.tooltipItem}>
          <Checkbox
            defaultChecked={false}
            onChange={(checked) => setIsBlocking(checked)}
            text={wordings.homePage.problemIsBlocking}
            style={styles.tooltipElement}
          ></Checkbox>
        </div>
        <div style={{ ...styles.tooltipItem, ...styles.tooltipButtons }}>
          <div style={styles.closeButtonContainer}>
            <ButtonWithIcon
              color="default"
              iconName="close"
              onClick={closeTooltipMenu}
              text={wordings.homePage.cancel}
            />
          </div>
          <ButtonWithIcon
            color="primary"
            iconName="send"
            onClick={sendProblemReportAndClose}
            text={wordings.homePage.send}
          />
        </div>
      </div>
    </FloatingTooltipMenu>
  );

  function buildProblemCategories(): Array<problemReportType['type']> {
    return ['bug', 'annotationProblem', 'suggestion'];
  }

  function closeTooltipMenu() {
    setProblemCategory(undefined);
    setProblemDescription('');
    setIsBlocking(false);

    props.onClose();
  }

  function changeProblemCategory(newProblemCategory: problemReportType['type']) {
    setIsSentWithoutCategory(false);
    setProblemCategory(newProblemCategory);
  }

  async function sendProblemReportAndClose() {
    if (problemCategory) {
      setIsSentWithoutCategory(false);
      try {
        await apiCaller.post<'problemReport'>('problemReport', {
          documentId: annotatorState.document._id,
          problemType: problemCategory,
          problemText: problemDescription,
        });

        if (isBlocking) {
          await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: annotatorState.document._id,
            status: 'rejected',
          });
          props.onStopAnnotatingDocument();
        }

        closeTooltipMenu();
      } catch (error) {
        console.warn(error);
      }
    } else {
      setIsSentWithoutCategory(true);
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    tooltipElement: {
      width: `${REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}px`,
    },
    tooltipItem: {
      padding: `${theme.spacing}px 0px`,
    },
    tooltipButtons: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      paddingRight: theme.spacing,
    },
    closeButtonContainer: {
      marginBottom: theme.spacing,
    },
  } as const;
}
