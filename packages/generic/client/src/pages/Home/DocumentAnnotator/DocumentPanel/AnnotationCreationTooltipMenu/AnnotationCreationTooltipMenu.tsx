import React, { ReactElement } from 'react';
import { uniq } from 'lodash';
import { Dropdown, LayoutGrid, TooltipMenu } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { AnnotationCreationTooltipMenu };

function AnnotationCreationTooltipMenu(props: {
  anchorText: Element | undefined;
  annotatorStateHandler: annotatorStateHandlerType;
  onClose: () => void;
  text: string;
}): ReactElement {
  const style = buildStyle();
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));

  return (
    <TooltipMenu anchorElement={props.anchorText} onClose={props.onClose}>
      <LayoutGrid style={style.annotationCreationTooltipMenu}>
        <LayoutGrid>
          <Dropdown items={categories} label={wordings.category} onChange={createAnnotation}></Dropdown>
        </LayoutGrid>
      </LayoutGrid>
    </TooltipMenu>
  );

  function buildStyle() {
    return {
      annotationCreationTooltipMenu: {
        padding: '0px 10px',
      },
    };
  }

  function createAnnotation() {
    props.onClose();
    return;
  }
}
