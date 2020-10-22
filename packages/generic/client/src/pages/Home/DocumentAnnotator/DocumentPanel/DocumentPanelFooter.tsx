import React from 'react';
import { heights } from '../../../../styles';
import { Button, LayoutGrid } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { wordings } from '../../../../wordings';
import { useTheme, Theme } from '@material-ui/core';

export { DocumentPanelFooter };

function DocumentPanelFooter(props: { annotatorStateHandler: annotatorStateHandlerType }) {
  const theme = useTheme();
  const styles = buildStyles(theme);
  return (
    <LayoutGrid container style={styles.footer} justifyContent="space-between" alignItems="center">
      <LayoutGrid item>
        <Button onClick={() => props.annotatorStateHandler.reinitialize()} color="default" iconName="reset">
          {wordings.reset}
        </Button>
      </LayoutGrid>
      <LayoutGrid item>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="default" iconName="save" style={styles.saveDraftButton}>
          {wordings.saveDraft}
        </Button>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="primary" iconName="send">
          {wordings.validate}
        </Button>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: Theme) {
    return {
      footer: {
        height: heights.panelFooter,
        paddingRight: theme.spacing(2),
      },
      saveDraftButton: {
        marginRight: theme.spacing(2),
      },
    };
  }
}
