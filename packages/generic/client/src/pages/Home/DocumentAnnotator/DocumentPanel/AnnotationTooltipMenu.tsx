import React, { ReactElement } from 'react';
import { annotationType } from '@label/core';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TooltipMenu } from '../../../../components';
import { wordings } from '../../../../wordings';

export { AnnotationTooltipMenu };

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotation: annotationType;
  onClose: () => void;
  open: boolean;
}): ReactElement {
  const style = buildStyle();

  return (
    <TooltipMenu anchorEl={props.anchorAnnotation} open={props.open} onClose={props.onClose}>
      <LayoutGrid style={style.annotationTooltipMenu}>
        <LayoutGrid>
          <Text>TODO{wordings.nOccurencesToObliterate}</Text>
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox text={wordings.applyEveryWhere}></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown defaultItem="TODO" items={['TODO']} onChange={() => console.log}></Dropdown>
        </LayoutGrid>
        <LayoutGrid>
          <Button onClick={() => console.log()}>{wordings.delete}</Button>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      annotationTooltipMenu: {
        padding: '0px 10px',
      },
    };
  }
}
