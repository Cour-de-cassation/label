import React, { ReactElement } from 'react';
import { uniq } from 'lodash';
import { annotationType } from '@label/core';
import { Button, Checkbox, Dropdown, LayoutGrid, Text, TooltipMenu } from '../../../../components';
import { annotatorStateType } from '../../../../services/annotatorState';
import { fetchedAnnotationType } from '../../../../types';
import { fillTemplate, wordings } from '../../../../wordings';

export { AnnotationTooltipMenu };

function AnnotationTooltipMenu(props: {
  anchorAnnotation: Element | undefined;
  annotatorState: annotatorStateType;
  annotation: fetchedAnnotationType;
  onClose: () => void;
  open: boolean;
}): ReactElement {
  const style = buildStyle();
  const categories = uniq(props.annotatorState.annotations.map((annotation) => annotation.category));
  const nbOfEntities = props.annotatorState.annotations.filter(
    (annotation) => annotation.entityId === props.annotation.entityId,
  ).length;

  return (
    <TooltipMenu anchorEl={props.anchorAnnotation} open={props.open} onClose={props.onClose}>
      <LayoutGrid style={style.annotationTooltipMenu}>
        <LayoutGrid>
          <Text>{fillTemplate(wordings.nOccurencesToObliterate, JSON.stringify(nbOfEntities))}</Text>
        </LayoutGrid>
        <LayoutGrid>
          <Checkbox text={wordings.applyEveryWhere}></Checkbox>
        </LayoutGrid>
        <LayoutGrid>
          <Dropdown defaultItem={props.annotation.category} items={categories} onChange={() => console.log}></Dropdown>
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
