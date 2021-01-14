import React, { ReactElement, useState } from 'react';
import { problemReportType } from '@label/core';
import {
  ButtonWithIcon,
  Checkbox,
  FloatingTooltipMenu,
  LabelledDropdown,
  LayoutGrid,
  Text,
  TextInput,
} from '../../../../components';
import { apiCaller } from '../../../../api';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
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
  const style = buildStyle();
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
      <LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <LabelledDropdown<problemReportType['type']>
            error={isSentWithoutCategory}
            items={problemCategories.map(([problemCategory, problemCategoryText]) => ({
              text: problemCategoryText,
              value: problemCategory,
            }))}
            label={wordings.problemType}
            onChange={changeProblemCategory}
            width={REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}
          />
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Text>{wordings.describeTheProblem}</Text>
          <TextInput
            name="problemDescription"
            placeholder={wordings.enterYourText}
            size={10}
            multiline
            onChange={(event) => setProblemDescription(event.target.value)}
            style={style.tooltipElement}
            value={problemDescription}
          />
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Checkbox
            defaultChecked={false}
            onChange={(checked) => setIsBlocking(checked)}
            text={wordings.problemIsBlocking}
            style={style.tooltipElement}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid container style={style.tooltipItem} direction="row-reverse">
          <LayoutGrid item>
            <span style={style.tooltipButton}>
              <ButtonWithIcon color="default" iconName="close" onClick={closeTooltipMenu} text={wordings.cancel} />
            </span>
            <span style={style.tooltipButton}>
              <ButtonWithIcon
                color="primary"
                iconName="send"
                onClick={sendProblemReportAndClose}
                text={wordings.send}
              />
            </span>
          </LayoutGrid>
        </LayoutGrid>
      </LayoutGrid>
    </FloatingTooltipMenu>
  );

  function buildStyle() {
    return {
      tooltipElement: {
        width: `${REPORT_PROBLEM_TOOLTIP_ELEMENT_WIDTH}px`,
      },
      tooltipItem: {
        padding: '12px 0px',
      },
      tooltipButton: {
        paddingRight: '10px',
      },
    };
  }

  function buildProblemCategories(): Array<[problemReportType['type'], string]> {
    return [
      ['bug', wordings.problemCategory.bug],
      ['annotationProblem', wordings.problemCategory.annotationProblem],
      ['suggestion', wordings.problemCategory.suggestion],
    ];
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
    } else {
      setIsSentWithoutCategory(true);
    }
  }
}
