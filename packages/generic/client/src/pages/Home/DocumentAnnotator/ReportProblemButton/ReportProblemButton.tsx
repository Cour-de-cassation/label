import { positionType } from 'packages/generic/client/src/types';
import React, { MouseEvent, useState } from 'react';
import { IconButton } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { ReportProblemToolTipMenu } from './ReportProblemToolTipMenu';

export { ReportProblemButton };

function ReportProblemButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  onStopAnnotatingDocument: () => void;
}) {
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>(undefined);
  return (
    <div>
      <IconButton color="warning" iconName="warning" onClick={openToolTip} hint={wordings.reportProblem} />
      {!!tooltipMenuOriginPosition && (
        <ReportProblemToolTipMenu
          annotatorStateHandler={props.annotatorStateHandler}
          onClose={closeToolTip}
          onStopAnnotatingDocument={props.onStopAnnotatingDocument}
          originPosition={tooltipMenuOriginPosition}
        />
      )}
    </div>
  );

  function openToolTip(event: MouseEvent<Element>) {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const originPosition = { x: buttonRect.x + buttonRect.width / 2, y: buttonRect.y };
    setTooltipMenuOriginPosition(originPosition);
  }

  function closeToolTip() {
    setTooltipMenuOriginPosition(undefined);
  }
}
