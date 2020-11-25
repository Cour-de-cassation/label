import React, { MouseEvent, ReactElement, useState } from 'react';
import { problemReportType } from '@label/core';
import {
  ButtonWithIcon,
  Checkbox,
  LabelledDropdown,
  LayoutGrid,
  Text,
  TextInput,
  TooltipMenu,
} from '../../../../components';
import { useGraphQLMutation } from '../../../../graphQL';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

const REPORT_PROBLEM_TOOLTIP_MENU_WIDTH = 350;

function ReportProblemToolTipMenu(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anchorElement: Element | undefined;
  onClose: () => void;
  onStopAnnotatingDocument: () => void;
}): ReactElement {
  const style = buildStyle();
  const problemCategories = buildProblemCategories();
  const [problemCategory, setProblemCategory] = useState<problemReportType['type'] | undefined>(undefined);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [isSentWithoutCategory, setIsSentWithoutCategory] = useState<boolean>(false);
  const [sendProblemReport] = useGraphQLMutation<'problemReport'>('problemReport');
  const [updateAssignationStatus] = useGraphQLMutation<'updateAssignationStatus'>('updateAssignationStatus');
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <TooltipMenu anchorElement={props.anchorElement} onClose={props.onClose}>
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
            width={REPORT_PROBLEM_TOOLTIP_MENU_WIDTH}
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
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      tooltipElement: {
        width: `${REPORT_PROBLEM_TOOLTIP_MENU_WIDTH}px`,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function closeTooltipMenu(_event: MouseEvent) {
    setProblemCategory(undefined);
    setProblemDescription('');
    setIsBlocking(false);

    props.onClose();
  }

  function changeProblemCategory(newProblemCategory: problemReportType['type']) {
    setIsSentWithoutCategory(false);
    setProblemCategory(newProblemCategory);
  }

  async function sendProblemReportAndClose(event: MouseEvent) {
    if (problemCategory) {
      setIsSentWithoutCategory(false);

      await sendProblemReport({
        variables: {
          documentId: annotatorState.document._id,
          problemType: problemCategory,
          problemText: problemDescription,
        },
      });

      if (isBlocking) {
        await updateAssignationStatus({ variables: { documentId: annotatorState.document._id, status: 'rejected' } });
        props.onStopAnnotatingDocument();
      }

      closeTooltipMenu(event);
    } else {
      setIsSentWithoutCategory(true);
    }
  }
}
