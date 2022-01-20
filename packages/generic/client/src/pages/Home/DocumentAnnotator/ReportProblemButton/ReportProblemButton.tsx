import React, { MouseEvent, useState } from 'react';
import { IconButton, positionType } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { ReportProblemToolTipMenu } from './ReportProblemToolTipMenu';

export { ReportProblemButton };

function ReportProblemButton(props: { onStopAnnotatingDocument?: () => Promise<void> }) {
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>(undefined);
  return (
    <div>
      <IconButton iconName="warning" onClick={openToolTip} hint={wordings.homePage.reportProblem} color="warning" />
      {!!tooltipMenuOriginPosition && (
        <ReportProblemToolTipMenu
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
