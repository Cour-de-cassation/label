import React, { MouseEvent, ReactElement, useState } from 'react';
import { problemReportType } from '@label/core';
import {
  ButtonWithIcon,
  Checkbox,
  Dropdown,
  LayoutGrid,
  Text,
  TextInputLarge,
  TooltipMenu,
} from '../../../../components';
import { useGraphQLMutation } from '../../../../graphQL';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

function ReportProblemToolTipMenu(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anchorElement: Element | undefined;
  fetchNewDocument: () => Promise<void>;
  onClose: () => void;
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
          <Dropdown<problemReportType['type']>
            error={isSentWithoutCategory}
            items={problemCategories.map(([problemCategory, problemCategoryText]) => ({
              value: problemCategory,
              displayedText: problemCategoryText,
            }))}
            label={wordings.problemType}
            onChange={(newProblemCategory) => setProblemCategory(newProblemCategory)}
            style={style.tooltipElement}
          ></Dropdown>
        </LayoutGrid>
        <LayoutGrid style={style.tooltipItem}>
          <Text>{wordings.describeTheProblem}</Text>
          <TextInputLarge
            placeholder={wordings.enterYourText}
            size={10}
            onChange={(event) => setProblemDescription(event.target.value)}
            style={style.tooltipElement}
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
        width: '350px',
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
        await props.fetchNewDocument();
      }

      closeTooltipMenu(event);
    } else {
      setIsSentWithoutCategory(true);
    }
  }
}
