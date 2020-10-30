import React, { MouseEvent, ReactElement, useState } from 'react';
import { problemReportType } from '@label/core';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TextInputLarge, TooltipMenu } from '../../../../components';
import { useGraphQLMutation } from '../../../../graphQL';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

function ReportProblemToolTipMenu(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anchorElement: Element | undefined;
  onClose: () => void;
}): ReactElement {
  const style = buildStyle();
  const problemCategories = buildProblemCategories();
  const [problemCategory, setProblemCategory] = useState<problemReportType['type'] | undefined>(undefined);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [sendProblemReport] = useGraphQLMutation<'problemReport'>('problemReport');

  return (
    <TooltipMenu anchorElement={props.anchorElement} onClose={props.onClose}>
      <LayoutGrid style={style.annotationCreationTooltipMenu}>
        <LayoutGrid>
          <Dropdown<problemReportType['type']>
            items={problemCategories.map(([problemCategory, problemCategoryText]) => ({
              value: problemCategory,
              displayedText: problemCategoryText,
            }))}
            label={wordings.problemType}
            onChange={(newProblemCategory) => setProblemCategory(newProblemCategory)}
            style={style.tooltipElement}
          ></Dropdown>
        </LayoutGrid>
        <LayoutGrid>
          <Text>{wordings.describeTheProblem}</Text>
        </LayoutGrid>
        <LayoutGrid>
          <TextInputLarge
            placeholder={wordings.enterYourText}
            size={10}
            onChange={(event) => setProblemDescription(event.target.value)}
            style={style.tooltipElement}
          />
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox
            defaultChecked={false}
            onChange={(checked) => setIsBlocking(checked)}
            text={wordings.problemIsBlocking}
            style={style.tooltipElement}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid container>
          <LayoutGrid item>
            <Button onClick={closeTooltipMenu} color="default" iconName="close">
              {wordings.cancel}
            </Button>
            <Button onClick={sendProblemReportAndClose} color="primary" iconName="send">
              {wordings.send}
            </Button>
          </LayoutGrid>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      annotationCreationTooltipMenu: {
        padding: '0px 10px',
      },
      tooltipElement: {
        width: '350px',
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

  function sendProblemReportAndClose(_event: MouseEvent) {
    if (problemCategory) {
      sendProblemReport({
        variables: {
          documentId: props.annotatorStateHandler.get().document._id,
          problemType: problemCategory,
          problemText: problemDescription,
          isBlocking: isBlocking,
        },
      });
    }
    closeTooltipMenu(_event);
  }
}
