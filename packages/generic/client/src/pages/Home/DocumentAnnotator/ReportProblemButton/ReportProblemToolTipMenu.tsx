import React, { ReactElement, useState } from 'react';
import { documentType, problemReportType } from '@label/core';
import {
  customThemeType,
  useCustomTheme,
  positionType,
  ButtonWithIcon,
  Checkbox,
  FloatingTooltipMenu,
  LabelledDropdown,
  RichTextInput,
} from 'pelta-design-system';
import { apiCaller } from '../../../../api';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { useAlert } from '../../../../services/alert';

export { ReportProblemToolTipMenu };

const REPORT_PROBLEM_TOOLTIP_MENU_WIDTH = 888;
const REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH = 400;

function ReportProblemToolTipMenu(props: {
  onClose: () => void;
  onStopAnnotatingDocument?: () => Promise<void>;
  originPosition: positionType;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const problemCategories = buildProblemCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [problemCategory, setProblemCategory] = useState<problemReportType['type'] | undefined>(undefined);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [isSentWithoutCategory, setIsSentWithoutCategory] = useState<boolean>(false);
  const { displayAlert } = useAlert();
  const annotatorState = annotatorStateHandler.get();

  return (
    <FloatingTooltipMenu
      originPosition={props.originPosition}
      shouldCloseWhenClickedAway
      onClose={props.onClose}
      width={REPORT_PROBLEM_TOOLTIP_MENU_WIDTH}
    >
      <div style={styles.container}>
        <div style={styles.leftContainer}>
          <div style={styles.dropdownContainer}>
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
          <Checkbox defaultChecked={false} onChange={setIsBlocking} text={wordings.homePage.problemIsBlocking} />
        </div>
        <div style={styles.rightContainer}>
          <div style={styles.textAreaContainer}>
            <RichTextInput
              name="problemDescription"
              placeholder={wordings.homePage.describeTheProblem}
              size={10}
              multiline
              onChange={setProblemDescription}
              value={problemDescription}
              width={REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}
            />
          </div>
          <div style={styles.tooltipButtons}>
            <div style={styles.leftButtonContainer}>
              <ButtonWithIcon
                color="default"
                iconName="close"
                onClick={closeTooltipMenu}
                text={wordings.shared.cancel}
              />
            </div>
            <ButtonWithIcon
              isLoading={isLoading}
              color="primary"
              iconName="send"
              onClick={isLoading ? undefined : sendProblemReportAndClose}
              text={wordings.homePage.send}
            />
          </div>
        </div>
      </div>
    </FloatingTooltipMenu>
  );

  async function setDocumentStatus(documentId: documentType['_id'], status: documentType['status']) {
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId,
        status,
      });
    } catch (error) {
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateDocumentStatusFailed, autoHide: true });
      console.warn(error);
    }
  }

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
      setIsLoading(true);
      try {
        await apiCaller.post<'problemReport'>('problemReport', {
          documentId: annotatorState.document._id,
          problemType: problemCategory,
          problemText: problemDescription,
        });

        if (isBlocking) {
          await setDocumentStatus(annotatorState.document._id, 'locked');
          props.onStopAnnotatingDocument && (await props.onStopAnnotatingDocument());
        }

        closeTooltipMenu();
      } catch (error) {
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSentWithoutCategory(true);
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      padding: theme.spacing * 2,
      display: 'flex',
    },
    tooltipButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    leftContainer: {
      width: `${REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}px`,
      marginRight: theme.spacing * 3,
    },
    dropdownContainer: {
      marginBottom: theme.spacing * 3,
    },
    textAreaContainer: {
      marginBottom: theme.spacing * 2,
    },
    leftButtonContainer: {
      marginRight: theme.spacing * 2,
    },
    rightContainer: {
      width: `${REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}px`,
    },
  } as const;
}
