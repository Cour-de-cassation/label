import React, { MouseEvent, ReactElement, useState } from 'react';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TextInputLarge, TooltipMenu } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

type problemCategoryType = 'BUG' | 'ANNOTATION_PROBLEM' | 'SUGGESTION';

function ReportProblemToolTipMenu(props: { anchorElement: Element | undefined; onClose: () => void }): ReactElement {
  const style = buildStyle();
  const problemCategories = buildProblemCategories();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [problemCategory, setProblemCategory] = useState<problemCategoryType | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [problemDescription, setProblemDescription] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBlocking, setIsBlocking] = useState<boolean>(false);

  return (
    <TooltipMenu anchorElement={props.anchorElement} onClose={props.onClose}>
      <LayoutGrid style={style.annotationCreationTooltipMenu}>
        <LayoutGrid>
          <Dropdown<problemCategoryType>
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
            <Button onClick={sendProblemReport} color="primary" iconName="send">
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

  function buildProblemCategories(): Array<[problemCategoryType, string]> {
    return [
      ['BUG', wordings.problemCategory.BUG],
      ['ANNOTATION_PROBLEM', wordings.problemCategory.ANNOTATION_PROBLEM],
      ['SUGGESTION', wordings.problemCategory.SUGGESTION],
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function closeTooltipMenu(_event: MouseEvent) {
    setProblemCategory(undefined);
    setProblemDescription('');
    setIsBlocking(false);

    props.onClose();
  }

  function sendProblemReport(_event: MouseEvent) {
    closeTooltipMenu(_event);
  }
}
