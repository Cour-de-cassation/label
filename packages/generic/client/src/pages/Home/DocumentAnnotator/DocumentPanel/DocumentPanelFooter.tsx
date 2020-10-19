import React from 'react';
import { heights } from '../../../../styles';
import { Button, LayoutGrid } from '../../../../components';
import { wordings } from '../../../../wordings';

export { DocumentPanelFooter };

function DocumentPanelFooter() {
  const styles = buildStyles();
  return (
    <LayoutGrid container style={styles.container} justifyContent="space-between" alignItems="center">
      <LayoutGrid item>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="default" iconName="reset">
          {wordings.reset}
        </Button>
      </LayoutGrid>
      <LayoutGrid item>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="default" iconName="save">
          {wordings.saveDraft}
        </Button>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="primary" iconName="send">
          {wordings.validate}
        </Button>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      container: {
        height: heights.panelFooter,
      },
    };
  }
}
