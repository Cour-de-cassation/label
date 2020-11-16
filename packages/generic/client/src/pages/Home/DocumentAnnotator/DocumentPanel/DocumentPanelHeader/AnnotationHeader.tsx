import React from 'react';
import { Header, IconButton, SwitchButton, Text } from '../../../../../components';
import { heights, useCustomTheme } from '../../../../../styles';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { useViewerMode } from '../viewerMode';

export { AnnotationHeader };

function AnnotationHeader(props: { annotatorStateHandler: annotatorStateHandlerType }) {
  const theme = useCustomTheme();
  const { viewerModeHandler } = useViewerMode();
  const style = buildStyle();

  return (
    <Header
      leftHeaderComponents={[
        <IconButton
          color="default"
          disabled={!canRevertLastAction()}
          hint={wordings.undo}
          iconName="undo"
          onClick={revertLastAction}
        />,
        <IconButton
          color="default"
          disabled={!canRestoreLastAction()}
          hint={wordings.redo}
          iconName="redo"
          onClick={restoreLastAction}
        />,
      ]}
      rightHeaderComponents={[
        <Text>{wordings.anonymisedView}</Text>,
        <SwitchButton
          checked={viewerModeHandler.isAnonymizedView()}
          color="primary"
          onChange={viewerModeHandler.switchAnonymizedView}
        />,
      ]}
      spaceBetweenComponents={theme.spacing * 2}
      style={style.header}
      variant="classic"
    />
  );

  function buildStyle() {
    return {
      header: {
        height: heights.panelHeader,
      },
    };
  }

  function revertLastAction() {
    props.annotatorStateHandler.revert();
  }

  function restoreLastAction() {
    props.annotatorStateHandler.restore();
  }

  function canRevertLastAction() {
    return props.annotatorStateHandler.canRevert();
  }

  function canRestoreLastAction() {
    return props.annotatorStateHandler.canRestore();
  }
}
