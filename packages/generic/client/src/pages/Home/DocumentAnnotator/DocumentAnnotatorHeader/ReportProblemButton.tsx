import React, { MouseEvent, useState } from 'react';
import { ButtonWithIcon } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { ReportProblemToolTipMenu } from './ReportProblemToolTipMenu';

export { ReportProblemButton };

function ReportProblemButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);

  return (
    <div>
      <ButtonWithIcon color="secondary" iconName="reportProblem" onClick={openToolTip} text={wordings.reportProblem} />
      <ReportProblemToolTipMenu
        annotatorStateHandler={props.annotatorStateHandler}
        anchorElement={anchorElement}
        fetchNewDocument={props.fetchNewDocument}
        onClose={closeToolTip}
      />
    </div>
  );

  function openToolTip(event: MouseEvent<Element>) {
    setAnchorElement(event.currentTarget);
  }

  function closeToolTip() {
    setAnchorElement(undefined);
  }
}
