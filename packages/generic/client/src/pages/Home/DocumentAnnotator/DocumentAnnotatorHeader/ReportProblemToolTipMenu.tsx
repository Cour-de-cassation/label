import React, { ReactElement } from 'react';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TextInputLarge, TooltipMenu } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ReportProblemToolTipMenu };

const problemCategories = ['BUG', 'ANNOTATION_PROBLEM', 'SUGGESTION'] as const;

function ReportProblemToolTipMenu(props: { anchorElement: Element | undefined; onClose: () => void }): ReactElement {
  const style = buildStyle();

  return (
    <TooltipMenu anchorElement={props.anchorElement} onClose={props.onClose}>
      <LayoutGrid style={style.annotationCreationTooltipMenu}>
        <LayoutGrid>
          <Dropdown
            items={problemCategories.map((problemCategory) => ({
              value: problemCategory,
              displayedText: wordings.problemCategory[problemCategory],
            }))}
            label={wordings.problemType}
            onChange={() => console.log()}
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
            onChange={() => console.log()}
            style={style.tooltipElement}
          />
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox
            defaultChecked={false}
            onChange={() => console.log()}
            text={wordings.problemIsBlocking}
            style={style.tooltipElement}
          ></Checkbox>
        </LayoutGrid>
        <LayoutGrid container>
          <LayoutGrid item>
            <Button onClick={() => console.log()} color="default" iconName="close">
              {wordings.cancel}
            </Button>
            <Button onClick={() => console.log()} color="primary" iconName="send">
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
}
